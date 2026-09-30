// Builds and checks the Hard AI's 3×3 opening book (BOOK_SRC in src/lib/engine/ai-core.js).
//   node scripts/opening-book.mjs                   print a fresh BOOK_SRC
//   node scripts/opening-book.mjs --check [games]   check the book and the AI against a full solve,
//                                                   then play Hard vs Hard (200 games by default)
// Both first solve all 2^24 3×3 positions backwards from the full board: a few seconds, 16 MB.
// Needs Node 22.18 or newer, which runs the TypeScript import of rules.ts directly.
import { readFileSync } from 'node:fs';
import { createAI } from '../src/lib/engine/ai-core.js';
import { geometry } from '../src/lib/engine/rules.ts';

const g = geometry(3, 3), { E, boxEdges, edgeBoxes } = g;
const BOOK_LINES = 4, B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const log = (...a) => console.error(...a);

// A position is a bitmask: bit e set = edge e drawn. closes(m, e) = boxes that drawing e completes.
const boxMask = boxEdges.map(es => es.reduce((m, e) => m | 1 << e, 0));
const M1 = edgeBoxes.map(bs => boxMask[bs[0]]), M2 = edgeBoxes.map(bs => (bs.length > 1 ? boxMask[bs[1]] : 0));
const closes = (m, e) => { const n = m | 1 << e; return ((n & M1[e]) === M1[e] ? 1 : 0) + (M2[e] && (n & M2[e]) === M2[e] ? 1 : 0); };

// V[m] = net boxes (of those still open) for the player to move, when both sides play perfectly.
let t0 = performance.now();
const V = new Int8Array(1 << E);
const value = (m, e) => { const k = closes(m, e); return k ? k + V[m | 1 << e] : -V[m | 1 << e]; };
for (let m = (1 << E) - 2; m >= 0; m--) {
  let best = -99;
  for (let e = 0; e < E; e++) if (!(m >> e & 1)) { const v = value(m, e); if (v > best) best = v; }
  V[m] = best;
}
log(`Solved every 3×3 position in ${((performance.now() - t0) / 1000).toFixed(1)} s. First player's result with perfect play: ${V[0]} (net boxes).`);
/** Every optimal move in position m, as a bitmask. */
function optimal(m) {
  let best = -99, r = 0;
  for (let e = 0; e < E; e++) if (!(m >> e & 1)) { const v = value(m, e); if (v > best) { best = v; r = 0; } if (v === best) r |= 1 << e; }
  return r;
}

// The 8 symmetries of the board, built from the edge coordinates in rules.ts.
const at = new Map();
for (let e = 0; e < E; e++) { const [x1, y1, x2, y2] = g.coords(e); at.set(`${x1},${y1},${x2},${y2}`, e); }
const edgeAt = (x1, y1, x2, y2) => at.get(x1 < x2 || y1 < y2 ? `${x1},${y1},${x2},${y2}` : `${x2},${y2},${x1},${y1}`);
const SYM = [(x, y) => [x, y], (x, y) => [3 - y, x], (x, y) => [3 - x, 3 - y], (x, y) => [y, 3 - x],
  (x, y) => [3 - x, y], (x, y) => [y, x], (x, y) => [x, 3 - y], (x, y) => [3 - y, 3 - x]]
  .map(f => Array.from({ length: E }, (_, e) => { const [a, b, c, d] = g.coords(e); return edgeAt(...f(a, b), ...f(c, d)); }));
const canon = m => { let best = m; for (const P of SYM) { let x = 0; for (let e = 0; e < E; e++) if (m >> e & 1) x |= 1 << P[e]; if (x < best) best = x; } return best; };

// One entry per canonical position with at most BOOK_LINES lines, in ascending order.
const keys = [];
(function add(from, m, n) { if (canon(m) === m) keys.push(m); if (n < BOOK_LINES) for (let e = from; e < E; e++) add(e + 1, m | 1 << e, n + 1); })(0, 0, 0);
keys.sort((a, b) => a - b);
const book = keys.map(m => { const v = optimal(m); return B64[v >> 18 & 63] + B64[v >> 12 & 63] + B64[v >> 6 & 63] + B64[v & 63]; }).join('');

if (!process.argv.includes('--check')) { console.log(book); process.exit(0); }

let failed = false;
const check = (ok, text) => { log(`${ok ? 'PASS' : 'FAIL'}  ${text}`); if (!ok) failed = true; };
const src = readFileSync(new URL('../src/lib/engine/ai-core.js', import.meta.url), 'utf8');
check(src.match(/BOOK_SRC='([^']*)'/)?.[1] === book, `the book in ai-core.js matches the solve (${keys.length} entries, ${book.length} characters)`);

const ai = createAI(), mask = d => d.reduce((m, v, e) => m | v << e, 0);
const toArray = m => Uint8Array.from({ length: E }, (_, e) => m >> e & 1);
const has = (bits, e) => (bits >> e & 1) === 1;

// Every position the book covers, rotations and mirror images included: Hard only plays optimal moves.
let positions = 0, bad = 0;
(function all(from, m, n) {
  positions++; const d = toArray(m), opt = optimal(m);
  for (let i = 0; i < 20; i++) if (!has(opt, ai.choose(g, d, 'hard'))) bad++;
  if (n < BOOK_LINES) for (let e = from; e < E; e++) all(e + 1, m | 1 << e, n + 1);
})(0, 0, 0);
check(bad === 0, `Hard plays only optimal moves in all ${positions} positions with up to ${BOOK_LINES} lines (20 tries each)`);

// All 24 first moves are equally good (each loses 3–6), so Hard should use them all.
const firsts = new Map();
for (let i = 0; i < 2400; i++) { const e = ai.choose(g, new Uint8Array(E), 'hard'); firsts.set(e, (firsts.get(e) ?? 0) + 1); }
check(firsts.size === 24, `first move on an empty board, 2400 tries: all ${firsts.size} lines used, each ${Math.min(...firsts.values())}–${Math.max(...firsts.values())} times`);

// Hard vs Hard: every move optimal, and the second player always wins 6–3.
const games = +process.argv[process.argv.indexOf('--check') + 1] || 200;
const openings = new Set(), results = new Map();
let slow = 0, worse = 0; t0 = performance.now();
for (let i = 0; i < games; i++) {
  ai.resetGame();
  const d = new Uint8Array(E), score = [0, 0], moves = []; let p = 0;
  while (moves.length < E) {
    const s = performance.now(), e = ai.choose(g, d, 'hard'); slow = Math.max(slow, performance.now() - s);
    if (!has(optimal(mask(d)), e)) worse++;
    const k = closes(mask(d), e); d[e] = 1; moves.push(e); score[p] += k; if (!k) p = 1 - p;
  }
  openings.add(moves.slice(0, 4).join(' '));
  results.set(score.join('–'), (results.get(score.join('–')) ?? 0) + 1);
}
check(worse === 0, `Hard vs Hard, ${games} games: every move was optimal`);
check(results.size === 1 && results.get('3–6') === games, `Hard vs Hard results (first–second player): ${[...results].map(([s, n]) => `${s} ×${n}`).join(', ')}`);
log(`      openings (first 4 lines): ${openings.size} different in ${games} games`);
log(`      slowest Hard move: ${slow.toFixed(0)} ms; ${((performance.now() - t0) / games).toFixed(0)} ms per game on average`);
process.exit(failed ? 1 : 0);
