<script lang="ts">
  import { onDestroy } from 'svelte';
  import { app, go, data, refreshScores } from '../lib/state/app.svelte';
  import { newGame, play, winner, isStandard, sizeLabel, type GameState, type Player } from '../lib/engine/rules';
  import { choiceSize } from '../lib/boardFit';
  import { chooseMove, resetAI } from '../lib/engine/ai';
  import { xpFor, level, stats } from '../lib/progression';
  import { AI_NAMES, DIFF_LABEL, fmtClock, fmtTime, initials, uid } from '../lib/format';
  import { sfx } from '../lib/sound';
  import { confetti } from '../lib/confetti';
  import type { ScoreEntry, Leaderboard } from '../lib/data/types';
  import Board from '../components/Board.svelte';
  import PlayerCards from '../components/PlayerCards.svelte';
  import ResultsModal, { type ResultInfo } from '../components/ResultsModal.svelte';

  // Game settings are frozen at start so changing Setup mid-game can't affect it.
  let cfg = $state({ ...app.cfg, board: { ...app.cfg.board } });
  const vsAI = () => cfg.mode === 'ai';
  const size = $derived(choiceSize(cfg.board));
  const ranked = $derived(isStandard(size));            // only the 4 standard squares have leaderboards
  const sizeTag = $derived(ranked ? sizeLabel(size) : `Custom ${sizeLabel(size)}`);

  let st: GameState;
  let lines = $state<{ e: number; p: number }[]>([]);
  let boxes = $state<{ b: number; p: number }[]>([]);
  let score = $state<[number, number]>([0, 0]);
  let turn = $state<Player>(0);
  let over = $state(false);
  let thinking = $state(false);
  let ms = $state(0);
  let result = $state<ResultInfo | null>(null);
  let announce = $state('');
  let token = 0, t0 = 0, clock: ReturnType<typeof setInterval> | undefined;

  const names = $derived<[string, string]>([app.profile?.name ?? 'Player', vsAI() ? AI_NAMES[cfg.diff] : cfg.p2]);
  const ini = $derived(initials(names[0], names[1]));
  const L = $derived(level(stats(app.scores).xp));
  const subs = $derived<[string, string]>(vsAI() ? [`Level ${L.level}`, `${DIFF_LABEL[cfg.diff]} AI`] : ['Player 1', 'Player 2']);
  const turnText = $derived(over ? 'Game over' : thinking ? `${names[1]} is thinking` : vsAI() ? 'Your turn' : `${names[turn]}'s turn`);
  const humanTurn = $derived(!over && !thinking && (!vsAI() || turn === 0));

  function start() {
    token++; clearInterval(clock);
    cfg = { ...app.cfg, board: { ...app.cfg.board } };
    const first = (cfg.first === 'r' ? (Math.random() < 0.5 ? 0 : 1) : +cfg.first) as Player;
    st = newGame(size, first);
    lines = []; boxes = []; score = [0, 0]; turn = first; over = false; thinking = false; result = null; ms = 0;
    resetAI();
    t0 = performance.now();
    clock = setInterval(() => { if (!over) ms = performance.now() - t0; }, 250);
    announce = `${names[first]} starts.`;
    queueAI();
  }

  /** Apply a move, update the view, then pass control on. */
  function commit(e: number) {
    const p = st.turn, done = play(st, e);
    if (done === null) return;
    lines.push({ e, p });
    for (const b of done) boxes.push({ b, p });
    score = [st.score[0], st.score[1]]; turn = st.turn;
    sfx.play(done.length ? 'box' : 'line');
    announce = `${names[p]} drew a line${done.length ? ` and closed ${done.length} box${done.length > 1 ? 'es' : ''}` : ''}. Score ${score[0]} to ${score[1]}.`;
    if (st.over) { over = true; ms = performance.now() - t0; clearInterval(clock); setTimeout(finish, app.settings.anim ? 500 : 60); }
    else queueAI();
  }

  async function queueAI() {
    if (!vsAI() || st.over || st.turn !== 1) return;
    const my = token; thinking = true;
    const started = performance.now(), delay = 300 + Math.random() * 500; // readable "thinking" pause
    const e = await chooseMove(st, cfg.diff);
    const wait = delay - (performance.now() - started);
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    if (my !== token) return;               // game was restarted or left meanwhile
    thinking = false; commit(e);
  }

  async function finish() {
    const my = token, w = winner(st);
    if (!vsAI()) {
      result = { kind: w === -1 ? 'draw' : 'win', title: w === -1 ? 'A draw' : `${names[w as Player]} wins!`, score, ms, tags: [sizeTag] };
      sfx.play(w === -1 ? 'draw' : 'win'); if (app.settings.anim && w !== -1) confetti();
      return;
    }
    const res = w === -1 ? 'draw' : w === 0 ? 'win' : 'loss';
    const margin = Math.abs(score[0] - score[1]), xp = xpFor(res, size.rows, size.cols, cfg.diff, margin);
    const prevXp = stats(app.scores).xp, tag = `${sizeLabel(size)} ${DIFF_LABEL[cfg.diff]}`;
    const info: ResultInfo = {
      kind: res, title: { win: 'You win!', loss: `${names[1]} wins`, draw: 'A draw' }[res], score, ms,
      tags: [sizeTag, DIFF_LABEL[cfg.diff]], xp: { gained: xp, before: prevXp, after: prevXp + xp },
    };
    sfx.play(res === 'win' ? 'win' : res === 'draw' ? 'draw' : 'lose');
    if (app.settings.anim && res === 'win') confetti();
    result = info;

    // Save, then compare with the leaderboard. Failures never block the results screen.
    const entry: ScoreEntry = { id: uid(), uid: app.profile!.uid, name: app.profile!.name,
      n: ranked ? size.rows : 0, rows: size.rows, cols: size.cols, custom: !ranked, diff: cfg.diff, result: res,
      ms: Math.round(ms), mine: score[0], theirs: score[1], xp, date: Date.now(), first: st.first, moves: [...st.moves] };
    if (!ranked) {
      // Custom boards count toward stats and XP, but have no leaderboard to compare against.
      try { await data().saveScore(entry); await refreshScores(); }
      catch { if (my === token) result = { ...info, compare: 'Could not save this game online. Check your connection.' }; return; }
      if (my === token) result = { ...info, compare: 'Custom boards earn XP but aren\'t ranked. Play a standard size to get on the leaderboard.' };
      return;
    }
    try {
      let before: Leaderboard | null = null;
      try { before = await data().getLeaderboard(size.rows, cfg.diff, 'fast'); } catch {}
      await data().saveScore(entry);
      await refreshScores();
      const after = await data().getLeaderboard(size.rows, cfg.diff, 'fast');
      if (my !== token) return;
      const top = after.rows[0], me = after.me, streak = stats(app.scores).cur;
      let compare = '', hi = false;
      if (res === 'win') {
        if (me?.rank === 1 && me.row.best === entry.ms) { compare = `New #1 fastest win on ${tag}!`; hi = true; }
        else if (me?.rank === 1 && top) compare = `You still hold #1 on ${tag} (${fmtTime(top.best!)}). This win was ${fmtTime(entry.ms - top.best!)} slower.`;
        else if (top?.best != null) compare = `You were ${fmtTime(entry.ms - top.best)} slower than the #1 time on ${tag} (${top.name}, ${fmtTime(top.best)}).`;
        if (streak >= 2) compare += ` Win streak: ${streak}.`;
      } else compare = top?.best != null ? `The fastest win on ${tag} is ${fmtTime(top.best)} by ${top.name}. Beat the AI to get on the board.` : `Nobody has beaten ${tag} yet. Be the first.`;
      let rank = '';
      if (me) rank = !before?.me ? `You entered the fastest-win board at #${me.rank}.` : me.rank < before.me.rank ? `Fastest-win rank: #${before.me.rank} → #${me.rank}` : `Fastest-win rank: #${me.rank}`;
      result = { ...info, compare, compareHi: hi, rank };
    } catch {
      if (my === token) result = { ...info, compare: 'Could not save this game online. Check your connection.' };
    }
  }

  function quit() { if (!over && st.moves.length && !confirm("Quit this game? It won't count.")) return; token++; go('home'); }
  function restart() { if (!over && st.moves.length && !confirm('Restart this game?')) return; start(); }

  start();
  onDestroy(() => { token++; clearInterval(clock); });
</script>

<section aria-label="Game">
  <PlayerCards {names} initials={ini} {subs} {score} {turn} {over} {turnText} {thinking} />
  <div class="meta">
    <span class="chip" title="Elapsed time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg><b>{fmtClock(ms)}</b></span>
    <span class="chip">{sizeTag}</span>
    {#if vsAI()}<span class="chip">{DIFF_LABEL[cfg.diff]}</span>{/if}
    <span class="chip">Lv {L.level}<span class="mini"><i style:width="{L.pct}%"></i></span></span>
  </div>
  <Board rows={size.rows} cols={size.cols} {lines} {boxes} {turn} interactive={humanTurn} initials={ini} anim={app.settings.anim} onmove={commit} />
  <div class="game-actions">
    <button class="btn small" onclick={quit}>Quit</button>
    <button class="btn small" onclick={restart}>Restart</button>
  </div>
  <p class="sr" aria-live="polite">{announce}</p>
</section>

{#if result}
  <ResultsModal info={result}
    primary={{ label: 'Play again', run: start }}
    secondary={[
      { label: 'Change settings', run: () => go('setup') },
      ...(vsAI() && ranked ? [{ label: 'Leaderboard', run: () => { app.lb.n = size.rows; app.lb.diff = cfg.diff; go('lb'); } }] : []),
    ]} />
{/if}
