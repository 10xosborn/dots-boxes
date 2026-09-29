import type { GameState } from './rules';
import { drawnMask, geometry, isLegal, legalMoves } from './rules';
import { createAI } from './ai-core.js';

export type Level = 'easy' | 'medium' | 'hard';

/**
 * AI client. Uses a Web Worker when available, and falls back to running
 * on the main thread (older browsers, or if the worker fails to load).
 */
let worker: Worker | null = null;
let local: ReturnType<typeof createAI> | null = null;
let seq = 0;
const pending = new Map<number, (m: number) => void>();

function getWorker(): Worker | null {
  if (worker || local) return worker;
  try {
    worker = new Worker(new URL('./ai.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = ev => { const cb = pending.get(ev.data.id); if (cb) { pending.delete(ev.data.id); cb(ev.data.move); } };
    worker.onerror = () => { worker?.terminate(); worker = null; local = createAI(); for (const [, cb] of pending) cb(-1); pending.clear(); };
  } catch { worker = null; local = createAI(); }
  return worker;
}

export function resetAI() { const w = getWorker(); if (w) w.postMessage({ type: 'reset' }); else local?.resetGame(); }

/** Ask the AI for a move. Always resolves to a legal edge. */
export async function chooseMove(st: GameState, level: Level): Promise<number> {
  const w = getWorker();
  let move: number;
  if (w) {
    const id = ++seq;
    move = await new Promise<number>(res => { pending.set(id, res); w.postMessage({ id, type: 'choose', rows: st.rows, cols: st.cols, drawn: drawnMask(st), level }); });
  } else {
    move = (local ??= createAI()).choose(geometry(st.rows, st.cols), drawnMask(st), level);
  }
  if (!isLegal(st, move)) { const free = legalMoves(st); move = free[Math.floor(Math.random() * free.length)]; }
  return move;
}
