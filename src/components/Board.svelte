<script lang="ts">
  /**
   * The game board. Purely presentational: it renders lines and boxes it is given
   * and reports the edge a player chooses through `onmove`, with how it was chosen (each has its own sound).
   * Pointer: drag from a dot towards a neighbouring dot; the line snaps into place once the pointer is far enough
   * along it, and letting go draws it (letting go anywhere else draws nothing). A press on a line still previews it
   * and releasing draws it (drag to adjust), and hovering shows a preview. Sounds: pick-up, snap and cancel.
   * The drag is an elastic band: its end stays under the pointer, its middle swings behind and settles, it springs
   * onto the dot it snaps to and back to its own dot when let go with no line; broken rings turn round the dots it
   * can land on. With Animations off it follows the pointer exactly and nothing turns.
   * Keyboard: arrow keys move a cursor between free lines; Enter or Space draws.
   * The cursor shows only in keyboard play and on the player's turn: a click or tap also focuses the board, but hides it.
   */
  import { geometry } from '../lib/engine/rules';
  import { layout, PAD } from '../lib/boardFit';
  import { sfx } from '../lib/sound';
  import { app } from '../lib/state/app.svelte';

  let { rows, cols, lines, boxes, turn, interactive, initials, anim, onmove }: {
    rows: number; cols: number;
    lines: { e: number; p: number }[];
    boxes: { b: number; p: number }[];
    turn: 0 | 1;
    interactive: boolean;
    initials: [string, string];
    anim: boolean;
    onmove: (e: number, how: 'tap' | 'drag' | 'key') => void;
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
  /** Neon's light: a thinner, whiter line drawn inside each line (hidden in other themes through --cores). */
  const coreColor = (p: number) => `color-mix(in srgb, ${lineColor(p)} var(--core-mix, 40%), #fff)`;
  /** Neon's glow: four copies of each line under it, each wider and fainter (widths in line widths; opacities in app.css). */
  const HALOS: [string, number][] = [['h4', 4.2], ['h3', 3.1], ['h2', 2.3], ['h1', 1.6]];
  /** Neon's layers (the glow under each line, the light inside it, each tile's glass base and highlight) are built only in
   *  Neon, and the reflection and the glow round the dots only in Dark Neon, so other themes' boards carry no hidden extra
   *  shapes to create and lay out. How each layer looks is still up to the mode's tokens in app.css. */
  const neon = $derived(app.settings.skin === 'neon');
  const neonDark = $derived(neon && app.settings.theme === 'dark');
  const xy = (e: number) => { const [a, b, c, d] = g.coords(e); return [P(a), P(b), P(c), P(d)]; };
  /** The printed guide under every possible line, as one path (cheap even on 12x12). */
  const lanes = $derived(Array.from({ length: g.E }, (_, e) => { const [a, b, c, d] = xy(e); return `M${a} ${b}L${c} ${d}`; }).join(''));

  let svg: SVGSVGElement;
  // kbd: keyboard mode, turned on by keyboard focus or a board key and off by any pointer press.
  let preview = $state(-1), cursor = $state(-1), focused = $state(false), kbd = $state(false), pressing = false;
  // Dragging from a dot: the dot picked up, where the pointer is once it has moved far enough to count as a drag,
  // the free line it would draw if let go now, and the dot under a hovering mouse (for the grab cursor).
  let anchor = $state(-1), dragAt = $state<[number, number] | null>(null), snap = $state(-1), hoverDot = $state(-1);
  let downAt: [number, number] = [0, 0], pid = -1, touchPress = $state(false);
  // In dot gaps: a press this close to a dot picks it up, this much movement starts the drag, and the line snaps
  // once the pointer is this far along it (and no further than half a gap to the side).
  const PICK = 0.24, START = 0.12, SNAP = 0.45;

  // The elastic band drawn for a drag: from `from` (the picked-up dot) to `tip`, bending through `bend`. The tip sits
  // on the pointer (`onPointer`) except while it springs onto a dot (snapped, or let go with no line) and while it
  // catches up after unsnapping; the bend chases the band's middle on a softer spring, so the band swings and settles.
  let from = $state<[number, number] | null>(null), tip = $state<[number, number]>([0, 0]), bend = $state<[number, number]>([0, 0]);
  let back = $state(false), onPointer = true, tipV = [0, 0], bendV = [0, 0], raf = 0, last = 0;
  // Springs, per second squared and per second: the tip lands on a dot with a visible bounce (about a fifth of the
  // jump), snaps home faster when let go, and the bend lags and wobbles most, so the band bows when swung.
  const TIP_K = 900, TIP_C = 26, BACK_K = 700, BACK_C = 24, BEND_K = 180, BEND_C = 10;
  const spring = (p: number[], v: number[], goal: number[], k: number, c: number, dt: number) => {
    for (let i = 0; i < 2; i++) { v[i] += (k * (goal[i] - p[i]) - c * v[i]) * dt; p[i] += v[i] * dt; }
  };
  /** Where the tip is heading: back to its dot, the far end of the snapped line, or the pointer. */
  function tipGoal(): [number, number] {
    if (back || !dragAt || !from) return from ?? tip;
    if (snap >= 0) { const [x1, y1, x2, y2] = xy(snap); return Math.hypot(x1 - from[0], y1 - from[1]) < 1 ? [x2, y2] : [x1, y1]; }
    return dragAt;
  }
  function frame(t: number) {
    raf = 0; if (!from) return;
    const dt = Math.min(0.032, last ? (t - last) / 1000 : 1 / 60); last = t;
    const goal = tipGoal(), p = [...tip], b = [...bend];
    if (!anim) { endOrHold(goal); return; }
    if (onPointer && !back && snap < 0 && dragAt) { p[0] = dragAt[0]; p[1] = dragAt[1]; tipV = [0, 0]; }
    else {
      spring(p, tipV, goal, back ? BACK_K : TIP_K, back ? BACK_C : TIP_C, dt);
      if (!back && snap < 0 && Math.hypot(goal[0] - p[0], goal[1] - p[1]) < sp * 0.02) onPointer = true;   // caught up
    }
    // let go: gone once the tip is home and slow (its little bounce past the dot is hidden under the dot)
    if (back && Math.hypot(p[0] - from[0], p[1] - from[1]) < dotR * 0.6 && Math.hypot(tipV[0], tipV[1]) < sp * 0.8) { stopBand(); return; }
    spring(b, bendV, [(from[0] + p[0]) / 2, (from[1] + p[1]) / 2], BEND_K, BEND_C, dt);
    tip = [p[0], p[1]]; bend = [b[0], b[1]];
    const settled = Math.hypot(goal[0] - p[0], goal[1] - p[1]) < sp * 0.004 && Math.hypot(...tipV) < sp * 0.05
      && Math.hypot(b[0] - (from[0] + p[0]) / 2, b[1] - (from[1] + p[1]) / 2) < sp * 0.004 && Math.hypot(...bendV) < sp * 0.05;
    if (settled) endOrHold(goal); else raf = requestAnimationFrame(frame);
  }
  /** At rest: a band let go is gone; one still held lies straight to its goal until the pointer moves again. */
  function endOrHold(goal: [number, number]) {
    if (back) { stopBand(); return; }
    tip = goal; bend = from ? [(from[0] + goal[0]) / 2, (from[1] + goal[1]) / 2] : goal; tipV = [0, 0]; bendV = [0, 0];
  }
  const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };
  function stopBand() { if (raf) cancelAnimationFrame(raf); raf = 0; from = null; back = false; onPointer = true; tipV = [0, 0]; bendV = [0, 0]; }
  /** The dots a drag from the picked-up dot can land on: its neighbours across a free line. */
  const landings = $derived.by(() => {
    if (anchor < 0 || !dragAt) return [];
    const r = Math.floor(anchor / (cols + 1)), c = anchor % (cols + 1), out: { e: number; x: number; y: number }[] = [];
    for (const [dr, dc] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      const r2 = r + dr, c2 = c + dc; if (r2 < 0 || r2 > rows || c2 < 0 || c2 > cols) continue;
      const e = dr === 0 ? r * cols + Math.min(c, c2) : g.H + Math.min(r, r2) * (cols + 1) + c;
      if (!drawn.has(e)) out.push({ e, x: P(c2), y: P(r2) });
    }
    return out;
  });

  // Clear stale preview/cursor/drag when it stops being our turn or the line gets drawn.
  $effect(() => { if (!interactive) { preview = -1; hoverDot = -1; if (pressing) reset(); stopBand(); } });
  // The cursor's line drawn (by anyone): it moves to the free line nearest to it, not back to the middle of the board.
  $effect(() => { if (cursor >= 0 && drawn.has(cursor)) cursor = nearestFree(mid(cursor)); });

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
    stopBand();                                           // a band still springing back from the last drag goes
    pressing = true; pid = ev.pointerId; touchPress = ev.pointerType === 'touch';
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
    if (!dragAt) {   // the drag starts: the band leaves the dot with its middle still at the dot, so it swings out
      sfx.play('pick'); const a = dotXY(anchor);
      from = [a[0], a[1]]; tip = [x, y]; bend = [a[0], a[1]]; onPointer = true; back = false;
    }
    dragAt = [x, y];
    const s = snapTo(x, y);
    if (s !== snap) { snap = s; onPointer = false; if (s >= 0) sfx.play('snap'); }   // spring onto the dot, or off it
    kick();
  }
  function up(ev: PointerEvent) {
    if (!pressing || ev.pointerId !== pid) return;
    const dragged = dragAt !== null, e = dragged ? snap : anchor >= 0 ? tapNearDot(ev) : edgeAt(ev);
    if (dragged && e < 0) { sfx.play('cancel'); letGo(); }
    else stopBand();
    reset();
    if (interactive && e >= 0) onmove(e, dragged ? 'drag' : 'tap');
  }
  /** A drag let go with no line: the band springs back to its dot, then goes. */
  function letGo() { if (from) { back = true; onPointer = false; kick(); } }
  function cancel() { if (dragAt) letGo(); reset(); }
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
      if (!interactive) return;              // not the player's turn: the cursor is hidden, so it stays where it is
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
      if (interactive && !drawn.has(cursor)) onmove(cursor, 'key');
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
    onpointercancel={cancel}
    onpointerleave={() => { if (!pressing) { preview = -1; hoverDot = -1; } }}
    onkeydown={key}
    onfocus={() => { focused = true; kbd = keyboardFocus(); if (cursor < 0 || drawn.has(cursor)) cursor = nearestFree(); }}
    onblur={() => (focused = false)}>
    <defs>
      <!-- Patterns keep ownership readable without color: stripes = player 1, dots = player 2. -->
      <pattern id="pat0" width={sp * 0.1} height={sp * 0.1} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={sp * 0.026} height={sp * 0.1} style="fill:var(--pat1)" opacity=".24" /></pattern>
      <pattern id="pat1" width={sp * 0.1} height={sp * 0.1} patternUnits="userSpaceOnUse"><circle cx={sp * 0.05} cy={sp * 0.05} r={sp * 0.016} style="fill:var(--pat2)" opacity=".24" /></pattern>
      <!-- Materials. Each theme chooses through tokens (app.css): a bead for the dots, and engraved (Tabletop by day),
           pressed-into-paper (Paper by day), lifted (Tabletop at night) or flat-shadowed (Paper at night) lines and dots.
           Neon draws its glow with plain strokes instead (the halos below). Sizes follow the dot spacing. -->
      <radialGradient id="dot-bead" fx=".36" fy=".32"><stop offset="0" style="stop-color:var(--dot-hi)" /><stop offset=".58" style="stop-color:var(--dot)" /><stop offset="1" style="stop-color:var(--dot-lo)" /></radialGradient>
      <!-- Each filter covers the whole board (user space), not its group's box: while the lines group holds only lines along
           one row or one column (a game's first line, say), that box has no height or no width, a region sized from it is
           empty, and those lines weren't painted until a line in the other direction arrived. -->
      <filter id="fx-engrave" filterUnits="userSpaceOnUse" x="0" y="0" width={L.W} height={L.H} color-interpolation-filters="sRGB">
        <feOffset in="SourceAlpha" dy={sp * 0.016} result="o1" /><feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="o1" operator="in" result="hi" />
        <feOffset in="SourceAlpha" dy={-sp * 0.01} result="o2" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o2" operator="in" result="lo" />
        <feMerge><feMergeNode in="hi" /><feMergeNode in="lo" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="fx-emboss" filterUnits="userSpaceOnUse" x="0" y="0" width={L.W} height={L.H} color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={sp * 0.005} result="ink" />
        <feOffset in="SourceAlpha" dy={sp * 0.012} result="o1" /><feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="o1" operator="in" result="hi" />
        <feOffset in="SourceAlpha" dy={-sp * 0.008} result="o2" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o2" operator="in" result="lo" />
        <feMerge><feMergeNode in="hi" /><feMergeNode in="lo" /><feMergeNode in="ink" /></feMerge>
      </filter>
      <!-- A soft drop shadow in three steps (no blur, so it stays cheap) under a faint lit top edge: pressed-paper strips and
           ash dots slightly raised off the felt-paper. -->
      <filter id="fx-lift" filterUnits="userSpaceOnUse" x="0" y="0" width={L.W} height={L.H} color-interpolation-filters="sRGB">
        <feOffset in="SourceAlpha" dy={sp * 0.009} result="o1" />
        <feOffset in="SourceAlpha" dy={sp * 0.018} result="o2" /><feComponentTransfer in="o2" result="s2"><feFuncA type="linear" slope=".5" /></feComponentTransfer>
        <feOffset in="SourceAlpha" dy={sp * 0.03} result="o3" /><feComponentTransfer in="o3" result="s3"><feFuncA type="linear" slope=".22" /></feComponentTransfer>
        <feMerge result="m"><feMergeNode in="s3" /><feMergeNode in="s2" /><feMergeNode in="o1" /></feMerge>
        <feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="m" operator="in" result="sh" />
        <feOffset in="SourceAlpha" dy={-sp * 0.006} result="o4" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o4" operator="in" result="lit" />
        <feMerge><feMergeNode in="sh" /><feMergeNode in="lit" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <!-- A flat drop shadow, like a separate layer of paper, under a faint lit top edge; crisp edges, no blur. -->
      <filter id="fx-flat" filterUnits="userSpaceOnUse" x="0" y="0" width={L.W} height={L.H} color-interpolation-filters="sRGB">
        <feOffset in="SourceAlpha" dx={sp * 0.008} dy={sp * 0.02} result="o1" /><feFlood style="flood-color:var(--fx-hi)" /><feComposite in2="o1" operator="in" result="sh" />
        <feOffset in="SourceAlpha" dy={-sp * 0.006} result="o2" /><feFlood style="flood-color:var(--fx-lo)" /><feComposite in2="o2" operator="in" result="lit" />
        <feMerge><feMergeNode in="sh" /><feMergeNode in="lit" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <!-- Neon's polished tiles: a crisp highlight across the top left corner. -->
      <linearGradient id="tile-gloss" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style="stop-color:#fff;stop-opacity:var(--gloss-a)" /><stop offset=".34" style="stop-color:#fff;stop-opacity:calc(var(--gloss-a) * .35)" />
        <stop offset=".35" style="stop-color:#fff;stop-opacity:0" /><stop offset="1" style="stop-color:#fff;stop-opacity:0" />
      </linearGradient>
    </defs>

    <path class="lanes" d={lanes} stroke-width={stroke * 0.5} />

    <!-- Neon's glow: wider, fainter copies of each line under it (plain strokes, no blur filter, so it costs nothing while a
         line grows or a drag moves). Under the boxes, so the glow never tints a captured tile. Neon only. -->
    {#if neon}
    <g class="halos">
    {#each lines as l (l.e)}
      {@const [x1, y1, x2, y2] = xy(l.e)}
      {#each HALOS as [k, w] (k)}
        <line class="ln {k}" class:grow={anim} {x1} {y1} {x2} {y2} stroke-width={stroke * w} style="--len:{sp}" style:stroke={lineColor(l.p)} />
      {/each}
    {/each}
    </g>
    {/if}

    <g class="bxs">
    {#each boxes as bx (bx.b)}
      {@const x = P(bx.b % cols)}{@const y = P(Math.floor(bx.b / cols))}{@const i = sp * 0.1}
      <g class="bx" class:pop={anim}>
        {#if neon}<rect class="tile-base" x={x + i} y={y + i} width={sp - 2 * i} height={sp - 2 * i} rx={sp * 0.12} />{/if}
        <rect x={x + i} y={y + i} width={sp - 2 * i} height={sp - 2 * i} rx={sp * 0.12} stroke-width={sp * 0.035} style:fill={bx.p === 0 ? 'var(--box1)' : 'var(--box2)'}
          style:fill-opacity="var(--box-op)" style:stroke={bx.p === 0 ? 'var(--box-rim1)' : 'var(--box-rim2)'} />
        <rect x={x + i} y={y + i} width={sp - 2 * i} height={sp - 2 * i} rx={sp * 0.12} fill="url(#pat{bx.p})" />
        {#if neon}<rect class="gloss" x={x + i} y={y + i} width={sp - 2 * i} height={sp - 2 * i} rx={sp * 0.12} fill="url(#tile-gloss)" />{/if}
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
    {#if neon}
    <g class="cores">
    {#each lines as l (l.e)}
      {@const [x1, y1, x2, y2] = xy(l.e)}
      <line class="ln" class:grow={anim} {x1} {y1} {x2} {y2} stroke-width={stroke * 0.36} style="--len:{sp}" style:stroke={coreColor(l.p)} />
    {/each}
    </g>
    {/if}
    <!-- Dark Neon: a sharp reflection of each line on the glass, a little below and to the right. -->
    {#if neonDark}
    <g class="reflect">
    {#each lines as l (l.e)}
      {@const [x1, y1, x2, y2] = xy(l.e)}{@const o = sp * 0.1}
      <line class="ln" class:grow={anim} x1={x1 + o * 0.45} y1={y1 + o} x2={x2 + o * 0.45} y2={y2 + o} stroke-width={stroke * 0.22} style="--len:{sp}" style:stroke={coreColor(l.p)} />
    {/each}
    </g>
    {/if}

    <!-- A drag from a dot: the elastic band, thin while it stretches to the pointer and the line's full width once it
         snaps, when the line it will draw also gets the keyboard cursor's ring (3:1 on every board, even on Tabletop's
         lit felt). The curve passes through `bend` halfway along. -->
    {#if from}
      {@const len = Math.hypot(tip[0] - from[0], tip[1] - from[1])}
      {@const w = snap >= 0 && !back ? stroke : stroke * 0.5 * Math.min(1.25, Math.max(0.7, Math.sqrt(sp * 0.5 / Math.max(len, 1))))}
      <path class="drag p{turn}" fill="none" stroke-linecap="round" style:stroke-width="{w}px"
        d="M{from[0]} {from[1]}Q{2 * bend[0] - (from[0] + tip[0]) / 2} {2 * bend[1] - (from[1] + tip[1]) / 2} {tip[0]} {tip[1]}" />
    {/if}
    {#if dragAt && anchor >= 0 && snap >= 0}
      {@const rg = ring(snap)}
      <rect class="kbd-ring" x={rg.x} y={rg.y} width={rg.width} height={rg.height} rx={rg.rx} />
    {/if}
    <!-- The dots this drag can land on: a broken ring turning round each. The one it has snapped to gives its ring up to
         the line's ring above, so the target never carries two outlines. -->
    {#each landings as d (d.e)}
      {#if d.e !== snap}
        {@const per = (2 * Math.PI * sp * 0.22) / 8}
        <circle class="land p{turn}" cx={d.x} cy={d.y} r={sp * 0.22} stroke-width={Math.max(3.5, sp * 0.045)}
          stroke-dasharray="{per * 0.62} {per * 0.38}" />
      {/if}
    {/each}

    {#if focused && kbd && cursor >= 0 && interactive}
      {@const [x1, y1, x2, y2] = xy(cursor)}{@const rg = ring(cursor)}
      <!-- The line Enter would draw, previewed as hovering shows it (in the mover's line colour), inside a 3 px focus ring
           (.kbd-ring in app.css), on the player's turn only. -->
      <line class="preview p{turn}" {x1} {y1} {x2} {y2} stroke-width={stroke} stroke-linecap="round" stroke-dasharray="{stroke * 0.1} {stroke * 1.6}" />
      <rect class="kbd-ring" x={rg.x} y={rg.y} width={rg.width} height={rg.height} rx={rg.rx} />
    {/if}

    <!-- Dark Neon's glow round each dot. -->
    {#if neonDark}
    <g class="dot-halos">
    {#each { length: rows + 1 } as _, yy}
      {#each { length: cols + 1 } as _, xx}
        <circle cx={P(xx)} cy={P(yy)} r={dotR * 2.5} class="dh2" /><circle cx={P(xx)} cy={P(yy)} r={dotR * 1.65} class="dh1" />
      {/each}
    {/each}
    </g>
    {/if}
    <g class="dots">
    {#each { length: rows + 1 } as _, yy}
      {#each { length: cols + 1 } as _, xx}
        <circle cx={P(xx)} cy={P(yy)} r={dotR} class="dot" style="fill:url(#dot-bead)" />
      {/each}
    {/each}
    </g>

    <!-- The dot picked up for a drag; under a finger the ring is wide enough to show round the fingertip. -->
    {#if anchor >= 0}
      {@const [ax, ay] = dotXY(anchor)}
      <circle class="drag-dot" cx={ax} cy={ay} r={touchPress ? sp * 0.42 : dotR * 2} />
    {/if}
  </svg>
</div>
