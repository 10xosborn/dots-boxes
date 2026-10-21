import { newGame, play, type BoardSize, type Player } from './engine/rules';

/** How many boxes the player to move has closed in this turn: 0 when their turn has just begun, otherwise each box closed
 *  since it began (a chain shows as 2, 3…). The extra-turn cue reads it. Replays the moves, so a resumed or online game
 *  shows the same cue as one played here. */
export function boxesThisTurn(size: BoardSize, first: Player, moves: number[]): number {
  const g = newGame(size, first);
  let n = 0;
  for (const e of moves) { const done = play(g, e); n = done?.length ? n + done.length : 0; }
  return n;
}
