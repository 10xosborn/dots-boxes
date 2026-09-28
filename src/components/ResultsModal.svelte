<script module lang="ts">
  export interface ResultInfo {
    kind: 'win' | 'loss' | 'draw';
    title: string; score: [number, number]; ms: number; tags: string[];
    xp?: { gained: number; before: number; after: number };
    compare?: string; compareHi?: boolean; rank?: string;
  }
</script>

<script lang="ts">
  import { level } from '../lib/progression';
  import { fmtTime } from '../lib/format';

  let { info, primary, secondary = [] }: {
    info: ResultInfo;
    primary: { label: string; run: () => void };
    secondary?: { label: string; run: () => void }[];
  } = $props();

  const A = $derived(info.xp ? level(info.xp.before) : null);
  const B = $derived(info.xp ? level(info.xp.after) : null);
  let width = $state(0), btn: HTMLButtonElement;
  $effect(() => {
    if (!A || !B) return;
    width = B.level > A.level ? 0 : A.pct;              // start where the bar was
    const t = setTimeout(() => (width = B.pct), 60);     // then fill to the new value
    return () => clearTimeout(t);
  });
  $effect(() => { btn?.focus(); });
</script>

<div class="modal" role="dialog" aria-modal="true" aria-labelledby="resTitle">
  <div class="panel">
    <svg class="res-icon" viewBox="0 0 64 64" aria-hidden="true">
      {#if info.kind === 'win'}
        <path d="M20 10h24v12a12 12 0 0 1-24 0Z" fill="var(--gold)"/><path d="M20 14h-8v4a8 8 0 0 0 8 8M44 14h8v4a8 8 0 0 1-8 8" fill="none" stroke="var(--gold)" stroke-width="4"/><rect x="28" y="34" width="8" height="10" fill="var(--gold)"/><rect x="20" y="46" width="24" height="7" rx="3" fill="var(--gold)"/>
      {:else if info.kind === 'loss'}
        <rect x="12" y="12" width="40" height="40" rx="8" fill="none" stroke="var(--p2)" stroke-width="4"/><path d="M24 26h.01M40 26h.01" stroke="var(--p2)" stroke-width="6" stroke-linecap="round"/><path d="M24 42c4-4 12-4 16 0" fill="none" stroke="var(--p2)" stroke-width="4" stroke-linecap="round"/>
      {:else}
        <rect x="10" y="18" width="20" height="28" rx="6" fill="var(--p1-soft)" stroke="var(--p1)" stroke-width="4"/><rect x="34" y="18" width="20" height="28" rx="6" fill="var(--p2-soft)" stroke="var(--p2)" stroke-width="4"/>
      {/if}
    </svg>
    <h2 class="res-title" id="resTitle">{info.title}</h2>
    <div class="res-score"><span class="a">{info.score[0]}</span><span class="dash">–</span><span class="b">{info.score[1]}</span></div>
    <div class="res-meta">{#if info.ms > 0}<span class="chip">Time <b>{fmtTime(info.ms)}</b></span>{/if}{#each info.tags as t}<span class="chip">{t}</span>{/each}</div>
    {#if info.xp && B && A}
      <div class="xpblock">
        <div class="top"><span>Level {B.level}</span><span class="gain">+{info.xp.gained} XP</span></div>
        <div class="xpbar"><b style:width="{width}%"></b></div>
        <div class="help">{B.into} / {B.need} XP to level {B.level + 1}</div>
        {#if B.level > A.level}<span class="levelup">Level up! You reached level {B.level}</span>{/if}
      </div>
    {/if}
    {#if info.compare}<p class="res-note" class:hi={info.compareHi}>{info.compare}</p>{/if}
    {#if info.rank}<p class="res-note muted" style="margin-top:6px">{info.rank}</p>{/if}
    <div class="res-actions">
      <button class="btn primary" bind:this={btn} onclick={primary.run}>{primary.label}</button>
      {#if secondary.length}
        <div class="row">{#each secondary as s}<button class="btn small" style="flex:1" onclick={s.run}>{s.label}</button>{/each}</div>
      {/if}
    </div>
  </div>
</div>
