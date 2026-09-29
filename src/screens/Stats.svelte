<script lang="ts">
  import { app } from '../lib/state/app.svelte';
  import { stats } from '../lib/progression';
  import { fmtTime } from '../lib/format';
  import ProfileCard from '../components/ProfileCard.svelte';
  import BackTitle from '../components/BackTitle.svelte';
  const s = $derived(stats(app.scores));
  const cards = $derived([['Games', s.games], ['Wins', s.wins], ['Losses', s.losses], ['Draws', s.draws],
    ['Win rate', s.games ? Math.round(100 * s.rate) + '%' : '–'], ['Current streak', s.cur], ['Best streak', s.best], ['Total XP', s.xp]]);
</script>

<section aria-labelledby="stTitle">
  <BackTitle title="My stats" id="stTitle" />
  <div class="stack">
    <ProfileCard name={app.profile?.name ?? 'Player'} xp={s.xp} />
    <div class="stats">{#each cards as [k, v]}<div class="stat"><b>{v}</b><span>{k}</span></div>{/each}</div>
    <div class="panel"><h3>Fastest wins against the AI</h3>
      <div style="overflow-x:auto"><table>
        <thead><tr><th scope="col">Board</th><th scope="col">Easy</th><th scope="col">Medium</th><th scope="col">Hard</th></tr></thead>
        <tbody>{#each [3, 4, 5, 6] as n}<tr><th scope="row">{n}×{n}</th>{#each ['easy', 'medium', 'hard'] as d}<td>{s.fastest[n + d] != null ? fmtTime(s.fastest[n + d]) : '–'}</td>{/each}</tr>{/each}</tbody>
      </table></div></div>
    <div class="panel formula"><h3>How XP works</h3>
      <p><code>XP = round(Base × Difficulty × Board) + Margin</code></p>
      <p style="margin-top:8px">Base: win 60, draw 30, loss 15. Difficulty: Easy ×1, Medium ×1.5, Hard ×2.5. Margin: +2 for every box you win by.</p>
      <p style="margin-top:8px">Board: <code>1 + 0.4 × (√boxes − 3)</code>, so 3×3 ×1, 4×4 ×1.4, 5×5 ×1.8, 6×6 ×2.2 and 12×12 ×4.6. Boards with fewer than 9 boxes get <code>boxes ÷ 9</code> (a 1×1 board is ×0.1).</p>
      <p style="margin-top:8px">Going from level L to L+1 takes <code>100 + 50 × (L − 1)</code> XP. Only games against the AI count toward stats and XP. Custom boards count toward stats and XP, but only the four standard sizes have leaderboards and fastest-win records.</p></div>
  </div>
</section>
