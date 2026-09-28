/**
 * Pure Dots & Boxes rules. No DOM, no framework: safe to unit-test and to run in a worker.
 * Board size n = boxes per side (3×3 has a 4×4 grid of dots).
 * Edge indexing: horizontal edges first (row r∈0..n, col c∈0..n-1 → r*n+c),
 * then vertical edges (row r∈0..n-1, col c∈0..n → H + r*(n+1)+c).
 */
export type Player = 0 | 1;

export interface Geometry {
  n: number; H: number; E: number; NB: number;
  boxEdges: number[][];      // box → its 4 edges [top, bottom, left, right]
  edgeBoxes: number[][];     // edge → the 1 or 2 boxes it borders
  coords: (e: number) => [number, number, number, number]; // x1,y1,x2,y2 in dot units
}

export interface GameState {
  n: number; g: Geometry;
  lines: Int8Array;   // -1 = empty, else the player who drew it
  owner: Int8Array;   // -1 = open, else the player who closed it
  score: [number, number];
  turn: Player; first: Player;
  moves: number[]; over: boolean;
}

const cache = new Map<number, Geometry>();

export function geometry(n: number): Geometry {
  const hit = cache.get(n); if (hit) return hit;
  const H = (n + 1) * n, E = 2 * n * (n + 1), NB = n * n;
  const boxEdges: number[][] = [], edgeBoxes: number[][] = Array.from({ length: E }, () => []);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const b = r * n + c, l = H + r * (n + 1) + c;
    boxEdges[b] = [r * n + c, (r + 1) * n + c, l, l + 1];
    for (const e of boxEdges[b]) edgeBoxes[e].push(b);
  }
  const coords = (e: number): [number, number, number, number] => {
    if (e < H) { const r = Math.floor(e / n), c = e % n; return [c, r, c + 1, r]; }
    const k = e - H, r = Math.floor(k / (n + 1)), c = k % (n + 1); return [c, r, c, r + 1];
  };
  const g = { n, H, E, NB, boxEdges, edgeBoxes, coords };
  cache.set(n, g); return g;
}

export function newGame(n: number, first: Player = 0): GameState {
  const g = geometry(n);
  return { n, g, lines: new Int8Array(g.E).fill(-1), owner: new Int8Array(g.NB).fill(-1),
    score: [0, 0], turn: first, first, moves: [], over: false };
}

export const isLegal = (st: GameState, e: number) =>
  !st.over && Number.isInteger(e) && e >= 0 && e < st.g.E && st.lines[e] < 0;

/**
 * Draw edge e for the player to move. Returns the boxes it completed, or null if illegal.
 * Completing at least one box keeps the turn; otherwise the turn passes.
 */
export function play(st: GameState, e: number): number[] | null {
  if (!isLegal(st, e)) return null;
  const p = st.turn, g = st.g, done: number[] = [];
  st.lines[e] = p; st.moves.push(e);
  for (const b of g.edgeBoxes[e])
    if (st.owner[b] < 0 && g.boxEdges[b].every(x => st.lines[x] >= 0)) { st.owner[b] = p; done.push(b); }
  st.score[p] += done.length;
  if (st.score[0] + st.score[1] === g.NB) st.over = true;
  else if (!done.length) st.turn = (1 - p) as Player;
  return done;
}

/** Rebuild a game from its move list (used for online sync and replays). */
export function replay(n: number, first: Player, moves: number[]): GameState {
  const st = newGame(n, first);
  for (const e of moves) if (play(st, e) === null) break;
  return st;
}

export const legalMoves = (st: GameState) => { const r: number[] = []; for (let e = 0; e < st.g.E; e++) if (st.lines[e] < 0) r.push(e); return r; };
export const drawnMask = (st: GameState) => Uint8Array.from(st.lines, v => (v >= 0 ? 1 : 0));
/** null while playing, -1 for a draw, else the winning player. */
export const winner = (st: GameState): Player | -1 | null =>
  !st.over ? null : st.score[0] === st.score[1] ? -1 : st.score[0] > st.score[1] ? 0 : 1;
