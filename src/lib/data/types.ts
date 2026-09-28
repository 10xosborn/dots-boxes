import type { Level } from '../engine/ai';
export type { Level };
export type Result = 'win' | 'loss' | 'draw';
export type LbView = 'fast' | 'wins' | 'rate';

/** One finished game against the AI. */
export interface ScoreEntry {
  id: string; uid: string; name: string;
  n: number; diff: Level; result: Result;
  ms: number; mine: number; theirs: number; xp: number; date: number;
  first: 0 | 1; moves: number[];   // kept so a server can re-check the game later
}
export interface Profile { uid: string; name: string }
export interface LbRow { uid: string; name: string; games: number; wins: number; best: number | null; rate: number | null }
export interface Leaderboard { rows: LbRow[]; me: { rank: number; row: LbRow } | null }

/**
 * Storage adapter. The UI only talks to this interface, so the backend can be
 * swapped (offline ↔ Firebase ↔ anything else) without touching screens.
 */
export interface DataAdapter {
  kind: 'local' | 'firebase';
  /** Human-readable description for the settings screen. */
  label: string;
  init(): Promise<Profile>;
  setName(name: string): Promise<Profile>;
  /** The current player's own games. */
  getScores(): Promise<ScoreEntry[]>;
  saveScore(entry: ScoreEntry): Promise<void>;
  getLeaderboard(n: number, diff: Level, view: LbView): Promise<Leaderboard>;
  resetMine(): Promise<void>;
}

export const MIN_RATE_GAMES = 5;
export const LEVELS: Level[] = ['easy', 'medium', 'hard'];
export const SIZES = [3, 4, 5, 6];
