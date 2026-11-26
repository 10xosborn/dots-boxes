// Tally marks in gates of five, drawn as Paper's pencil strokes (four leaning a little, the fifth across them), a gate every
// 31 px and, when they wrap, a row every 30 px. Paper's score sheet draws them in one row; its results scorecard wraps them.
const STROKES = [[2.6, 3.5], [9.6, 10.3], [14.6, 15.5], [21.6, 22.3]];

/** The path of mark `i` (0-based), `perRow` gates to a row. */
export const mark = (i: number, perRow = Infinity) => {
  const gate = Math.floor(i / 5), k = i % 5, g = (gate % perRow) * 31, y = Math.floor(gate / perRow) * 30;
  return k < 4 ? `M${g + STROKES[k][0]} ${y + 3}L${g + STROKES[k][1]} ${y + 23}` : `M${g} ${y + 19}L${g + 25} ${y + 6}`;
};
export const marks = (n: number, perRow?: number) => Array.from({ length: n }, (_, i) => mark(i, perRow)).join('');
/** The width of `n` marks in one row: up to the last stroke drawn. */
export const tallyW = (n: number) => { if (!n) return 0; const i = n - 1, g = Math.floor(i / 5) * 31, k = i % 5; return (k < 4 ? g + STROKES[k][1] : g + 25) + 2; };
