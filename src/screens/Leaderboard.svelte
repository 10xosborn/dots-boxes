<script lang="ts">
  import { app, data } from '../lib/state/app.svelte';
  import { boardRow } from '../lib/progression';
  import { fmtTime, DIFF_LABEL } from '../lib/format';
  import { MIN_RATE_GAMES, type Leaderboard, type LbRow } from '../lib/data/types';
  import Seg from '../components/Seg.svelte';
  import BackTitle from '../components/BackTitle.svelte';

  let board = $state<Leaderboard | null>(null);
  let error = $state('');
  let req = 0;

  $effect(() => {
    const { n, diff, view } = app.lb, my = ++req;
    board = null; error = '';
    data().getLeaderboard(n, diff, view)
      .then(b => { if (my === req) board = b; })
      .catch(() => { if (my === req) error = 'Could not load the leaderboard. Check your connection and try again.'; });
  });

  const val = (r: LbRow) => app.lb.view === 'fast' ? fmtTime(r.best!) : app.lb.view === 'wins' ? `${r.wins}` : `${Math.round(100 * (r.rate ?? 0))}%`;
  const sub = (r: LbRow) => app.lb.view === 'wins' ? `${r.games} games` : app.lb.view === 'rate' ? `${r.wins} of ${r.games} won` : `${r.wins} win${r.wins === 1 ? '' : 's'}`;
  const help = $derived({ fast: 'Best winning time against the AI. Lower is better.', wins: 'Total wins against the AI.', rate: `Win percentage, for players with at least ${MIN_RATE_GAMES} games.` }[app.lb.view]);
  const myGames = $derived(boardRow(app.scores, app.lb.n, app.lb.diff, '', '').games);
  const meId = $derived(app.profile?.uid);
</script>

<section aria-labelledby="lbTitle">
  <BackTitle title="Leaderboard" id="lbTitle" />
  <div class="panel">
    <Seg label="Board size" bind:value={app.lb.n} options={[3, 4, 5, 6].map(v => ({ v, label: `${v}×${v}` }))} />
    <div style="margin-top:8px"><Seg label="Difficulty" bind:value={app.lb.diff} options={[{ v: 'easy', label: 'Easy' }, { v: 'medium', label: 'Medium' }, { v: 'hard', label: 'Hard' }]} /></div>
    <div class="tabs"><Seg label="Ranking" bind:value={app.lb.view} options={[{ v: 'fast', label: 'Fastest win' }, { v: 'wins', label: 'Most wins' }, { v: 'rate', label: 'Win rate' }]} /></div>
    <p class="help" style="margin:0 0 8px">{help}{#if app.lb.view === 'rate' && myGames < MIN_RATE_GAMES} Play {MIN_RATE_GAMES - myGames} more game{MIN_RATE_GAMES - myGames === 1 ? '' : 's'} here to qualify.{/if}</p>
    {#if error}
      <p class="loading">{error}</p>
    {:else if !board}
      <p class="loading">Loading…</p>
    {:else if !board.rows.length}
      <p class="loading">No ranked players yet on {app.lb.n}×{app.lb.n} {DIFF_LABEL[app.lb.diff]}. Win a game there to claim the first spot.</p>
    {:else}
      <ol class="lb">
        {#each board.rows as r, i (r.uid)}
          <li class:me={r.uid === meId}><span class="rk">{i + 1}</span><span class="nm">{r.name}{r.uid === meId ? ' (you)' : ''}<small>{sub(r)}</small></span><span class="val">{val(r)}</span></li>
        {/each}
        {#if board.me && board.me.rank > board.rows.length}
          <li class="gap" aria-hidden="true">⋯</li>
          <li class="me"><span class="rk">{board.me.rank}</span><span class="nm">{board.me.row.name} (you)<small>{sub(board.me.row)}</small></span><span class="val">{val(board.me.row)}</span></li>
        {/if}
      </ol>
    {/if}
  </div>
  <p class="help" style="margin-top:12px">{data().kind === 'firebase' ? 'Worldwide rankings, updated after every game.' : 'Offline mode: this board only shows games on this device.'}</p>
</section>
