<script lang="ts">
  import { onMount } from 'svelte';
  import { app, setAdapter, applySettings, refreshScores } from './lib/state/app.svelte';
  import { createAdapter } from './lib/data';
  import { loadActive, reloadedDuring, loadRoom } from './lib/resume';
  import TopBar from './components/TopBar.svelte';
  import Home from './screens/Home.svelte';
  import Setup from './screens/Setup.svelte';
  import Game from './screens/Game.svelte';
  import Online from './screens/Online.svelte';
  import Leaderboard from './screens/Leaderboard.svelte';
  import Stats from './screens/Stats.svelte';
  import Settings from './screens/Settings.svelte';

  // An invite link looks like …/?room=ABCDE and opens straight into that online game.
  const roomParam = new URLSearchParams(location.search).get('room')?.toUpperCase() ?? '';

  onMount(async () => {
    applySettings();
    const { adapter, profile, error } = await createAdapter();
    setAdapter(adapter); app.profile = profile; if (error) app.notice = error;
    try { await refreshScores(); } catch { app.notice = 'Could not load your stats. Check your connection.'; }
    if (roomParam) { app.screen = 'online'; history.replaceState(null, '', location.pathname); }
    else {
      // A reload during a game against the AI or on one device reopens that game;
      // otherwise an online game from the last 24 hours is rejoined at the same seat.
      const saved = loadActive(), room = loadRoom();
      if (saved && reloadedDuring(saved)) { app.resume = saved; app.screen = 'game'; }
      else if (room) { app.roomResume = room; app.screen = 'online'; }
    }
    app.ready = true;
  });
</script>

<!-- Neon's aurora: three soft lights drifting slowly behind everything (shown only in Neon; still when motion is off). -->
<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
<div class="app">
  <!-- The game screens draw their own top bar, inside their layout (so it can move into a side column). -->
  {#if app.screen !== 'game' && !app.playing}<TopBar />{/if}
  <main>
    {#if !app.ready}
      <p class="loading">Loading…</p>
    {:else}
      {#key app.screen}
        <div class="screen active">
          {#if app.screen === 'home'}<Home />
          {:else if app.screen === 'setup'}<Setup />
          {:else if app.screen === 'game'}<Game />
          {:else if app.screen === 'online'}<Online joinCode={roomParam} />
          {:else if app.screen === 'lb'}<Leaderboard />
          {:else if app.screen === 'stats'}<Stats />
          {:else if app.screen === 'settings'}<Settings />{/if}
        </div>
      {/key}
    {/if}
  </main>
</div>
