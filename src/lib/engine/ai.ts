import type { GameState } from './rules';
import { drawnMask, geometry, isLegal, legalMoves } from './rules';

export type Level = 'easy' | 'medium' | 'hard';
type Engine = ReturnType<typeof import('./ai-core.js').createAI>;

/**
 * AI client. Uses a Web Worker when available, and falls back to running
 * on the main thread (older browsers, or if the worker fails to load).
 * The fallback engine is loaded only then, so it isn't part of the page's start-up script, and it thinks for a
 * quarter of the time (about 0.2 s a move), since on the main thread its thinking holds up the page.
 */
let worker: Worker | null = null, noWorker = false;
let local: Promise<Engine> | null = null;
const loadLocal = () => (local ??= import('./ai-core.js').then(m => m.createAI({ timeScale: 0.25 })));
let seq = 0;
const pending = new Map<number, (m: number) => void>();

function getWorker(): Worker | null {
  if (worker || noWorker) return worker;
  try {
    worker = new Worker(new URL('./ai.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = ev => { const cb = pending.get(ev.data.id); if (cb) { pending.delete(ev.data.id); cb(ev.data.move); } };
    worker.onerror = () => { worker?.terminate(); worker = null; noWorker = true; for (const [, cb] of pending) cb(-1); pending.clear(); };
  } catch { worker = null; noWorker = true; }
  return worker;
}

export function resetAI() { const w = getWorker(); if (w) w.postMessage({ type: 'reset' }); else local?.then(e => e.resetGame()); }

/** Hard thinks while the player does: call when it is the player's turn after the AI's move. Worker only (on the main
 *  thread it would hold up the page); the next move request stops it. */
export function ponderAI(st: GameState) { const w = getWorker(); if (w) w.postMessage({ type: 'ponder', rows: st.rows, cols: st.cols, drawn: drawnMask(st) }); }

/** Ask the AI for a move. Always resolves to a legal edge. */
export async function chooseMove(st: GameState, level: Level): Promise<number> {
  const w = getWorker();
  let move: number;
  if (w) {
    const id = ++seq;
    move = await new Promise<number>(res => { pending.set(id, res); w.postMessage({ id, type: 'choose', rows: st.rows, cols: st.cols, drawn: drawnMask(st), level }); });
  } else {
    move = (await loadLocal()).choose(geometry(st.rows, st.cols), drawnMask(st), level);
  }
  if (!isLegal(st, move)) { const free = legalMoves(st); move = free[Math.floor(Math.random() * free.length)]; }
  return move;
}
