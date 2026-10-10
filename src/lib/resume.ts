/**
 * The game in progress against the AI or on one device, saved after every move so a reload,
 * a closed tab or a restarted phone doesn't lose it. Stored in localStorage under `dnb:active`.
 * A sessionStorage flag remembers which game this tab was showing, so a reload reopens it at
 * once; after a browser restart, Home offers "Continue your game" instead.
 */
import { kv } from './data/local';
import { validSize, type Player } from './engine/rules';
import { choiceSize, type BoardChoice } from './boardFit';
import type { Level } from './engine/ai';

export interface ActiveGame {
  v: 1;
  /** Also the ScoreEntry id, so a resumed game can never be saved twice. */
  id: string;
  mode: 'ai' | 'pvp';
  board: BoardChoice; diff: Level; p2: string;
  first: Player; moves: number[];
  /** Time played so far. The clock pauses while the app is closed. */
  ms: number;
  savedAt: number;
}

const KEY = 'dnb:active', TAB = 'dnb:inGame';
const tab = {
  get() { try { return sessionStorage.getItem(TAB); } catch { return null; } },
  set(id: string | null) { try { if (id) sessionStorage.setItem(TAB, id); else sessionStorage.removeItem(TAB); } catch {} },
};

export function saveActive(g: ActiveGame) { kv.set(KEY, JSON.stringify(g)); tab.set(g.id); }

/** The saved game, if there is a valid one. */
export function loadActive(): ActiveGame | null {
  const g = kv.json<ActiveGame | null>(KEY, null);
  const ok = !!g && g.v === 1 && typeof g.id === 'string' && (g.mode === 'ai' || g.mode === 'pvp')
    && !!g.board && validSize(choiceSize(g.board)) && (g.first === 0 || g.first === 1)
    && Array.isArray(g.moves) && g.moves.every(Number.isInteger) && typeof g.ms === 'number';
  return ok ? g : null;
}

export function clearActive() { kv.set(KEY, ''); tab.set(null); }

/** This tab no longer shows the game (left for another screen), but it stays saved for "Continue". */
export function leaveActive() { tab.set(null); }

/** True when this tab was showing the saved game before a reload. */
export const reloadedDuring = (g: ActiveGame) => tab.get() === g.id;
