<script lang="ts">
  import { app, data, saveSettings, refreshScores } from '../lib/state/app.svelte';
  import Toggle from '../components/Toggle.svelte';
  import BackTitle from '../components/BackTitle.svelte';
  let light = $state(app.settings.theme === 'light');
  let name = $state(app.profile?.name ?? '');
  let msg = $state('');
  async function saveName() {
    const clean = name.trim().slice(0, 16); if (!clean) return;
    try { app.profile = await data().setName(clean); msg = 'Name saved.'; } catch { msg = 'Could not save your name. Check your connection.'; }
  }
  async function reset() {
    if (!confirm('Delete all your stats and leaderboard entries? This cannot be undone.')) return;
    try { await data().resetMine(); await refreshScores(); msg = 'Stats reset.'; } catch { msg = 'Could not reset. Check your connection.'; }
  }
</script>

<section aria-labelledby="setTitle">
  <BackTitle title="Settings" id="setTitle" />
  <div class="stack">
    <div class="panel">
      <Toggle label="Animations" hint="Line drawing, box pops, confetti" bind:checked={app.settings.anim} onchange={saveSettings} />
      <Toggle label="Sound effects" hint="Soft clicks and chimes" bind:checked={app.settings.sound} onchange={saveSettings} />
      <Toggle label="Light theme" hint="Switch between night and day colors" bind:checked={light} onchange={v => { app.settings.theme = v ? 'light' : 'dark'; saveSettings(); }} />
    </div>
    <div class="panel">
      <h3>Your name</h3>
      <div class="row"><input type="text" maxlength="16" aria-label="Your name" bind:value={name} /><button class="btn small" onclick={saveName}>Save name</button></div>
      <p class="help">{msg}</p>
    </div>
    <div class="panel"><h3>Your data</h3><p class="muted">{data().label}</p>
      <button class="btn small" style="margin-top:12px" onclick={reset}>Reset my stats</button></div>
  </div>
</section>
