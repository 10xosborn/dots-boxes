<script lang="ts">
  /**
   * The game board. Purely presentational: it renders lines and boxes it is given
   * and reports the edge a player chooses through `onmove`.
   * Pointer: hover or press shows a preview; releasing draws the line (drag to adjust).
   * Keyboard: arrow keys move a cursor between free lines; Enter or Space draws.
   */
  import { geometry } from '../lib/engine/rules';

  let { n, lines, boxes, turn, interactive, initials, anim, onmove }: {
    n: number;
    lines: { e: number; p: number }[];
    boxes: { b: number; p: number }[];
    turn: 0 | 1;
    interactive: boolean;
    initials: [string, string];
    anim: boolean;
    onmove: (e: number) => void;
  } = $props();

  const VB = 1000, PAD = 90;
  const g = $derived(geometry(n));
  const sp = $derived((VB - 2 * PAD) / n);
  const P = (v: number) => PAD + v * sp;
  const drawn = $derived(new Set(lines.map(l => l.e)));
  const stroke = $derived(Math.max(10, sp * 0.085));
  const color = (p: number) => (p === 0 ? 'var(--p1)' : 'var(--p2)');
  const glow = (p: number) => `drop-shadow(0 0 ${Math.round(sp * 0.05)}px ${p === 0 ? 'rgba(255,92,122,.55)' : 'rgba(62,214,234,.55)'})`;
  const xy = (e: number) => { const [a, b, c, d] = g.coords(e); return [P(a), P(b), P(c), P(d)]; };

  let svg: SVGSVGElement;
  let preview = $state(-1), cursor = $state(-1), focused = $state(false), pressing = false;

  // Clear stale preview/cursor when it stops being our turn or the line gets drawn.
  $effect(() => { if (!interactive) preview = -1; });
  $effect(() => { if (cursor >= 0 && drawn.has(cursor)) cursor = nearestFree(); });

  function toSvg(ev: PointerEvent) {
    const m = svg.getScreenCTM(); if (!m) return { x: -1, y: -1 };
    const pt = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse());
    return { x: pt.x, y: pt.y };
  }
  function edgeAt(ev: PointerEvent) {
    const { x, y } = toSvg(ev); let best = -1, bd = Infinity;
    for (let e = 0; e < g.E; e++) {
      if (drawn.has(e)) continue;
      const [x1, y1, x2, y2] = xy(e), dx = x2 - x1, dy = y2 - y1;
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
      const d = Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
      if (d < bd) { bd = d; best = e; }
    }
    return bd < sp * 0.34 ? best : -1;
  }
  function down(ev: PointerEvent) { if (!interactive) return; pressing = true; preview = edgeAt(ev); try { svg.setPointerCapture(ev.pointerId); } catch {} }
  function move(ev: PointerEvent) { if (interactive) preview = edgeAt(ev); }
  function up(ev: PointerEvent) { if (!pressing) return; pressing = false; const e = edgeAt(ev); preview = -1; if (interactive && e >= 0) onmove(e); }

  const mid = (e: number) => { const [a, b, c, d] = xy(e); return [(a + c) / 2, (b + d) / 2]; };
  function nearestFree(from = [VB / 2, VB / 2]) {
    let best = -1, bd = Infinity;
    for (let e = 0; e < g.E; e++) { if (drawn.has(e)) continue; const [x, y] = mid(e), d = Math.hypot(x - from[0], y - from[1]); if (d < bd) { bd = d; best = e; } }
    return best;
  }
  function key(ev: KeyboardEvent) {
    const dirs: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    if (dirs[ev.key]) {
      ev.preventDefault();
      const [dx, dy] = dirs[ev.key], [cx, cy] = cursor >= 0 ? mid(cursor) : [VB / 2, VB / 2];
      let best = -1, bs = Infinity;
      for (let e = 0; e < g.E; e++) {
        if (e === cursor || drawn.has(e)) continue;
        const [x, y] = mid(e), along = (x - cx) * dx + (y - cy) * dy, side = Math.abs((x - cx) * dy - (y - cy) * dx);
        if (along < sp * 0.2) continue;
        const s = along + side * 2; if (s < bs) { bs = s; best = e; }
      }
      if (best >= 0) cursor = best;
    } else if ((ev.key === 'Enter' || ev.key === ' ') && cursor >= 0) {
      ev.preventDefault(); if (interactive && !drawn.has(cursor)) onmove(cursor);
    }
  }
</script>

<div class="board-wrap">
  <!-- The board is a custom keyboard/pointer widget (role="application"), so it must be focusable and take input. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
  <svg bind:this={svg} id="board" viewBox="0 0 1000 1000" tabindex="0" role="application"
    aria-label="Game board. Use arrow keys to choose a line and Enter to draw it."
    onpointerdown={down} onpointermove={move} onpointerup={up}
    onpointercancel={() => { pressing = false; preview = -1; }}
    onpointerleave={() => { if (!pressing) preview = -1; }}
    onkeydown={key}
    onfocus={() => { focused = true; if (cursor < 0 || drawn.has(cursor)) cursor = nearestFree(); }}
    onblur={() => (focused = false)}>
    <defs>
      <!-- Patterns keep ownership readable without color: stripes = player 1, dots = player 2. -->
      <pattern id="pat0" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="22" style="fill:var(--p1)" opacity=".35" /></pattern>
      <pattern id="pat1" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="3.6" style="fill:var(--p2)" opacity=".45" /></pattern>
    </defs>

    {#each boxes as bx (bx.b)}
      {@const x = P(bx.b % n)}{@const y = P(Math.floor(bx.b / n))}{@const i = sp * 0.1}
      <g class="bx" class:pop={anim}>
        <rect x={x + i} y={y + i} width={sp - 2 * i} height={sp - 2 * i} rx={sp * 0.12} style:fill={bx.p === 0 ? 'var(--p1-soft)' : 'var(--p2-soft)'} />
        <rect x={x + i} y={y + i} width={sp - 2 * i} height={sp - 2 * i} rx={sp * 0.12} fill="url(#pat{bx.p})" />
        <text x={x + sp / 2} y={y + sp / 2} text-anchor="middle" dominant-baseline="central" font-family="Unbounded, sans-serif" font-weight="800" font-size={sp * 0.34} style:fill={color(bx.p)}>{initials[bx.p]}</text>
      </g>
    {/each}

    {#if preview >= 0 && interactive}
      {@const [x1, y1, x2, y2] = xy(preview)}
      <line {x1} {y1} {x2} {y2} stroke-width={stroke} stroke-linecap="round" stroke-dasharray="{stroke * 0.1} {stroke * 1.6}" style:stroke={color(turn)} opacity=".75" />
    {/if}

    {#each lines as l (l.e)}
      {@const [x1, y1, x2, y2] = xy(l.e)}
      <line class="ln" class:grow={anim} {x1} {y1} {x2} {y2} stroke-width={stroke} style="--len:{sp}" style:stroke={color(l.p)} style:filter={glow(l.p)} />
    {/each}

    {#if focused && cursor >= 0}
      {@const [x1, y1, x2, y2] = xy(cursor)}
      <line {x1} {y1} {x2} {y2} stroke-width={stroke * 2.4} stroke-linecap="round" style="stroke:var(--accent);opacity:.35" />
    {/if}

    {#each { length: n + 1 } as _, yy}
      {#each { length: n + 1 } as _, xx}
        <circle cx={P(xx)} cy={P(yy)} r={Math.max(9, sp * 0.07)} class="dot" />
      {/each}
    {/each}
  </svg>
</div>
