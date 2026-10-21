<script lang="ts">
  import { onDestroy, tick, untrack } from 'svelte';
  import { app, go } from '../lib/state/app.svelte';
  import { onlineEnabled } from '../lib/data';
  import { replay, winner, isStandard, sizeLabel, type Player } from '../lib/engine/rules';
  import { choiceSize, fits, type BoardChoice } from '../lib/boardFit';
  import { initials } from '../lib/format';
  import { sfx } from '../lib/sound';
  import { confetti } from '../lib/confetti';
  import { boxesThisTurn } from '../lib/extraTurn';
  import { roomSize, type Room } from '../lib/online/types';
  import { saveRoom, clearRoom, roomEnded } from '../lib/resume';
  import Board from '../components/Board.svelte';
  import PlayerCards from '../components/PlayerCards.svelte';
  import SizePicker from '../components/SizePicker.svelte';
  import BackTitle from '../components/BackTitle.svelte';
  import TopBar from '../components/TopBar.svelte';
  import ResultsModal from '../components/ResultsModal.svelte';

  let { joinCode = '' }: { joinCode?: string } = $props();

  let phase = $state<'lobby' | 'rejoining' | 'waiting' | 'playing'>('lobby');
  let board = $state<BoardChoice>({ custom: false, n: 3, rows: 4, cols: 6 });
  // joinCode is only read once, on arrival from an invite link.
  // svelte-ignore state_referenced_locally
  let codeIn = $state(joinCode), code = $state(''), seat = $state<Player>(0);
  let room = $state<Room | null>(null), error = $state(''), info = $state(''), busy = $state(false), copied = $state(false), dismissed = $state(-1);
  let unwatch: (() => void) | null = null, unpresence: (() => void) | null = null, api: typeof import('../lib/online/room') | null = null;
  // The friend's connection from presence/ (null: these rules can't tell, so the room's old online flag decides),
  // when they were last seen leaving, and whether this device is connected.
  let friendHere = $state<boolean | null>(null), awaySince = $state<number | null>(null);
  let offlineSince = $state<number | null>(null), everConnected = false, now = $state(Date.now());
  // A move not yet confirmed by the server after 0.6 s says "Sending…".
  let sending = $state(false);
  const loadApi = async () => (api ??= await import('../lib/online/room'));
  // ?debug=net: the move timings panel (its code loads only then).
  const debugNet = new URLSearchParams(location.search).get('debug') === 'net';
  let dbg: ReturnType<typeof import('../lib/online/netdebug').startNetDebug> | null = null, heardLen = -1;

  // Derived game view: rebuilt from the room's move list every time it changes.
  const size = $derived(room ? roomSize(room) : null);
  const sizeTag = $derived(size ? (isStandard(size) ? sizeLabel(size) : `Custom ${sizeLabel(size)}`) : '');
  const st = $derived(room && size ? replay(size, room.first, room.moves ?? []) : null);
  const lines = $derived(st ? st.moves.map(e => ({ e, p: st.lines[e] })) : []);
  const boxes = $derived(st ? [...st.owner].flatMap((p, b) => (p >= 0 ? [{ b, p }] : [])) : []);
  const names = $derived<[string, string]>([room?.names?.host ?? 'Host', room?.names?.guest ?? 'Friend']);
  // Two players who never set a name are both "Player": say "Your friend" rather than a name that could be yours.
  const friendName = $derived(names[1 - seat] === names[seat] ? 'Your friend' : names[1 - seat]);
  const ini = $derived(initials(names[0], names[1]));
  const friendUid = $derived(room ? (seat === 0 ? room.guest : room.host) : null);
  const friendOnline = $derived(!!friendUid && (friendHere === true || !!room?.online?.[friendUid]));
  const over = $derived(!!st?.over);
  // Moves never wait for presence: a friend who stepped away sees the move when they're back.
  const myTurn = $derived(!!st && !st.over && st.turn === seat);
  const extra = $derived(room && size ? boxesThisTurn(size, room.first, room.moves ?? []) : 0);   // the extra-turn cue

  // Nothing changes for the first 10 s a friend is gone (network blips); then a calm note,
  // and after 2 minutes an offer to leave (nothing is scored). Your own connection shows
  // "Reconnecting…" once it has been down for 2 s.
  $effect(() => {
    const gone = phase === 'playing' && !!friendUid && !over && !friendOnline;
    untrack(() => { if (gone && awaySince === null) { awaySince = now = Date.now(); } else if (!gone) awaySince = null; });
  });
  $effect(() => {
    if (awaySince === null && offlineSince === null) return;
    const t = setInterval(() => (now = Date.now()), 1000);
    return () => clearInterval(t);
  });
  const away = $derived(awaySince !== null && now - awaySince >= 10_000);
  const longAway = $derived(awaySince !== null && now - awaySince >= 120_000);
  const reconnecting = $derived(offlineSince !== null && now - offlineSince >= 2000);
  // The game on screen draws its own top bar (App leaves its out meanwhile).
  const inGame = $derived(phase === 'playing' && !!room && !!st && !!size);
  $effect(() => { app.playing = inGame; });
  function onSelf(up: boolean) {
    if (up) { everConnected = true; offlineSince = null; }
    else if (everConnected && offlineSince === null) offlineSince = now = Date.now();
  }
  $effect(() => {
    const uid = friendUid, c = code;
    if (!uid || !c || !api) return;
    const off = api.watchFriend(c, uid, v => (friendHere = v));
    return () => { off(); friendHere = null; };
  });

  // A finished game with no rematch stops being offered for rejoining after 10 minutes.
  $effect(() => { if (code && st) roomEnded(st.over); });

  // Sound + confetti when moves arrive or the game ends. Our own line dragged in drops in with its own sound (ownDrop: its
  // move number); every other line plays the line's note.
  let lastLen = 0, ownDrop = -1;
  $effect(() => {
    const len = st?.moves.length ?? 0;
    if (st && len > lastLen) sfx.play(ownDrop === len - 1 ? 'drop' : 'line');
    if (st?.over && len !== lastLen) { const w = winner(st); sfx.play(w === seat ? 'win' : w === -1 ? 'draw' : 'lose'); if (w === seat && app.settings.anim) confetti(); }
    lastLen = len;
  });

  async function watch() {
    const a = await loadApi();
    if (debugNet && !dbg) dbg = (await import('../lib/online/netdebug')).startNetDebug(a, code, seat);
    unwatch = await a.watchRoom(code, r => {
      room = r;
      if (!r) { stop(); clearRoom(); error = 'This game was closed.'; phase = 'lobby'; return; }
      if (phase === 'waiting' && r.guest) phase = 'playing';
      if (dbg) { timeHeard(r); dbg.update(r); }
    });
    unpresence = await a.joinPresence(code, onSelf);
  }
  function stop() { unwatch?.(); unpresence?.(); unwatch = unpresence = null; dbg?.stop(); dbg = null; heardLen = -1; }
  /** ?debug=net: stamp the other player's new moves as heard now and shown once on screen. */
  function timeHeard(r: Room) {
    const moves = r.moves ?? [], size = roomSize(r);
    if (heardLen >= 0) for (let i = heardLen; i < moves.length; i++) {
      if (replay(size, r.first, moves.slice(0, i)).turn === seat) continue;   // our own move, coming back
      dbg?.heard(i);
      tick().then(() => requestAnimationFrame(() => dbg?.shown(i)));
    }
    heardLen = moves.length;
  }
  // While waiting on the other player (their turn, or for them to join), check every 4 s that the connection still
  // answers, and replace it if not (checkLink): a phone can lose it without noticing and keep an old board.
  $effect(() => {
    const c = code;
    if (!c || !(phase === 'waiting' || (phase === 'playing' && !myTurn))) return;
    const t = setInterval(() => { if (document.visibilityState === 'visible') api?.checkLink(c, 3500); }, 4000);
    return () => clearInterval(t);
  });
  // Back from the background (phones freeze hidden tabs) or back online: the same check at once, so the board
  // catches up straight away. (A plain read can't tell: Firebase answers it from what it last heard.)
  function wake() {
    if (document.visibilityState !== 'visible' || !code || !api || !unwatch) return;
    api.checkLink(code, 2500);
  }
  async function create() {
    busy = true; error = '';
    try { const a = await loadApi(); code = await a.createRoomSafe(app.profile?.name ?? 'Player', choiceSize(board)); seat = 0; saveRoom(code, seat); phase = 'waiting'; await watch(); }
    catch (e) { error = e instanceof Error ? e.message : 'Could not create a game.'; }
    busy = false;
  }
  async function join() {
    const c = codeIn.trim().toUpperCase();
    if (c.length !== 5) { error = 'Codes are 5 characters.'; return; }
    busy = true; error = '';
    try { const a = await loadApi(); ({ seat } = await a.joinRoom(c, app.profile?.name ?? 'Player', fits)); code = c; saveRoom(code, seat); phase = 'playing'; await watch(); }
    catch (e) { error = e instanceof Error ? e.message : 'Could not join that game.'; }
    busy = false;
  }
  // After a reload or a browser restart: back into the saved room at the same seat.
  // A read that can't reach the database waits forever, so the rejoin gets 8 s; the room stays saved for "Try again".
  let retry = $state<{ code: string; seat: Player } | null>(null);
  async function rejoin(c: string, s: Player) {
    busy = true; error = info = ''; retry = null; phase = 'rejoining';
    try {
      const a = await loadApi();
      const r = await Promise.race([a.rejoinRoom(c, s), new Promise<never>((_, fail) => setTimeout(() => fail(new Error('timeout')), 8000))]);
      if (!r) { clearRoom(); info = 'That game has ended.'; phase = 'lobby'; }
      else { code = c; seat = s; room = r; phase = r.guest ? 'playing' : 'waiting'; await watch(); }
    } catch { phase = 'lobby'; retry = { code: c, seat: s }; info = "Couldn't reach your game. Check your connection, then try again."; }
    busy = false;
  }
  async function move(e: number, how?: 'tap' | 'drag' | 'key') {
    if (!room || !api || !myTurn || !st || st.lines[e] >= 0) return;
    const a = api, c = code, n = st.moves.length;
    ownDrop = how === 'drag' ? n : -1;
    dbg?.sent(n);
    // The line shows at once (Firebase applies the write locally first). A slow network says "Sending…"; no answer
    // after 3 s means the connection may be dead, so check it (a new one resends the move).
    const slow = setTimeout(() => (sending = true), 600), stuck = setTimeout(() => a.checkLink(c, 2000), 3000);
    if (dbg) tick().then(() => requestAnimationFrame(() => dbg?.ownShown(n)));
    try {
      // Rooms with server-checked turns also send who moves next: the same player if this line closes a box.
      const checked = room.v === 2 && size ? { seat, next: replay(size, room.first, [...st.moves, e]).turn } : undefined;
      const ok = await a.sendMove(c, e, n, checked);
      dbg?.confirmed(n);
      error = ok ? '' : 'That move could not be sent. The board has been refreshed.';
    } catch { error = 'That move could not be sent. Tap again.'; }
    finally { clearTimeout(slow); clearTimeout(stuck); sending = false; }
  }
  async function copyInvite() {
    const url = `${location.origin}${location.pathname}?room=${code}`;
    const text = `Play Grid Rivals (Dots & Boxes) with me! ${url}`;
    try { await navigator.clipboard.writeText(text); copied = true; setTimeout(() => (copied = false), 1500); } catch { prompt('Copy this invite:', text); }
  }
  function leave() { stop(); clearRoom(); room = null; phase = 'lobby'; code = ''; go('home'); }

  // svelte-ignore state_referenced_locally
  if (joinCode && onlineEnabled) join();
  else if (app.roomResume && onlineEnabled) { const r = app.roomResume; app.roomResume = null; rejoin(r.code, r.seat); }
  document.addEventListener('visibilitychange', wake); addEventListener('pageshow', wake); addEventListener('online', wake);
  onDestroy(() => { app.playing = false; stop(); document.removeEventListener('visibilitychange', wake); removeEventListener('pageshow', wake); removeEventListener('online', wake); });
</script>

{#if !onlineEnabled}
  <section aria-labelledby="onTitle">
    <BackTitle title="Play online" id="onTitle" />
    <div class="panel"><p>Online play isn't switched on for this copy of the game yet.</p></div>
  </section>
{:else if phase === 'lobby'}
  <section aria-labelledby="onTitle" class="stack">
    <BackTitle title="Play a friend online" id="onTitle" />
    <p class="muted net" role="status">{info}</p>
    {#if retry}<button class="btn small" disabled={busy} onclick={() => retry && rejoin(retry.code, retry.seat)}>Try again</button>{/if}
    <div class="panel">
      <h3>Start a game</h3>
      <p class="muted">You get a code to send your friend.</p>
      <div class="field"><span class="lab">Board size</span><SizePicker bind:value={board} /></div>
      {#if board.custom}<p class="help">Your friend's screen needs room for this board too. Phones fit up to about 7×7.</p>{/if}
      <button class="btn primary block" style="margin-top:14px" disabled={busy} onclick={create}>Create game</button>
    </div>
    <div class="panel">
      <h3>Join a game</h3>
      <div class="row"><input class="code-in" type="text" maxlength="5" aria-label="Game code" placeholder="CODE" autocomplete="off" bind:value={codeIn} /><button class="btn primary" disabled={busy} onclick={join}>Join</button></div>
    </div>
    <p class="err" role="alert">{error}</p>
  </section>
{:else if phase === 'rejoining'}
  <section class="panel" style="text-align:center" aria-live="polite"><p class="muted">Getting back into your game…</p></section>
{:else if phase === 'waiting'}
  <section class="panel" style="text-align:center" aria-live="polite">
    <h2>Waiting for your friend</h2>
    <p class="muted">Send them this code, or copy an invite link.</p>
    <div class="code-big">{code}</div>
    <div class="row"><button class="btn" style="flex:1" onclick={copyInvite}>{copied ? 'Copied' : 'Copy invite'}</button><button class="btn" style="flex:1" onclick={leave}>Cancel</button></div>
  </section>
{:else if room && st && size}
  <!-- The game layout (app.css), as on the Game screen. A note or an error takes the chips' place while it lasts (so the board
       never moves); after 2 minutes away, Leave becomes the main button. -->
  <section class="game fit own-bar" aria-label="Online game">
    <TopBar />
    <PlayerCards {names} subs={[seat === 0 ? 'You' : 'Host', seat === 1 ? 'You' : 'Guest']} score={[st.score[0], st.score[1]]} turn={st.turn} {over} {extra} you={seat}>
      {#snippet meta()}<span class="chip">{sizeTag}</span><span class="chip">Game {room?.game}</span><span class="chip">Code <b>{code}</b></span>
        <p class="net" role="status">{#if reconnecting}Reconnecting…{:else if sending}Sending…{:else if longAway}{friendName} has been away for 2 minutes. Leaving won't count as a loss.{:else if away}{friendName} stepped away.{myTurn ? ' Your move will be waiting.' : ''}{/if}</p><p class="err" role="alert">{error}</p>{/snippet}
    </PlayerCards>
    <div class="play">
      <Board rows={size.rows} cols={size.cols} {lines} {boxes} turn={st.turn} interactive={myTurn} initials={ini} anim={app.settings.anim} onmove={move} />
      <div class="game-actions"><button class="btn small" class:primary={longAway && !reconnecting} onclick={leave}>Leave</button></div>
    </div>
  </section>
  {#if over && dismissed !== room.game}
    {@const w = winner(st)}
    <ResultsModal info={{ kind: w === -1 ? 'draw' : w === seat ? 'win' : 'loss', title: w === -1 ? 'A draw' : w === seat ? 'You win!' : `${names[w as Player]} wins`, score: [st.score[0], st.score[1]], ms: 0, tags: [sizeTag, 'Online'] }}
      primary={{ label: 'Rematch', run: () => { dismissed = room!.game; api?.rematch(code); } }}
      secondary={[{ label: 'Leave', run: leave }]} />
  {/if}
{/if}

<style>
  /* Takes no room until there is something to say; stays in the page so screen readers hear it. (In a game, app.css puts it in
     the chips' place.) */
  .net:not(:global(.meta) .net) { margin: 8px 0 0; font-weight: 600; text-wrap: pretty; }
  .net:not(:global(.meta) .net):empty { margin: 0; }
</style>
