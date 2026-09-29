/**
 * Pure Dots & Boxes rules. No DOM, no framework: safe to unit-test and to run in a worker.
 * A board is `rows × cols` boxes (a 3×3 board has a 4×4 grid of dots).
 * Edge indexing: horizontal edges first (row r∈0..rows, col c∈0..cols-1 → r*cols+c),
 * then vertical edges (row r∈0..rows-1, col c∈0..cols → H + r*(cols+1)+c).
 */
export type Player = 0 | 1;

/** Largest side allowed anywhere (also enforced by the Firebase rules). */
export const MAX_SIDE = 12;
/** The four standard square sizes that have leaderboards. */
export const STANDARD_SIZES = [3, 4, 5, 6];

export interface BoardSize { rows: number; cols: number }
export const sizeLabel = (s: BoardSize) => `${s.rows}×${s.cols}`;
export const isStandard = (s: BoardSize) => s.rows === s.cols && STANDARD_SIZES.includes(s.rows);
export const validSize = (s: BoardSize) =>
  Number.isInteger(s.rows) && Number.isInteger(s.cols) && s.rows >= 1 && s.cols >= 1 && s.rows <= MAX_SIDE && s.cols <= MAX_SIDE;

export interface Geometry {
  rows: number; cols: number; H: number; E: number; NB: number;
  boxEdges: number[][];      // box → its 4 edges [top, bottom, left, right]
  edgeBoxes: number[][];     // edge → the 1 or 2 boxes it borders
  coords: (e: number) => [number, number, number, number]; // x1,y1,x2,y2 in dot units
}

export interface GameState {
  rows: number; cols: number; g: Geometry;
  lines: Int8Array;   // -1 = empty, else the player who drew it
  owner: Int8Array;   // -1 = open, else the player who closed it
  score: [number, number];
  turn: Player; first: Player;
  moves: number[]; over: boolean;
}

const cache = new Map<string, Geometry>();

export function geometry(rows: number, cols: number): Geometry {
  const key = `${rows}x${cols}`, hit = cache.get(key); if (hit) return hit;
  const H = (rows + 1) * cols, E = H + rows * (cols + 1), NB = rows * cols;
  const boxEdges: number[][] = [], edgeBoxes: number[][] = Array.from({ length: E }, () => []);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const b = r * cols + c, l = H + r * (cols + 1) + c;
    boxEdges[b] = [r * cols + c, (r + 1) * cols + c, l, l + 1];
    for (const e of boxEdges[b]) edgeBoxes[e].push(b);
  }
  const coords = (e: number): [number, number, number, number] => {
    if (e < H) { const r = Math.floor(e / cols), c = e % cols; return [c, r, c + 1, r]; }
    const k = e - H, r = Math.floor(k / (cols + 1)), c = k % (cols + 1); return [c, r, c, r + 1];
  };
  const g = { rows, cols, H, E, NB, boxEdges, edgeBoxes, coords };
  cache.set(key, g); return g;
}

export function newGame(size: BoardSize, first: Player = 0): GameState {
  const g = geometry(size.rows, size.cols);
  return { rows: size.rows, cols: size.cols, g, lines: new Int8Array(g.E).fill(-1), owner: new Int8Array(g.NB).fill(-1),
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
export function replay(size: BoardSize, first: Player, moves: number[]): GameState {
  const st = newGame(size, first);
  for (const e of moves) if (play(st, e) === null) break;
  return st;
}

export const legalMoves = (st: GameState) => { const r: number[] = []; for (let e = 0; e < st.g.E; e++) if (st.lines[e] < 0) r.push(e); return r; };
export const drawnMask = (st: GameState) => Uint8Array.from(st.lines, v => (v >= 0 ? 1 : 0));
/** null while playing, -1 for a draw, else the winning player. */
export const winner = (st: GameState): Player | -1 | null =>
  !st.over ? null : st.score[0] === st.score[1] ? -1 : st.score[0] > st.score[1] ? 0 : 1;
