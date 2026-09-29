<script lang="ts">
  import { onDestroy } from 'svelte';
  import { app, go } from '../lib/state/app.svelte';
  import { onlineEnabled } from '../lib/data';
  import { replay, winner, isStandard, sizeLabel, type Player } from '../lib/engine/rules';
  import { choiceSize, fits, type BoardChoice } from '../lib/boardFit';
  import { initials } from '../lib/format';
  import { sfx } from '../lib/sound';
  import { confetti } from '../lib/confetti';
  import { roomSize, type Room } from '../lib/online/types';
  import Board from '../components/Board.svelte';
  import PlayerCards from '../components/PlayerCards.svelte';
  import SizePicker from '../components/SizePicker.svelte';
  import BackTitle from '../components/BackTitle.svelte';
  import ResultsModal from '../components/ResultsModal.svelte';

  let { joinCode = '' }: { joinCode?: string } = $props();

  let phase = $state<'lobby' | 'waiting' | 'playing'>('lobby');
  let board = $state<BoardChoice>({ custom: false, n: 3, rows: 4, cols: 6 });
  // joinCode is only read once, on arrival from an invite link.
  // svelte-ignore state_referenced_locally
  let codeIn = $state(joinCode), code = $state(''), seat = $state<Player>(0);
  let room = $state<Room | null>(null), error = $state(''), busy = $state(false), copied = $state(false), dismissed = $state(-1);
  let unwatch: (() => void) | null = null, api: typeof import('../lib/online/room') | null = null;
  const loadApi = async () => (api ??= await import('../lib/online/room'));

  // Derived game view: rebuilt from the room's move list every time it changes.
  const size = $derived(room ? roomSize(room) : null);
  const sizeTag = $derived(size ? (isStandard(size) ? sizeLabel(size) : `Custom ${sizeLabel(size)}`) : '');
  const st = $derived(room && size ? replay(size, room.first, room.moves ?? []) : null);
  const lines = $derived(st ? st.moves.map(e => ({ e, p: st.lines[e] })) : []);
  const boxes = $derived(st ? [...st.owner].flatMap((p, b) => (p >= 0 ? [{ b, p }] : [])) : []);
  const names = $derived<[string, string]>([room?.names?.host ?? 'Host', room?.names?.guest ?? 'Friend']);
  const ini = $derived(initials(names[0], names[1]));
  const friendUid = $derived(room ? (seat === 0 ? room.guest : room.host) : null);
  const friendOnline = $derived(!!(friendUid && room?.online?.[friendUid]));
  const over = $derived(!!st?.over);
  const myTurn = $derived(!!st && !st.over && st.turn === seat && friendOnline);
  const turnText = $derived(!st ? '' : st.over ? 'Game over' : !friendOnline ? 'Waiting for your friend to reconnect' : st.turn === seat ? 'Your turn' : `${names[st.turn]}'s turn`);

  // Sound + confetti when moves arrive or the game ends.
  let lastLen = 0;
  $effect(() => {
    const len = st?.moves.length ?? 0;
    if (st && len > lastLen) sfx.play('line');
    if (st?.over && len !== lastLen) { const w = winner(st); sfx.play(w === seat ? 'win' : w === -1 ? 'draw' : 'lose'); if (w === seat && app.settings.anim) confetti(); }
    lastLen = len;
  });

  async function watch() {
    const a = await loadApi();
    unwatch = await a.watchRoom(code, r => {
      room = r;
      if (!r) { error = 'This game was closed.'; phase = 'lobby'; return; }
      if (phase === 'waiting' && r.guest) phase = 'playing';
    });
  }
  async function create() {
    busy = true; error = '';
    try { const a = await loadApi(); code = await a.createRoomSafe(app.profile?.name ?? 'Player', choiceSize(board)); seat = 0; phase = 'waiting'; await watch(); }
    catch (e) { error = e instanceof Error ? e.message : 'Could not create a game.'; }
    busy = false;
  }
  async function join() {
    const c = codeIn.trim().toUpperCase();
    if (c.length !== 5) { error = 'Codes are 5 characters.'; return; }
    busy = true; error = '';
    try { const a = await loadApi(); ({ seat } = await a.joinRoom(c, app.profile?.name ?? 'Player', fits)); code = c; phase = 'playing'; await watch(); }
    catch (e) { error = e instanceof Error ? e.message : 'Could not join that game.'; }
    busy = false;
  }
  async function move(e: number) {
    if (!room || !api || !myTurn) return;
    const ok = await api.sendMove(code, seat, e, room.moves?.length ?? 0);
    if (!ok) error = 'That move could not be sent. The board has been refreshed.';
    else error = '';
  }
  async function copyInvite() {
    const url = `${location.origin}${location.pathname}?room=${code}`;
    const text = `Play Grid Rivals (Dots & Boxes) with me! ${url}`;
    try { await navigator.clipboard.writeText(text); copied = true; setTimeout(() => (copied = false), 1500); } catch { prompt('Copy this invite:', text); }
  }
  function leave() { unwatch?.(); unwatch = null; room = null; phase = 'lobby'; code = ''; go('home'); }

  // svelte-ignore state_referenced_locally
  if (joinCode && onlineEnabled) join();
  onDestroy(() => unwatch?.());
</script>

{#if !onlineEnabled}
  <section aria-labelledby="onTitle">
    <BackTitle title="Play online" id="onTitle" />
    <div class="panel"><p>Online play isn't switched on for this copy of the game yet.</p></div>
  </section>
{:else if phase === 'lobby'}
  <section aria-labelledby="onTitle" class="stack">
    <BackTitle title="Play a friend online" id="onTitle" />
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
{:else if phase === 'waiting'}
  <section class="panel" style="text-align:center" aria-live="polite">
    <h2>Waiting for your friend</h2>
    <p class="muted">Send them this code, or copy an invite link.</p>
    <div class="code-big">{code}</div>
    <div class="row"><button class="btn" style="flex:1" onclick={copyInvite}>{copied ? 'Copied' : 'Copy invite'}</button><button class="btn" style="flex:1" onclick={leave}>Cancel</button></div>
  </section>
{:else if room && st && size}
  <section aria-label="Online game">
    <PlayerCards {names} initials={ini} subs={[seat === 0 ? 'You' : 'Host', seat === 1 ? 'You' : 'Guest']} score={[st.score[0], st.score[1]]} turn={st.turn} {over} {turnText} />
    <div class="meta"><span class="chip">{sizeTag}</span><span class="chip">Game {room.game}</span><span class="chip">Code <b>{code}</b></span></div>
    <Board rows={size.rows} cols={size.cols} {lines} {boxes} turn={st.turn} interactive={myTurn} initials={ini} anim={app.settings.anim} onmove={move} />
    <p class="err" role="alert">{error}</p>
    <div class="game-actions"><button class="btn small" onclick={leave}>Leave</button></div>
  </section>
  {#if over && dismissed !== room.game}
    {@const w = winner(st)}
    <ResultsModal info={{ kind: w === -1 ? 'draw' : w === seat ? 'win' : 'loss', title: w === -1 ? 'A draw' : w === seat ? 'You win!' : `${names[w as Player]} wins`, score: [st.score[0], st.score[1]], ms: 0, tags: [sizeTag, 'Online'] }}
      primary={{ label: 'Rematch', run: () => { dismissed = room!.game; api?.rematch(code); } }}
      secondary={[{ label: 'Leave', run: leave }]} />
  {/if}
{/if}
