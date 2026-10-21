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
  /** Rooms made since server-checked turns: v 2, the player to move, the number of moves and the lines drawn
   *  (edge → the seat that drew it), which the database rules check every move against. Older rooms have none. */
  v?: number; turn?: Player; count?: number; drawn?: Record<string, Player>;
  online?: Record<string, boolean>;
  dbg?: Record<number, MoveTiming | undefined>;
}

/** ?debug=net only: when move n was sent and confirmed (by its mover) and heard and shown (by the other player),
 *  in server time (ms), and the mover's own screen (o). */
export interface MoveTiming { by?: Player; s?: number; c?: number; o?: number; h?: number; r?: number }

/** Board size of a room, including rooms made before rectangular boards existed. */
export const roomSize = (r: Room): BoardSize => ({ rows: r.rows ?? r.n ?? 3, cols: r.cols ?? r.n ?? 3 });
