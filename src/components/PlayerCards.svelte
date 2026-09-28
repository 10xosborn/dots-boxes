<script lang="ts">
  let { names, initials, subs, score, turn, over, turnText, thinking = false }:
    { names: [string, string]; initials: [string, string]; subs: [string, string]; score: [number, number];
      turn: 0 | 1; over: boolean; turnText: string; thinking?: boolean } = $props();
  // Re-trigger the score "bump" animation whenever a score changes.
  let bump = $state([0, 0]);
  let prev = [0, 0];
  $effect(() => { for (const p of [0, 1]) if (score[p] > prev[p]) bump[p]++; prev = [...score]; });
</script>

<div class="hud">
  {#each [0, 1] as p}
    <div class="pcard p{p}" class:on={!over && turn === p}>
      <div class="av" aria-hidden="true">{initials[p]}</div>
      <div class="who"><div class="nm">{names[p]}</div><div class="sub">{subs[p]}</div></div>
      {#key bump[p]}<div class="sc" class:bump={bump[p] > 0} aria-label="{names[p]} score">{score[p]}</div>{/key}
    </div>
  {/each}
  <div class="turnbar" class:t1={turn === 1} class:thinking>
    <div class="pill"><span>{turnText}</span></div>
  </div>
</div>
