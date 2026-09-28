<script lang="ts">
  import { app, go } from '../lib/state/app.svelte';
  import { level, stats } from '../lib/progression';
  let { busy = false }: { busy?: boolean } = $props();
  const L = $derived(level(stats(app.scores).xp));
</script>

<header class="topbar">
  <button class="brand" aria-label="Home" onclick={() => { if (!busy || confirm('Leave this game?')) go('home'); }}>
    <svg viewBox="0 0 30 30" aria-hidden="true"><rect x="5" y="5" width="20" height="20" rx="3" fill="var(--p1-soft)"/><path d="M5 5H25M5 25H25M5 5V25" stroke="var(--p1)" stroke-width="3" stroke-linecap="round"/><path d="M25 5V25" stroke="var(--p2)" stroke-width="3" stroke-linecap="round"/><g fill="var(--dot)"><circle cx="5" cy="5" r="3"/><circle cx="25" cy="5" r="3"/><circle cx="5" cy="25" r="3"/><circle cx="25" cy="25" r="3"/></g></svg>
    <b>Grid Rivals</b>
  </button>
  <button class="lvl-chip" aria-label="Level {L.level}. Open your stats" onclick={() => { if (!busy) go('stats'); }}>
    <span class="lvl-badge" style:--pct={L.pct}><span>{L.level}</span></span><small>{app.profile?.name ?? 'Guest'}</small>
  </button>
</header>
