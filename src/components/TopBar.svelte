<script lang="ts">
  import { app, go } from '../lib/state/app.svelte';
  import { level, stats } from '../lib/progression';
  import { skinInfo } from '../lib/theme/themes';
  import ThemeSheet from './ThemeSheet.svelte';
  import Avatar from './Avatar.svelte';
  let { busy = false }: { busy?: boolean } = $props();
  const L = $derived(level(stats(app.scores).xp));
  const name = $derived(app.profile?.name ?? 'Guest');
  let themeOpen = $state(false);
</script>

<header class="topbar">
  <button class="brand" aria-label="Home" onclick={() => { if (!busy || confirm('Leave this game?')) go('home'); }}>
    <!-- Each theme draws its own mark: a board sheet (Tabletop), a coral square (Neon), a pencil underline (Paper). -->
    <svg class="mark mark-table" viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="7" fill="var(--board)"/><rect x="9" y="9" width="14" height="14" fill="var(--p1)"/><path d="M9 9H23M9 23H23M9 9V23" stroke="var(--line1)" stroke-width="2.8" stroke-linecap="round"/><path d="M23 9V23" stroke="var(--p2)" stroke-width="2.8" stroke-linecap="round"/><g fill="var(--dot)"><circle cx="9" cy="9" r="2.6"/><circle cx="23" cy="9" r="2.6"/><circle cx="9" cy="23" r="2.6"/><circle cx="23" cy="23" r="2.6"/></g></svg>
    <svg class="mark mark-neon" viewBox="0 0 30 30" aria-hidden="true"><rect x="5" y="5" width="20" height="20" rx="3" fill="var(--p1-soft)"/><path d="M5 5H25M5 25H25M5 5V25" stroke="var(--p1)" stroke-width="3" stroke-linecap="round"/><path d="M25 5V25" stroke="var(--line2)" stroke-width="3" stroke-linecap="round"/><g fill="var(--head-text)"><circle cx="5" cy="5" r="3"/><circle cx="25" cy="5" r="3"/><circle cx="5" cy="25" r="3"/><circle cx="25" cy="25" r="3"/></g></svg>
    <span class="brand-name"><b>Grid Rivals</b><svg class="mark-paper" viewBox="0 0 100 7" aria-hidden="true"><path d="M2 4 C 26 1, 52 6, 98 2" stroke="var(--p1)" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg></span>
  </button>
  <div class="tb-right">
    <button class="theme-btn" aria-label="Theme: {skinInfo(app.settings.skin).name}. Change theme" aria-haspopup="dialog" onclick={() => (themeOpen = true)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.9 1.2-1.9-.5-1 .1-2.1 1.2-2.1H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10Z"/><circle cx="7.5" cy="11.5" r="1.1" fill="currentColor"/><circle cx="10.5" cy="7.3" r="1.1" fill="currentColor"/><circle cx="15.3" cy="8" r="1.1" fill="currentColor"/></svg>
    </button>
    <!-- Your avatar inside a ring that fills towards the next level (Paper: a sticker on its paper tab), then name and level. -->
    <button class="lvl-chip" aria-label="{name}, level {L.level}. Open your stats" onclick={() => { if (!busy) go('stats'); }}>
      <span class="lvl-ring" style:--pct={L.pct}><Avatar size={26} /></span><span class="lvl-txt"><b>{name}</b><small>Lv {L.level}</small></span>
    </button>
  </div>
</header>
{#if app.notice}<div class="banner" role="status"><span>{app.notice}</span> <button class="btn small" onclick={() => (app.notice = '')}>Dismiss</button></div>{/if}
{#if themeOpen}<ThemeSheet onclose={() => (themeOpen = false)} />{/if}
