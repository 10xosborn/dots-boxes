<script lang="ts">
  import { app, go } from '../lib/state/app.svelte';
  import { stats } from '../lib/progression';
  import { onlineEnabled } from '../lib/data';
  import HeroBoard from '../components/HeroBoard.svelte';
  import ProfileCard from '../components/ProfileCard.svelte';
  const xp = $derived(stats(app.scores).xp);
</script>

<section aria-labelledby="homeTitle">
  <div class="hero">
    <HeroBoard anim={app.settings.anim} />
    <h1 class="title" id="homeTitle">Dots<span class="amp">&amp;</span>Boxes</h1>
    <p class="tag">Close a box, keep your turn. Beat the AI, then beat your best time.</p>
  </div>
  <ProfileCard name={app.profile?.name ?? 'Player'} {xp} />
  <div class="menu">
    <button class="btn primary" onclick={() => go('setup')}>Play</button>
    {#if onlineEnabled}<button class="btn" style="grid-column:1/-1" onclick={() => go('online')}>Play a friend online</button>{/if}
    <button class="btn" onclick={() => go('lb')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>Leaderboard</button>
    <button class="btn" onclick={() => go('stats')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>My stats</button>
    <button class="btn" style="grid-column:1/-1" onclick={() => go('settings')}>Settings</button>
  </div>
</section>
