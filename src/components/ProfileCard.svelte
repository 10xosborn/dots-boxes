<script lang="ts">
  import { level } from '../lib/progression';
  import Avatar from './Avatar.svelte';
  let { name, xp }: { name: string; xp: number } = $props();
  const L = $derived(level(xp));
</script>

<div class="panel">
  <div class="profile">
    <span class="avatar"><Avatar size={52} /></span>
    <div style="flex:1;min-width:0">
      <div class="row"><b style="font-size:1.1rem">{name}</b><span class="spacer"></span><span class="muted" style="font-weight:700">Level {L.level}</span></div>
      <div class="xpbar" role="progressbar" aria-label="Progress to next level" aria-valuenow={L.pct} aria-valuemin="0" aria-valuemax="100"><b style:width="{L.pct}%"></b></div>
      <div class="help" style="margin-top:6px">{L.into} / {L.need} XP, {L.need - L.into} to level {L.level + 1}</div>
    </div>
  </div>
</div>
