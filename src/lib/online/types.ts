import type { BoardSize, Player } from '../engine/rules';

/*
 * Kept free of Firebase imports so screens can use these without loading the
 * Realtime Database SDK until online play actually starts.
 */
export interface Room {
  host: string; guest?: string | null;
  names: { host: string; guest?: string };
  rows?: number; cols?: number; n?: number;
  first: Player; game: number; moves?: number[];
  online?: Record<string, boolean>;
}

/** Board size of a room, including rooms made before rectangular boards existed. */
export const roomSize = (r: Room): BoardSize => ({ rows: r.rows ?? r.n ?? 3, cols: r.cols ?? r.n ?? 3 });
