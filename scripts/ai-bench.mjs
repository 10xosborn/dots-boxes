// Headless self-play benchmark for the AI levels: npm run ai:bench [-- options]
//   --sizes 3,4,5,6                 square board sizes (or RxC, e.g. 4x6)
//   --games 100                     games per pairing per size; who starts alternates
//   --pairs hard:medium,medium:easy pairings A:B; the table reports A's results. A level is easy, medium or hard
//                                   (this version) or old-easy, old-medium, old-hard (the baseline below)
//   --baseline 2f770e0              git revision whose ai-core.js plays the old-* levels (default: the version that
//                                   was live before the October 2026 AI work)
//   --slow 4                        play as a device 4 times slower would: every engine gets a quarter of its
//                                   thinking time (a mid-range Android phone is roughly 3-5 times slower than a PC)
//   --ponder 3000                   the other player takes this long over each move (on the device, so a quarter of
//                                   it at --slow 4), and Hard (this version) thinks meanwhile, as the game's worker does
// Each side gets its own engine, like the game's worker. Think times are wall-clock per move on this computer.
// Needs Node 22.18 or newer (it runs the TypeScript import of rules.ts directly) and git for the baseline.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createAI } from '../src/lib/engine/ai-core.js';
import { newGame, play, drawnMask, geometry } from '../src/lib/engine/rules.ts';

const arg = (name, def) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : def; };
const sizes = arg('sizes', '3,4,5,6').split(',').map(s => { const [r, c] = s.split('x').map(Number); return { rows: r, cols: c || r }; });
const games = +arg('games', '100');
const pairs = arg('pairs', 'hard:medium,hard:old-hard,medium:easy,medium:old-medium,old-hard:old-medium').split(',').map(p => p.split(':'));
const baseline = arg('baseline', '2f770e0');
// --slow N: play as if on a device N times slower than this computer (each engine gets 1/N of its thinking time).
const slow = +arg('slow', '1');
const ponderMs = +arg('ponder', '0');

let oldCreate = null;
if (pairs.flat().some(l => l.startsWith('old-'))) {
  let src = execFileSync('git', ['show', `${baseline}:src/lib/engine/ai-core.js`], { encoding: 'utf8', maxBuffer: 1 << 24 });
  if (slow !== 1) src = src.replace('const budgetMs=()=>ROWS===3&&COLS===3?1500:NB<=9?500:300;', `const budgetMs=()=>(ROWS===3&&COLS===3?1500:NB<=9?500:300)/${slow};`);
  const file = join(mkdtempSync(join(tmpdir(), 'ai-bench-')), 'ai-core-baseline.mjs');
  writeFileSync(file, src);
  ({ createAI: oldCreate } = await import(pathToFileURL(file).href));
}
const engine = level => {
  const old = level.startsWith('old-');
  // Baselines that take a timeScale get it too (2f770e0 has none: its budget is rewritten above).
  return { name: level, level: old ? level.slice(4) : level, ai: (old ? oldCreate : createAI)({ timeScale: 1 / slow }), times: [] };
};

/** One game; returns A's net result (+ win, 0 draw, - loss) and A's margin. */
function game(size, A, B, aFirst) {
  const st = newGame(size, 0), g = geometry(size.rows, size.cols), seats = aFirst ? [A, B] : [B, A];
  A.ai.resetGame(); B.ai.resetGame();
  while (!st.over) {
    const s = seats[st.turn], o = seats[1 - st.turn], d = drawnMask(st);
    if (ponderMs && o.name === 'hard') { const until = performance.now() + ponderMs / slow; while (performance.now() < until && o.ai.ponder(g, d, 40 / slow)); }
    const t = performance.now();
    const e = s.ai.choose(g, d, s.level);
    s.times.push(performance.now() - t);
    if (play(st, e) === null) throw new Error(`${s.name} played an illegal move (${e}) on ${size.rows}x${size.cols}`);
  }
  const a = aFirst ? 0 : 1;
  return st.score[a] - st.score[1 - a];
}

const pad = (s, n) => String(s).padEnd(n), num = (v, n) => String(v).padStart(n);
const fmt = ms => (ms < 10 ? ms.toFixed(1) : Math.round(ms).toString());
console.log(`${games} games per pairing and size, alternating who starts; baseline for old-* levels: ${baseline}${slow !== 1 ? `; thinking time / ${slow} (as a device ${slow}x slower)` : ''}${ponderMs ? `; Hard thinks during the other player's ${ponderMs} ms a move` : ''}\n`);
console.log(`${pad('A vs B', 22)}${pad('board', 7)}${num('A wins', 7)}${num('draws', 7)}${num('losses', 7)}${num('A win %', 9)}${num('avg margin', 11)}   think ms A avg / max   B avg / max`);
for (const [la, lb] of pairs) for (const size of sizes) {
  const A = engine(la), B = engine(lb);
  let w = 0, d = 0, l = 0, margin = 0;
  for (let i = 0; i < games; i++) { const r = game(size, A, B, i % 2 === 0); margin += r; if (r > 0) w++; else if (r < 0) l++; else d++; }
  const avg = t => t.reduce((x, y) => x + y, 0) / Math.max(1, t.length), max = t => Math.max(0, ...t);
  console.log(`${pad(`${la} vs ${lb}`, 22)}${pad(`${size.rows}x${size.cols}`, 7)}${num(w, 7)}${num(d, 7)}${num(l, 7)}${num((100 * w / games).toFixed(1), 9)}${num((margin / games).toFixed(2), 11)}   ${num(fmt(avg(A.times)), 7)} / ${pad(fmt(max(A.times)), 7)}${num(fmt(avg(B.times)), 7)} / ${fmt(max(B.times))}`);
}
