<script lang="ts">
  import { onMount } from 'svelte';
  import { app, setAdapter, applySettings, refreshScores } from './lib/state/app.svelte';
  import { createAdapter } from './lib/data';
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
    app.ready = true;
  });
</script>

<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
<div class="app">
  <TopBar busy={app.screen === 'game'} />
  {#if app.notice}<div class="banner" role="status">{app.notice} <button class="btn small" style="min-height:36px;margin-left:6px" onclick={() => (app.notice = '')}>Dismiss</button></div>{/if}
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
