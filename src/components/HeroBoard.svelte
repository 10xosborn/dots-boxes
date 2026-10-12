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
  <!-- The same materials as the game board (Board.svelte); only one of the two is ever on screen, so the ids can match. -->
  <defs>
    <radialGradient id="dot-bead" fx=".36" fy=".32"><stop offset="0" style="stop-color:var(--dot-hi)" /><stop offset=".58" style="stop-color:var(--dot)" /><stop offset="1" style="stop-color:var(--dot-lo)" /></radialGradient>
    <filter id="fx-engrave" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feOffset in="SourceAlpha" dy="1.5" result="o1" /><feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="o1" operator="in" result="hi" />
      <feOffset in="SourceAlpha" dy="-0.9" result="o2" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o2" operator="in" result="lo" />
      <feMerge><feMergeNode in="hi" /><feMergeNode in="lo" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="fx-emboss" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.45" result="ink" />
      <feOffset in="SourceAlpha" dy="1.1" result="o1" /><feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="o1" operator="in" result="hi" />
      <feOffset in="SourceAlpha" dy="-0.7" result="o2" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o2" operator="in" result="lo" />
      <feMerge><feMergeNode in="hi" /><feMergeNode in="lo" /><feMergeNode in="ink" /></feMerge>
    </filter>
    <filter id="fx-glow" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="near" /><feGaussianBlur in="SourceGraphic" stdDeviation="11" result="far" />
      <feMerge><feMergeNode in="far" /><feMergeNode in="near" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="fx-glow-soft" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" /><feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .65 0" result="halo" />
      <feMerge><feMergeNode in="halo" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
  <g class="bxs">
  {#each boxes as bx (bx.b)}
    <g class="bx" class:pop={anim}>
      <rect x={X[bx.b] + 8} y="23" width="74" height="64" rx="10" stroke-width="3" style:fill={bx.p ? 'var(--box2)' : 'var(--box1)'} style:fill-opacity="var(--box-op)" style:stroke={bx.p ? 'var(--box-rim2)' : 'var(--box-rim1)'} />
      <text x={X[bx.b] + 45} y="55" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="28" paint-order="stroke" stroke-linejoin="round" stroke-width="5" style:stroke="var(--ini-halo)" style:font-family="var(--display)" style:fill={bx.p ? 'var(--box2-ink)' : 'var(--box1-ink)'}>{bx.p ? 'B' : 'A'}</text>
    </g>
  {/each}
  </g>
  <g class="lines">
  {#each lines as l, i (i)}
    <line class="ln" class:grow={anim} style="--len:{Math.hypot(l[2] - l[0], l[3] - l[1])}" x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke-width="8" style:stroke={l[4] ? 'var(--line2)' : 'var(--line1)'} />
  {/each}
  </g>
  <g class="cores">
  {#each lines as l, i (i)}
    <line class="ln" class:grow={anim} style="--len:{Math.hypot(l[2] - l[0], l[3] - l[1])}" x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke-width="3" style:stroke={`color-mix(in srgb, ${l[4] ? 'var(--line2)' : 'var(--line1)'} 40%, #fff)`} />
  {/each}
  </g>
  <g class="dots">{#each X as x}{#each Y as y}<circle cx={x} cy={y} r="7" class="dot" style="fill:url(#dot-bead)" />{/each}{/each}</g>
</svg>
