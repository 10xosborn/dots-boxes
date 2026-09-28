import type { Level, Result, ScoreEntry, LbRow } from './data/types';
import { MIN_RATE_GAMES } from './data/types';

/*
 * XP = round(Base × Difficulty × Board) + Margin
 *   Base: win 60, draw 30, loss 15
 *   Difficulty: Easy ×1, Medium ×1.5, Hard ×2.5
 *   Board: 3×3 ×1, 4×4 ×1.4, 5×5 ×1.8, 6×6 ×2.2   (1 + 0.4 per size step)
 *   Margin (wins only): +2 per box you win by
 * Level L → L+1 costs 100 + 50 × (L − 1) XP.
 */
const DIFF: Record<Level, number> = { easy: 1, medium: 1.5, hard: 2.5 };
const BASE: Record<Result, number> = { win: 60, draw: 30, loss: 15 };
export const boardMult = (n: number) => +(1 + (n - 3) * 0.4).toFixed(1);
export const xpFor = (r: Result, n: number, d: Level, margin: number) =>
  Math.round(BASE[r] * DIFF[d] * boardMult(n)) + (r === 'win' ? 2 * margin : 0);

export function level(xp: number) {
  let L = 1, need = 100;
  while (xp >= need) { xp -= need; L++; need = 100 + 50 * (L - 1); }
  return { level: L, into: xp, need, pct: Math.round((100 * xp) / need) };
}

export interface Stats { games: number; wins: number; losses: number; draws: number; rate: number; cur: number; best: number; xp: number; fastest: Record<string, number> }

export function stats(entries: ScoreEntry[]): Stats {
  const list = [...entries].sort((a, b) => a.date - b.date);
  let wins = 0, losses = 0, draws = 0, cur = 0, best = 0, xp = 0;
  const fastest: Record<string, number> = {};
  for (const e of list) {
    xp += e.xp || 0;
    if (e.result === 'win') {
      wins++; cur++; best = Math.max(best, cur);
      const k = e.n + e.diff; if (!(k in fastest) || e.ms < fastest[k]) fastest[k] = e.ms;
    } else { cur = 0; if (e.result === 'loss') losses++; else draws++; }
  }
  const games = list.length;
  return { games, wins, losses, draws, rate: games ? wins / games : 0, cur, best, xp, fastest };
}

/** Summarise one player's games on one board, in the same shape the online leaderboard stores. */
export function boardRow(entries: ScoreEntry[], n: number, diff: Level, uid: string, name: string): LbRow {
  let games = 0, wins = 0, best: number | null = null;
  for (const e of entries) if (e.n === n && e.diff === diff) {
    games++; if (e.result === 'win') { wins++; if (best === null || e.ms < best) best = e.ms; }
  }
  return { uid, name, games, wins, best, rate: games >= MIN_RATE_GAMES ? wins / games : null };
}
