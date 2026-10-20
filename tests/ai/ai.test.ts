// The AI levels on hand-built endgames whose correct play is known, and on random positions: `npm run test:ai`.
// Boards are drawn as text: `+--+` a drawn line between two dots, `+  +` a free one; on the rows between, `|` is a
// drawn upright line and `:` a free one.
import { describe, expect, it } from 'vitest';
import { createAI } from '../../src/lib/engine/ai-core.js';
import { geometry, newGame, play, drawnMask, type Geometry } from '../../src/lib/engine/rules';

function parse(art: string) {
  const raw = art.split('\n').filter(l => /[+|:]/.test(l)), off = raw[0].indexOf('+'), lines = raw.map(l => l.slice(off).trimEnd());
  const rows = (lines.length - 1) / 2, cols = (lines[0].length - 1) / 3, g = geometry(rows, cols), d = new Uint8Array(g.E);
  lines.forEach((l, i) => {
    const r = i >> 1;
    if (i % 2 === 0) for (let c = 0; c < cols; c++) d[r * cols + c] = l.slice(3 * c + 1, 3 * c + 3).includes('-') ? 1 : 0;
    else for (let c = 0; c <= cols; c++) d[g.H + r * (cols + 1) + c] = l[3 * c] === '|' ? 1 : 0;
  });
  return { g, d };
}
/** Horizontal line in dot row r, box column c; upright line in box row r, dot column c. */
const h = (g: Geometry, r: number, c: number) => r * g.cols + c;
const v = (g: Geometry, r: number, c: number) => g.H + r * (g.cols + 1) + c;
const sides = (g: Geometry, d: Uint8Array, b: number) => g.boxEdges[b].reduce((s, e) => s + d[e], 0);
const isSafe = (g: Geometry, d: Uint8Array, e: number) => g.edgeBoxes[e].every(b => sides(g, d, b) < 2);
const completes = (g: Geometry, d: Uint8Array, e: number) => g.edgeBoxes[e].some(b => sides(g, d, b) === 3);
/** Boxes the opponent can take straight after line e. */
function given(g: Geometry, d: Uint8Array, e: number) {
  const dd = Uint8Array.from(d); dd[e] = 1; let n = 0;
  for (let again = true; again;) { again = false; for (let b = 0; b < g.NB; b++) if (sides(g, dd, b) === 3) { dd[g.boxEdges[b].find(x => !dd[x])!] = 1; n++; again = true; } }
  return n;
}
/** Brute force over the drawn lines as a bitmask (up to 31 lines, as on 3x4): value = net boxes for the player to move. */
function solver(g: Geometry) {
  const memo = new Map<number, number>(), full = 2 ** g.E - 1;
  const boxMask = g.boxEdges.map(es => es.reduce((m, e) => m + 2 ** e, 0));
  const done = (m: number, e: number) => g.edgeBoxes[e].filter(b => ((m + 2 ** e) & boxMask[b]) === boxMask[b]).length;
  const value = (m: number): number => {
    if (m === full) return 0;
    const hit = memo.get(m); if (hit !== undefined) return hit;
    let best = -99;
    for (let e = 0; e < g.E; e++) if (!(m & 2 ** e)) best = Math.max(best, worth(m, e));
    memo.set(m, best); return best;
  };
  /** What line e is worth to the player drawing it in position m: boxes it closes, then the rest of the game.
   *  (0 - x rather than -x: no -0, which toBe tells apart from 0.) */
  const worth = (m: number, e: number) => { const k = done(m, e); return k ? k + value(m + 2 ** e) : 0 - value(m + 2 ** e); };
  return { value, worth };
}
const mask = (d: Uint8Array) => d.reduce((x, on, e) => (on ? x + 2 ** e : x), 0);
/** All the moves a level makes in a position, over a few tries (Hard picks at random among equally good moves). */
const moves = (level: 'easy' | 'medium' | 'hard', g: Geometry, d: Uint8Array, tries = 6) =>
  new Set(Array.from({ length: tries }, () => createAI().choose(g, d, level)));

describe('known endgames', () => {
  it('keeps control with all-but-two: hands the last two boxes of a chain back when another long chain is left', () => {
    // Top row: two boxes taken, then a chain of two (box 3 sides, then 2 sides); bottom row: an unopened chain of 4.
    const { g, d } = parse(`
      +--+--+--+--+
      |  |  |  :  :
      +--+--+--+--+
      :  :  :  :  :
      +--+--+--+--+`);
    // Taking both and then opening the 4-chain nets -2; handing them back (the far end line) nets +2.
    expect(moves('hard', g, d)).toEqual(new Set([v(g, 0, 4)]));
    expect(moves('medium', g, d)).toEqual(new Set([v(g, 0, 3)]));   // Medium is greedy: takes the box
  });

  it('declines a whole 4-loop (all-but-four) when a longer chain is left', () => {
    // Left: a 2x2 loop the opponent opened (top middle line); right: a chain of 6 snaking through the other boxes.
    const { g, d } = parse(`
      +--+--+  +--+--+
      |  |  |  :  :  |
      +  +  +--+--+  +
      |  :  |  :  :  |
      +--+--+  +--+--+`);
    // Taking the four and opening the chain nets 4 - 6 = -2; the line opposite the opened one leaves two pairs: +2.
    expect(moves('hard', g, d)).toEqual(new Set([v(g, 1, 1)]));
  });

  it('gives a 2-chain away hard-heartedly (middle line), so it can\'t be handed back', () => {
    // Top row: a chain of two (boxes 0-1) and two boxes taken; bottom row: an unopened chain of 4.
    const { g, d } = parse(`
      +--+  +--+--+
      :  :  |  |  |
      +--+--+--+--+
      :  :  :  :  :
      +--+--+--+--+`);
    // Middle line: the opponent takes 2 and must open the 4-chain (+2). An end line lets them hand the pair back (-2).
    expect(moves('hard', g, d)).toEqual(new Set([v(g, 0, 1)]));
  });

  it('Medium gives away the shortest chain when it has to', () => {
    // A single box (top left), a chain of 3 (rest of the top row) and a chain of 4 (bottom row); no safe lines.
    const { g, d } = parse(`
      +  +  +--+--+
      :  |  :  :  :
      +--+--+--+--+
      :  :  :  :  :
      +--+--+--+--+`);
    for (const e of moves('medium', g, d, 12)) expect(given(g, d, e)).toBe(1);
  });

  it('Easy still plays (any free line)', () => {
    const { g, d } = parse(`
      +--+  +
      :  :  :
      +  +--+`);
    for (const e of moves('easy', g, d, 12)) expect(d[e]).toBe(0);
  });
});

describe('two chains to take at once', () => {
  // Regression: the exact search only weighed declining the first chain it found, never taking another chain first and then
  // declining that one, so it undervalued some positions (12 of 6,000 3x4 positions with two or more chains to take, against
  // brute force) and in this one picked a line worth 2 boxes where 4 were there. Found on 2026-10-19 while porting the search.
  const cases = [`
      +--+--+--+  +
      |  |  |  :  |
      +--+--+--+--+
      |  :  :  |  |
      +--+--+--+--+
      :  :  :  |  |
      +--+--+  +--+`];
  it('Hard keeps the best value when two chains can be taken', () => {
    for (const art of cases) {
      const { g, d } = parse(art), { value, worth } = solver(g), m = mask(d);
      for (const e of moves('hard', g, d)) expect(worth(m, e)).toBe(value(m));
    }
  });
});

describe('thinking on the player\'s time', () => {
  // While the player decides, Hard solves the positions their replies would leave (Game.svelte starts it on the player's
  // turn, the worker runs it in slices). Hard here gets next to no time of its own, so its moves come from that work.
  it('finishes, and then plays a best move after every reply', () => {
    const g = geometry(3, 4), { value, worth } = solver(g);
    for (let i = 0; i < 3; i++) {
      let d: Uint8Array;   // random play to 18 lines left, the player to move with no box to take
      do {
        const st = newGame({ rows: 3, cols: 4 }, 0);
        while (!st.over && g.E - st.moves.length > 18) {
          const dd = drawnMask(st), free = [...dd.keys()].filter(e => !dd[e]);
          const cap = free.filter(e => completes(g, dd, e)), safe = free.filter(e => isSafe(g, dd, e));
          const pool = cap.length ? cap : safe.length ? safe : free;
          play(st, pool[Math.floor(Math.random() * pool.length)]);
        }
        d = drawnMask(st);
      } while (d.reduce((n, on) => n + on, 0) !== g.E - 18 || g.boxEdges.some((_, b) => sides(g, d, b) === 3));
      const ai = createAI({ timeScale: 0.001 });
      let slices = 0; while (ai.ponder(g, d, 40)) expect(++slices).toBeLessThan(500);
      for (const r of [...d.keys()].filter(e => !d[e])) {
        const c = Uint8Array.from(d); c[r] = 1;
        expect(worth(mask(c), ai.choose(g, c, 'hard'))).toBe(value(mask(c)));
      }
    }
  });

  it('waits while the player has a box to take', () => {
    const { g, d } = parse(`
      +--+--+--+--+
      |  |  |  :  :
      +--+--+--+--+
      :  :  :  :  :
      +--+--+--+--+`);
    expect(createAI().ponder(g, d, 40)).toBe(false);
  });
});

describe('random positions', () => {
  // Positions from random play on 5x5: both sides take boxes when they can, else draw a random safe line, else any.
  // `most` caps the moves played (Hard's exact search takes over with 34 of the 60 lines left).
  function positions(n: number, size = 5, most = 48) {
    const g = geometry(size, size), out: Uint8Array[] = [];
    while (out.length < n) {
      const st = newGame({ rows: size, cols: size }, 0), stop = 8 + Math.floor(Math.random() * (most - 7));
      while (!st.over && st.moves.length < stop) {
        const d = drawnMask(st), free = [...d.keys()].filter(e => !d[e]);
        const cap = free.filter(e => completes(g, d, e)), safe = free.filter(e => isSafe(g, d, e)), pool = cap.length ? cap : safe.length ? safe : free;
        play(st, pool[Math.floor(Math.random() * pool.length)]);
      }
      if (!st.over) out.push(drawnMask(st));
    }
    return { g, out };
  }

  it('Medium takes a box whenever it can, and never gives a box its third side while a safe line exists', () => {
    const { g, out } = positions(60);
    for (const d of out) {
      const e = createAI().choose(g, d, 'medium'), free = [...d.keys()].filter(x => !d[x]);
      expect(d[e]).toBe(0);
      if (free.some(x => completes(g, d, x))) expect(completes(g, d, e)).toBe(true);
      else if (free.some(x => isSafe(g, d, x))) expect(isSafe(g, d, e)).toBe(true);
    }
  });

  // Before its exact search starts (more than 34 lines left on 5x5). Inside that window perfect play may give more away
  // on purpose (found by /qa on 2026-10-15: a 5-box sacrifice with one safe line left, confirmed optimal by the search).
  it('Hard never gives boxes away needlessly: with safe lines left, a third side is only ever a sacrifice of 1 or 2 boxes', () => {
    const { g, out } = positions(30, 5, 25);
    for (const d of out) {
      const e = createAI({ timeScale: 0.15 }).choose(g, d, 'hard'), free = [...d.keys()].filter(x => !d[x]);
      expect(d[e]).toBe(0);
      if (!free.some(x => completes(g, d, x)) && free.some(x => isSafe(g, d, x)) && !isSafe(g, d, e)) expect(given(g, d, e)).toBeLessThanOrEqual(2);
    }
  });
});

describe('3x3 play is perfect', () => {
  // The brute-force solver above, over the 24-line 3x3 board.
  const g = geometry(3, 3), { value, worth } = solver(g);
  it('Hard chooses an optimal move in 40 random positions with 10 to 14 lines left', () => {
    for (let i = 0; i < 40; i++) {
      const st = newGame({ rows: 3, cols: 3 }, 0), left = 10 + (i % 5);
      while (24 - st.moves.length > left) { const free = [...Array(24).keys()].filter(e => st.lines[e] < 0); play(st, free[Math.floor(Math.random() * free.length)]); }
      if (st.over) continue;
      const d = drawnMask(st);
      expect(worth(mask(d), createAI().choose(g, d, 'hard'))).toBe(value(mask(d)));
    }
  });
});
