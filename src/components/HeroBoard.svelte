<script lang="ts">
  /** A tiny demo board on the home screen that keeps closing boxes. */
  import { onDestroy } from 'svelte';
  import { app } from '../lib/state/app.svelte';
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
  // Neon's layers only in Neon, the reflection and node glow only in Dark Neon (as on the game board).
  const neon = $derived(app.settings.skin === 'neon');
  const neonDark = $derived(neon && app.settings.theme === 'dark');
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
    <filter id="fx-lift" x="-20%" y="-20%" width="140%" height="160%" color-interpolation-filters="sRGB">
      <feOffset in="SourceAlpha" dy="0.8" result="o1" />
      <feOffset in="SourceAlpha" dy="1.6" result="o2" /><feComponentTransfer in="o2" result="s2"><feFuncA type="linear" slope=".5" /></feComponentTransfer>
      <feOffset in="SourceAlpha" dy="2.7" result="o3" /><feComponentTransfer in="o3" result="s3"><feFuncA type="linear" slope=".22" /></feComponentTransfer>
      <feMerge result="m"><feMergeNode in="s3" /><feMergeNode in="s2" /><feMergeNode in="o1" /></feMerge>
      <feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="m" operator="in" result="sh" />
      <feOffset in="SourceAlpha" dy="-0.54" result="o4" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o4" operator="in" result="lit" />
      <feMerge><feMergeNode in="sh" /><feMergeNode in="lit" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="fx-flat" x="-20%" y="-20%" width="140%" height="150%" color-interpolation-filters="sRGB">
      <feOffset in="SourceAlpha" dx="0.72" dy="1.8" result="o1" /><feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="o1" operator="in" result="sh" />
      <feOffset in="SourceAlpha" dy="-0.54" result="o2" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o2" operator="in" result="lit" />
      <feMerge><feMergeNode in="sh" /><feMergeNode in="lit" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <linearGradient id="tile-gloss" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" style="stop-color:#fff;stop-opacity:var(--gloss-a)" /><stop offset=".34" style="stop-color:#fff;stop-opacity:calc(var(--gloss-a) * .35)" />
      <stop offset=".35" style="stop-color:#fff;stop-opacity:0" /><stop offset="1" style="stop-color:#fff;stop-opacity:0" />
    </linearGradient>
  </defs>
  {#if neon}
  <g class="halos">
  {#each lines as l, i (i)}
    {#each [['h4', 33.6], ['h3', 24.8], ['h2', 18.4], ['h1', 12.8]] as [k, w] (k)}
      <line class="ln {k}" class:grow={anim} style="--len:{Math.hypot(l[2] - l[0], l[3] - l[1])}" x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke-width={w} style:stroke={l[4] ? 'var(--line2)' : 'var(--line1)'} />
    {/each}
  {/each}
  </g>
  {/if}
  <g class="bxs">
  {#each boxes as bx (bx.b)}
    <g class="bx" class:pop={anim}>
      {#if neon}<rect class="tile-base" x={X[bx.b] + 8} y="23" width="74" height="64" rx="10" />{/if}
      <rect x={X[bx.b] + 8} y="23" width="74" height="64" rx="10" stroke-width="3" style:fill={bx.p ? 'var(--box2)' : 'var(--box1)'} style:fill-opacity="var(--box-op)" style:stroke={bx.p ? 'var(--box-rim2)' : 'var(--box-rim1)'} />
      {#if neon}<rect class="gloss" x={X[bx.b] + 8} y="23" width="74" height="64" rx="10" fill="url(#tile-gloss)" />{/if}
      <text x={X[bx.b] + 45} y="55" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="28" paint-order="stroke" stroke-linejoin="round" stroke-width="5" style:stroke="var(--ini-halo)" style:font-family="var(--display)" style:fill={bx.p ? 'var(--box2-ink)' : 'var(--box1-ink)'}>{bx.p ? 'B' : 'A'}</text>
    </g>
  {/each}
  </g>
  <g class="lines">
  {#each lines as l, i (i)}
    <line class="ln" class:grow={anim} style="--len:{Math.hypot(l[2] - l[0], l[3] - l[1])}" x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke-width="8" style:stroke={l[4] ? 'var(--line2)' : 'var(--line1)'} />
  {/each}
  </g>
  {#if neon}
  <g class="cores">
  {#each lines as l, i (i)}
    <line class="ln" class:grow={anim} style="--len:{Math.hypot(l[2] - l[0], l[3] - l[1])}" x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke-width="3" style:stroke={`color-mix(in srgb, ${l[4] ? 'var(--line2)' : 'var(--line1)'} var(--core-mix, 40%), #fff)`} />
  {/each}
  </g>
  {/if}
  {#if neonDark}
  <g class="reflect">
  {#each lines as l, i (i)}
    <line class="ln" class:grow={anim} style="--len:{Math.hypot(l[2] - l[0], l[3] - l[1])}" x1={l[0] + 4} y1={l[1] + 9} x2={l[2] + 4} y2={l[3] + 9} stroke-width="1.8" style:stroke={`color-mix(in srgb, ${l[4] ? 'var(--line2)' : 'var(--line1)'} var(--core-mix, 40%), #fff)`} />
  {/each}
  </g>
  {/if}
  {#if neonDark}<g class="dot-halos">{#each X as x}{#each Y as y}<circle cx={x} cy={y} r="17.5" class="dh2" /><circle cx={x} cy={y} r="11.5" class="dh1" />{/each}{/each}</g>{/if}
  <g class="dots">{#each X as x}{#each Y as y}<circle cx={x} cy={y} r="7" class="dot" style="fill:url(#dot-bead)" />{/each}{/each}</g>
</svg>
