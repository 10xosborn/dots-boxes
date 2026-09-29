<script lang="ts">
  /**
   * Board size control: the four standard squares plus "Custom".
   * Custom shows rows and columns steppers that can never go past what fits this
   * screen (see boardFit.ts), and shrink the board if the screen gets smaller
   * (for example when a phone is rotated).
   */
  import { onMount } from 'svelte';
  import { fits, largestSquare, type BoardChoice } from '../lib/boardFit';
  import { MAX_SIDE, STANDARD_SIZES } from '../lib/engine/rules';
  import Seg from './Seg.svelte';

  let { value = $bindable() }: { value: BoardChoice } = $props();

  // Bumped on resize so fit checks re-run.
  let screenTick = $state(0);
  onMount(() => {
    const onResize = () => { screenTick++; shrinkToFit(); };
    addEventListener('resize', onResize);
    shrinkToFit();
    return () => removeEventListener('resize', onResize);
  });

  const key = $derived(value.custom ? 'custom' : String(value.n));
  const options = [...STANDARD_SIZES.map(n => ({ v: String(n), label: `${n}×${n}` })), { v: 'custom', label: 'Custom' }];
  function pick(k: string) {
    if (k === 'custom') { value.custom = true; shrinkToFit(); }
    else { value.custom = false; value.n = +k; }
  }

  // Reading screenTick makes these re-run after a resize.
  const can = (rows: number, cols: number) => { void screenTick; return fits({ rows, cols }); };
  const maxSq = $derived.by(() => { void screenTick; return largestSquare(); });

  function shrinkToFit() {
    if (!value.custom) return;
    value.rows = Math.min(Math.max(1, value.rows), MAX_SIDE);
    value.cols = Math.min(Math.max(1, value.cols), MAX_SIDE);
    // Trim the longer side first until the board fits.
    while (!fits({ rows: value.rows, cols: value.cols }) && (value.rows > 1 || value.cols > 1)) {
      if (value.rows >= value.cols && value.rows > 1) value.rows--; else value.cols--;
    }
  }
  function step(side: 'rows' | 'cols', d: number) {
    const next = { rows: value.rows, cols: value.cols }; next[side] += d;
    if (next[side] >= 1 && fits(next)) value[side] = next[side];
  }
  const blockedByScreen = $derived(value.custom && (
    (value.rows < MAX_SIDE && !can(value.rows + 1, value.cols)) || (value.cols < MAX_SIDE && !can(value.rows, value.cols + 1))));
</script>

<Seg label="Board size" value={key} {options} onchange={pick} />

{#if value.custom}
  <div class="custom">
    {#each [['rows', 'Rows'], ['cols', 'Columns']] as [side, label] (side)}
      {@const s = side as 'rows' | 'cols'}
      {@const v = value[s]}
      {@const up = s === 'rows' ? can(value.rows + 1, value.cols) : can(value.rows, value.cols + 1)}
      <div class="stepper">
        <span class="lab" id="lab-{s}">{label}</span>
        <div class="ctl" role="group" aria-labelledby="lab-{s}">
          <button type="button" class="round" aria-label="Fewer {label.toLowerCase()}" disabled={v <= 1} onclick={() => step(s, -1)}>−</button>
          <output aria-live="polite">{v}</output>
          <button type="button" class="round" aria-label="More {label.toLowerCase()}" disabled={!up} onclick={() => step(s, 1)}>+</button>
        </div>
      </div>
    {/each}
    <p class="help">
      {value.rows}×{value.cols} board, {value.rows * value.cols} box{value.rows * value.cols === 1 ? '' : 'es'}.
      {#if blockedByScreen}This screen fits boards up to about {maxSq}×{maxSq}, so lines stay easy to tap.{:else}Up to {MAX_SIDE}×{MAX_SIDE} on bigger screens.{/if}
      Custom games earn XP but don't count on the leaderboard.
    </p>
  </div>
{/if}

<style>
  .custom { margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .custom .help { grid-column: 1 / -1; margin-top: 2px; }
  .stepper { background: var(--panel); border: 1px solid var(--panel-b); border-radius: var(--r-md); padding: 10px; }
  .lab { display: block; font-weight: 800; font-size: .85rem; margin-bottom: 6px; }
  .ctl { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
  output { font-family: var(--display); font-weight: 800; font-size: 1.4rem; min-width: 2ch; text-align: center; font-variant-numeric: tabular-nums; }
  .round { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--panel-b); background: var(--panel-strong); font-size: 1.4rem; font-weight: 800; cursor: pointer; line-height: 1; }
  .round:disabled { opacity: .35; cursor: default; }
</style>
