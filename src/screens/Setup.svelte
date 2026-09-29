<script lang="ts">
  import { app, go, data, saveCfg } from '../lib/state/app.svelte';
  import { DIFF_HELP } from '../lib/format';
  import Seg from '../components/Seg.svelte';
  import SizePicker from '../components/SizePicker.svelte';
  import BackTitle from '../components/BackTitle.svelte';
  let name = $state(app.profile?.name ?? '');
  let saving = $state(false);
  async function start() {
    saving = true;
    const clean = name.trim().slice(0, 16) || 'Player';
    if (clean !== app.profile?.name) { try { app.profile = await data().setName(clean); } catch { app.notice = 'Could not save your name online. It will be used on this device.'; } }
    app.cfg.p2 = app.cfg.p2.trim().slice(0, 16) || 'Player 2';
    saveCfg(); saving = false; go('game');
  }
</script>

<section aria-labelledby="setupTitle">
  <BackTitle title="New game" id="setupTitle" />
  <div class="panel">
    <div class="field" style="margin-top:0"><label for="nameIn">Your name</label>
      <input type="text" id="nameIn" maxlength="16" placeholder="Enter a name" autocomplete="nickname" bind:value={name} />
      <div class="help">Your stats and leaderboard entries use this name.</div></div>
    <div class="field"><span class="lab">Mode</span>
      <Seg label="Mode" bind:value={app.cfg.mode} options={[{ v: 'ai', label: 'Play the AI' }, { v: 'pvp', label: 'Two players, one device' }]} /></div>
    {#if app.cfg.mode === 'pvp'}
      <div class="field"><label for="p2In">Player 2 name</label><input type="text" id="p2In" maxlength="16" placeholder="Player 2" bind:value={app.cfg.p2} /></div>
    {/if}
    <div class="field"><span class="lab">Board size (boxes per side)</span>
      <SizePicker bind:value={app.cfg.board} /></div>
    {#if app.cfg.mode === 'ai'}
      <div class="field"><span class="lab">Difficulty</span>
        <Seg label="Difficulty" bind:value={app.cfg.diff} options={[{ v: 'easy', label: 'Easy' }, { v: 'medium', label: 'Medium' }, { v: 'hard', label: 'Hard' }]} />
        <div class="help">{DIFF_HELP[app.cfg.diff]}</div></div>
    {/if}
    <div class="field"><span class="lab">Who starts</span>
      <Seg label="Who starts" bind:value={app.cfg.first} options={[{ v: '0', label: 'Me' }, { v: '1', label: app.cfg.mode === 'ai' ? 'AI' : 'Player 2' }, { v: 'r', label: 'Random' }]} /></div>
    <button class="btn primary block" style="margin-top:20px" disabled={saving} onclick={start}>Start game</button>
  </div>
</section>
