<script lang="ts">
  import { app, go } from '../lib/state/app.svelte';
  import { stats } from '../lib/progression';
  import { onlineEnabled } from '../lib/data';
  import { loadActive, clearActive } from '../lib/resume';
  import { geometry, replay, isStandard, sizeLabel } from '../lib/engine/rules';
  import { choiceSize } from '../lib/boardFit';
  import { AI_NAMES } from '../lib/format';
  import HeroBoard from '../components/HeroBoard.svelte';
  import ProfileCard from '../components/ProfileCard.svelte';
  const xp = $derived(stats(app.scores).xp);

  // A game left unfinished (the app was closed, or the player went to another screen).
  let saved = $state(loadActive());
  const savedText = $derived.by(() => {
    if (!saved) return '';
    const size = choiceSize(saved.board), st = replay(size, saved.first, saved.moves);
    const board = isStandard(size) ? sizeLabel(size) : `Custom ${sizeLabel(size)}`;
    const rival = saved.mode === 'ai' ? AI_NAMES[saved.diff] : saved.p2;
    return `${board} against ${rival}: ${st.moves.length} of ${geometry(size.rows, size.cols).E} lines drawn, score ${st.score[0]}–${st.score[1]}.`;
  });
  function resume() { app.resume = saved; go('game'); }
  function discard() { if (!confirm("Discard this game? It won't count.")) return; clearActive(); saved = null; }
</script>

<section aria-labelledby="homeTitle">
  {#if saved}
    <div class="panel resume" role="region" aria-labelledby="resumeTitle">
      <h2 id="resumeTitle">Continue your game</h2>
      <p class="muted">{savedText}</p>
      <div class="row"><button class="btn primary" style="flex:1" onclick={resume}>Continue</button><button class="btn" style="flex:1" onclick={discard}>Discard</button></div>
    </div>
  {/if}
  <div class="hero">
    <HeroBoard anim={app.settings.anim} />
    <h1 class="title" id="homeTitle">Grid Rivals</h1>
    <p class="kicker">Dots <span class="amp">&amp;</span> Boxes</p>
    <p class="tag">Close a box, keep your turn. Beat the AI, then beat your best time.</p>
  </div>
  <ProfileCard name={app.profile?.name ?? 'Player'} {xp} />
  <div class="menu">
    <button class="btn" class:primary={!saved} style="grid-column:1/-1" onclick={() => go('setup')}>Play</button>
    {#if onlineEnabled}<button class="btn" style="grid-column:1/-1" onclick={() => go('online')}>Play a friend online</button>{/if}
    <button class="btn" onclick={() => go('lb')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>Leaderboard</button>
    <button class="btn" onclick={() => go('stats')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>My stats</button>
    <button class="btn" style="grid-column:1/-1" onclick={() => go('settings')}>Settings</button>
  </div>
</section>

<style>
  .kicker { font-family: var(--display); font-weight: 500; font-size: clamp(1rem, 4.2vw, 1.35rem); letter-spacing: .02em; margin: 10px 0 0; color: var(--text); }
  .kicker .amp { color: var(--accent); }
  .resume { margin-bottom: 18px; }
  .resume h2 { margin: 0 0 4px; font-size: 1.1rem; }
  .resume p { margin: 0 0 12px; }
</style>
