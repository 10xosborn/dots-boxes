<script lang="ts">
  /**
   * The game board. Purely presentational: it renders lines and boxes it is given
   * and reports the edge a player chooses through `onmove`.
   * Pointer: drag from a dot towards a neighbouring dot; the line snaps into place once the pointer is far enough
   * along it, and letting go draws it (letting go anywhere else draws nothing). A press on a line still previews it
   * and releasing draws it (drag to adjust), and hovering shows a preview. Sounds: pick-up, snap and cancel.
   * Keyboard: arrow keys move a cursor between free lines; Enter or Space draws.
   * The cursor shows only in keyboard play: a click or tap also focuses the board, but hides it.
   */
  import { geometry } from '../lib/engine/rules';
  import { layout, PAD } from '../lib/boardFit';
  import { sfx } from '../lib/sound';

  let { rows, cols, lines, boxes, turn, interactive, initials, anim, onmove }: {
    rows: number; cols: number;
    lines: { e: number; p: number }[];
    boxes: { b: number; p: number }[];
    turn: 0 | 1;
    interactive: boolean;
    initials: [string, string];
    anim: boolean;
    onmove: (e: number) => void;
  } = $props();

  const g = $derived(geometry(rows, cols));
  const L = $derived(layout({ rows, cols }));
  const sp = $derived(L.sp);
  const P = (v: number) => PAD + v * sp;
  const drawn = $derived(new Set(lines.map(l => l.e)));
  const stroke = $derived(Math.max(6, sp * 0.085));
  const dotR = $derived(Math.max(5.5, sp * 0.075));
  // Theme colours (app.css): each player's line colour (also the mover's previews and drag line, through
  // .preview and .drag, at 3:1 or more on every board) and box colours.
  const lineColor = (p: number) => (p === 0 ? 'var(--line1)' : 'var(--line2)');
  /** Neon's tube light: a thinner, whiter line drawn inside each line (hidden in other themes through --cores). */
  const coreColor = (p: number) => `color-mix(in srgb, ${lineColor(p)} 40%, #fff)`;
  const xy = (e: number) => { const [a, b, c, d] = g.coords(e); return [P(a), P(b), P(c), P(d)]; };
  /** The printed guide under every possible line, as one path (cheap even on 12x12). */
  const lanes = $derived(Array.from({ length: g.E }, (_, e) => { const [a, b, c, d] = xy(e); return `M${a} ${b}L${c} ${d}`; }).join(''));

  let svg: SVGSVGElement;
  // kbd: keyboard mode, turned on by keyboard focus or a board key and off by any pointer press.
  let preview = $state(-1), cursor = $state(-1), focused = $state(false), kbd = $state(false), pressing = false;
  // Dragging from a dot: the dot picked up, where the pointer is once it has moved far enough to count as a drag,
  // the free line it would draw if let go now, and the dot under a hovering mouse (for the grab cursor).
  let anchor = $state(-1), dragAt = $state<[number, number] | null>(null), snap = $state(-1), hoverDot = $state(-1);
  let downAt: [number, number] = [0, 0], pid = -1;
  // In dot gaps: a press this close to a dot picks it up, this much movement starts the drag, and the line snaps
  // once the pointer is this far along it (and no further than half a gap to the side).
  const PICK = 0.24, START = 0.12, SNAP = 0.45;

  // Clear stale preview/cursor/drag when it stops being our turn or the line gets drawn.
  $effect(() => { if (!interactive) { preview = -1; hoverDot = -1; if (pressing) reset(); } });
  $effect(() => { if (cursor >= 0 && drawn.has(cursor)) cursor = nearestFree(); });

  function toSvg(ev: PointerEvent) {
    const m = svg.getScreenCTM(); if (!m) return { x: -1, y: -1 };
    const pt = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse());
    return { x: pt.x, y: pt.y };
  }
  /** Distance from a point to line e (as drawn, dot to dot). */
  function segDist(e: number, x: number, y: number) {
    const [x1, y1, x2, y2] = xy(e), dx = x2 - x1, dy = y2 - y1;
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
  }
  function edgeAt(ev: PointerEvent) {
    const { x, y } = toSvg(ev); let best = -1, bd = Infinity;
    for (let e = 0; e < g.E; e++) {
      if (drawn.has(e)) continue;
      const d = segDist(e, x, y);
      if (d < bd) { bd = d; best = e; }
    }
    return bd < sp * 0.34 ? best : -1;
  }
  /** A press near a dot that never became a drag: the line it sits on, but only if one is clearly nearer than the
   *  others (a tap right on a dot is ambiguous: up to four lines meet there). */
  function tapNearDot(ev: PointerEvent) {
    const { x, y } = toSvg(ev); let best = -1, bd = Infinity, next = Infinity;
    for (let e = 0; e < g.E; e++) {
      if (drawn.has(e)) continue;
      const d = segDist(e, x, y);
      if (d < bd) { next = bd; bd = d; best = e; } else if (d < next) next = d;
    }
    return bd < sp * 0.34 && next - bd > sp * 0.08 ? best : -1;
  }
  const dotXY = (i: number) => [P(i % (cols + 1)), P(Math.floor(i / (cols + 1)))];
  function dotNear(x: number, y: number) {
    const c = Math.min(cols, Math.max(0, Math.round((x - PAD) / sp))), r = Math.min(rows, Math.max(0, Math.round((y - PAD) / sp)));
    return Math.hypot(x - P(c), y - P(r)) < sp * PICK ? r * (cols + 1) + c : -1;
  }
  /** The free line from the picked-up dot towards the pointer, once the pointer is far enough along it; else -1. */
  function snapTo(x: number, y: number) {
    const [ax, ay] = dotXY(anchor), dx = x - ax, dy = y - ay, across = Math.abs(dx) >= Math.abs(dy);
    if (Math.abs(across ? dx : dy) < sp * SNAP || Math.abs(across ? dy : dx) > sp * 0.5) return -1;
    const r = Math.floor(anchor / (cols + 1)), c = anchor % (cols + 1);
    let e = -1;
    if (across) { const c2 = c + Math.sign(dx); if (c2 >= 0 && c2 <= cols) e = r * cols + Math.min(c, c2); }
    else { const r2 = r + Math.sign(dy); if (r2 >= 0 && r2 <= rows) e = g.H + Math.min(r, r2) * (cols + 1) + c; }
    return e >= 0 && !drawn.has(e) ? e : -1;
  }
  function down(ev: PointerEvent) {
    kbd = false; if (!interactive || pressing) return;   // one pointer at a time: a second finger is ignored
    pressing = true; pid = ev.pointerId;
    const { x, y } = toSvg(ev); downAt = [x, y];
    anchor = dotNear(x, y); dragAt = null; snap = -1;
    preview = anchor >= 0 ? -1 : edgeAt(ev);
    try { svg.setPointerCapture(ev.pointerId); } catch {}
  }
  function move(ev: PointerEvent) {
    if (!interactive) return;
    const { x, y } = toSvg(ev);
    if (!pressing) { hoverDot = dotNear(x, y); preview = hoverDot >= 0 ? -1 : edgeAt(ev); return; }
    if (ev.pointerId !== pid) return;
    if (anchor < 0) { preview = edgeAt(ev); return; }
    if (!dragAt && Math.hypot(x - downAt[0], y - downAt[1]) < sp * START) return;
    if (!dragAt) sfx.play('pick');
    dragAt = [x, y];
    const s = snapTo(x, y);
    if (s !== snap) { snap = s; if (s >= 0) sfx.play('snap'); }
  }
  function up(ev: PointerEvent) {
    if (!pressing || ev.pointerId !== pid) return;
    const e = dragAt ? snap : anchor >= 0 ? tapNearDot(ev) : edgeAt(ev);
    if (dragAt && e < 0) sfx.play('cancel');
    reset();
    if (interactive && e >= 0) onmove(e);
  }
  function reset() { pressing = false; pid = -1; anchor = -1; dragAt = null; snap = -1; preview = -1; }
  /** The ring round a line (the keyboard cursor's, and a drag's snapped line): a capsule enclosing the line and its dots. */
  function ring(e: number) {
    const [x1, y1, x2, y2] = xy(e), h = stroke * 1.2;
    return { x: Math.min(x1, x2) - h, y: Math.min(y1, y2) - h, width: Math.abs(x2 - x1) + 2 * h, height: Math.abs(y2 - y1) + 2 * h, rx: h };
  }

  const mid = (e: number) => { const [a, b, c, d] = xy(e); return [(a + c) / 2, (b + d) / 2]; };
  function nearestFree(from = [L.W / 2, L.H / 2]) {
    let best = -1, bd = Infinity;
    for (let e = 0; e < g.E; e++) { if (drawn.has(e)) continue; const [x, y] = mid(e), d = Math.hypot(x - from[0], y - from[1]); if (d < bd) { bd = d; best = e; } }
    return best;
  }
  /** Focus came from the keyboard (Tab), not from a click or tap. */
  function keyboardFocus() { try { return svg.matches(':focus-visible'); } catch { return false; } }
  function key(ev: KeyboardEvent) {
    const dirs: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    if (dirs[ev.key]) {
      ev.preventDefault(); kbd = true;
      const [dx, dy] = dirs[ev.key], [cx, cy] = cursor >= 0 ? mid(cursor) : [L.W / 2, L.H / 2];
      let best = -1, bs = Infinity;
      for (let e = 0; e < g.E; e++) {
        if (e === cursor || drawn.has(e)) continue;
        const [x, y] = mid(e), along = (x - cx) * dx + (y - cy) * dy, side = Math.abs((x - cx) * dy - (y - cy) * dx);
        if (along < sp * 0.2) continue;
        const s = along + side * 2; if (s < bs) { bs = s; best = e; }
      }
      if (best >= 0) cursor = best;
    } else if ((ev.key === 'Enter' || ev.key === ' ') && cursor >= 0) {
      ev.preventDefault();
      if (!kbd) { kbd = true; return; }      // a hidden cursor is shown first, so no line is drawn unseen
      if (interactive && !drawn.has(cursor)) onmove(cursor);
    }
  }
</script>

<div class="board-wrap" style:aspect-ratio="{L.W} / {L.H}" style:width="min(100%, 620px, calc(max(260px, 100dvh - 330px) * {L.W / L.H}))">
  <!-- The board is a custom keyboard/pointer widget (role="application"), so it must be focusable and take input. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
  <svg bind:this={svg} id="board" viewBox="0 0 {L.W} {L.H}" tabindex="0" role="application"
    aria-label="Game board. Use arrow keys to choose a line and Enter to draw it."
    class:grab={interactive && hoverDot >= 0} class:grabbing={dragAt !== null}
    onpointerdown={down} onpointermove={move} onpointerup={up}
    onpointercancel={reset}
    onpointerleave={() => { if (!pressing) { preview = -1; hoverDot = -1; } }}
    onkeydown={key}
    onfocus={() => { focused = true; kbd = keyboardFocus(); if (cursor < 0 || drawn.has(cursor)) cursor = nearestFree(); }}
    onblur={() => (focused = false)}>
    <defs>
      <!-- Patterns keep ownership readable without color: stripes = player 1, dots = player 2. -->
      <pattern id="pat0" width={sp * 0.1} height={sp * 0.1} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={sp * 0.026} height={sp * 0.1} style="fill:var(--pat1)" opacity=".24" /></pattern>
      <pattern id="pat1" width={sp * 0.1} height={sp * 0.1} patternUnits="userSpaceOnUse"><circle cx={sp * 0.05} cy={sp * 0.05} r={sp * 0.016} style="fill:var(--pat2)" opacity=".24" /></pattern>
      <!-- Materials. Each theme chooses through tokens (app.css): a bead for the dots, and engraved (Tabletop),
           pressed-into-paper (Paper) or glowing (Neon) lines, dots and boxes. Sizes follow the dot spacing. -->
      <radialGradient id="dot-bead" fx=".36" fy=".32"><stop offset="0" style="stop-color:var(--dot-hi)" /><stop offset=".58" style="stop-color:var(--dot)" /><stop offset="1" style="stop-color:var(--dot-lo)" /></radialGradient>
      <filter id="fx-engrave" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        <feOffset in="SourceAlpha" dy={sp * 0.016} result="o1" /><feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="o1" operator="in" result="hi" />
        <feOffset in="SourceAlpha" dy={-sp * 0.01} result="o2" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o2" operator="in" result="lo" />
        <feMerge><feMergeNode in="hi" /><feMergeNode in="lo" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="fx-emboss" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={sp * 0.005} result="ink" />
        <feOffset in="SourceAlpha" dy={sp * 0.012} result="o1" /><feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="o1" operator="in" result="hi" />
        <feOffset in="SourceAlpha" dy={-sp * 0.008} result="o2" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o2" operator="in" result="lo" />
        <feMerge><feMergeNode in="hi" /><feMergeNode in="lo" /><feMergeNode in="ink" /></feMerge>
      </filter>
      <filter id="fx-glow" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={sp * 0.045} result="near" /><feGaussianBlur in="SourceGraphic" stdDeviation={sp * 0.13} result="far" />
        <feMerge><feMergeNode in="far" /><feMergeNode in="near" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="fx-glow-soft" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={sp * 0.035} result="b" /><feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .65 0" result="halo" />
        <feMerge><feMergeNode in="halo" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <path class="lanes" d={lanes} stroke-width={stroke * 0.5} />

    <g class="bxs">
    {#each boxes as bx (bx.b)}
      {@const x = P(bx.b % cols)}{@const y = P(Math.floor(bx.b / cols))}{@const i = sp * 0.1}
      <g class="bx" class:pop={anim}>
        <rect x={x + i} y={y + i} width={sp - 2 * i} height={sp - 2 * i} rx={sp * 0.12} stroke-width={sp * 0.035} style:fill={bx.p === 0 ? 'var(--box1)' : 'var(--box2)'}
          style:fill-opacity="var(--box-op)" style:stroke={bx.p === 0 ? 'var(--box-rim1)' : 'var(--box-rim2)'} />
        <rect x={x + i} y={y + i} width={sp - 2 * i} height={sp - 2 * i} rx={sp * 0.12} fill="url(#pat{bx.p})" />
        <text x={x + sp / 2} y={y + sp / 2} text-anchor="middle" dominant-baseline="central" font-weight="800" font-size={sp * 0.34} paint-order="stroke" stroke-linejoin="round" stroke-width={sp * 0.07} style:stroke="var(--ini-halo)" style:font-family="var(--display)" style:fill={bx.p === 0 ? 'var(--box1-ink)' : 'var(--box2-ink)'}>{initials[bx.p]}</text>
      </g>
    {/each}
    </g>

    {#if preview >= 0 && interactive}
      {@const [x1, y1, x2, y2] = xy(preview)}
      <line class="preview p{turn}" {x1} {y1} {x2} {y2} stroke-width={stroke} stroke-linecap="round" stroke-dasharray="{stroke * 0.1} {stroke * 1.6}" />
    {/if}

    <g class="lines">
    {#each lines as l (l.e)}
      {@const [x1, y1, x2, y2] = xy(l.e)}
      <line class="ln" class:grow={anim} {x1} {y1} {x2} {y2} stroke-width={stroke} style="--len:{sp}" style:stroke={lineColor(l.p)} />
    {/each}
    </g>
    <g class="cores">
    {#each lines as l (l.e)}
      {@const [x1, y1, x2, y2] = xy(l.e)}
      <line class="ln" class:grow={anim} {x1} {y1} {x2} {y2} stroke-width={stroke * 0.36} style="--len:{sp}" style:stroke={coreColor(l.p)} />
    {/each}
    </g>

    <!-- A drag from a dot: a thin line to the pointer, or once it snaps, the line it will draw inside the same ring as
         the keyboard cursor (the ring reaches 3:1 on every board, even on Tabletop's lit felt). -->
    {#if dragAt && anchor >= 0}
      {#if snap >= 0}
        {@const [x1, y1, x2, y2] = xy(snap)}{@const rg = ring(snap)}
        <line class="drag p{turn}" {x1} {y1} {x2} {y2} stroke-width={stroke} stroke-linecap="round" />
        <rect class="kbd-ring" x={rg.x} y={rg.y} width={rg.width} height={rg.height} rx={rg.rx} />
      {:else}
        {@const [ax, ay] = dotXY(anchor)}
        <line class="drag p{turn}" x1={ax} y1={ay} x2={dragAt[0]} y2={dragAt[1]} stroke-width={stroke * 0.45} stroke-linecap="round" />
      {/if}
    {/if}

    {#if focused && kbd && cursor >= 0}
      {@const [x1, y1, x2, y2] = xy(cursor)}{@const rg = ring(cursor)}
      <line {x1} {y1} {x2} {y2} stroke-width={stroke * 2.4} stroke-linecap="round" style="stroke:var(--accent);opacity:.35" />
      <!-- A 3 px focus ring round the line (.kbd-ring in app.css): the band alone is too faint on every board. -->
      <rect class="kbd-ring" x={rg.x} y={rg.y} width={rg.width} height={rg.height} rx={rg.rx} />
    {/if}

    <g class="dots">
    {#each { length: rows + 1 } as _, yy}
      {#each { length: cols + 1 } as _, xx}
        <circle cx={P(xx)} cy={P(yy)} r={dotR} class="dot" style="fill:url(#dot-bead)" />
      {/each}
    {/each}
    </g>

    <!-- The dot picked up for a drag. -->
    {#if anchor >= 0}
      {@const [ax, ay] = dotXY(anchor)}
      <circle class="drag-dot" cx={ax} cy={ay} r={dotR * 2} />
    {/if}
  </svg>
</div>
