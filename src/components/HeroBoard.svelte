<script lang="ts">
  /** A tiny demo board on the home screen that keeps closing boxes. */
  import { onDestroy } from 'svelte';
  let { anim }: { anim: boolean } = $props();
  const X = [20, 110, 200, 290], Y = [15, 95];
  // [x1, y1, x2, y2, player, ...boxes closed by this line]
  const SEQ = [[20,15,110,15,0],[20,95,110,95,1],[20,15,20,95,0],[110,15,110,95,1,0],[200,15,290,15,1],[110,15,200,15,1],[200,95,290,95,0],[290,15,290,95,1],[110,95,200,95,0],[200,15,200,95,0,1,2]];
  let shown = $state(0), timer: ReturnType<typeof setTimeout>;
  function step() { shown = shown >= SEQ.length ? 1 : shown + 1; timer = setTimeout(step, shown >= SEQ.length ? 1800 : 480); }
  $effect(() => { clearTimeout(timer); if (anim) { shown = 0; timer = setTimeout(step, 300); } else shown = SEQ.length; });
  onDestroy(() => clearTimeout(timer));
  const lines = $derived(SEQ.slice(0, shown));
  const boxes = $derived(lines.flatMap(l => l.slice(5).map(b => ({ b, p: l[4] }))));
</script>

<svg class="hero-board" viewBox="0 0 300 110" aria-hidden="true">
  {#each boxes as bx (bx.b)}
    <g class="bx" class:pop={anim}>
      <rect x={X[bx.b] + 8} y="23" width="74" height="64" rx="10" style:fill={bx.p ? 'var(--p2-soft)' : 'var(--p1-soft)'} />
      <text x={X[bx.b] + 45} y="55" text-anchor="middle" dominant-baseline="central" font-family="Unbounded, sans-serif" font-weight="800" font-size="28" style:fill={bx.p ? 'var(--p2)' : 'var(--p1)'}>{bx.p ? 'B' : 'A'}</text>
    </g>
  {/each}
  {#each lines as l, i (i)}
    <line class="ln" class:grow={anim} style="--len:{Math.hypot(l[2] - l[0], l[3] - l[1])}" x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke-width="8" style:stroke={l[4] ? 'var(--p2)' : 'var(--p1)'} />
  {/each}
  {#each X as x}{#each Y as y}<circle cx={x} cy={y} r="7" class="dot" />{/each}{/each}
</svg>
