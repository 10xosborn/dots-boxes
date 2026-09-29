/**
 * Board layout maths shared by the board renderer and the size picker, so the
 * picker only offers sizes the board can actually draw with tappable lines.
 */
import { MAX_SIDE, type BoardSize } from './engine/rules';

/** SVG layout for a board: dot spacing `sp` and padding, in viewBox units. */
export const PAD = 90;
export function layout(size: BoardSize) {
  const sp = 820 / Math.max(size.rows, size.cols);
  return { sp, W: 2 * PAD + size.cols * sp, H: 2 * PAD + size.rows * sp };
}

/** Smallest gap between dots, in screen pixels, that stays comfortable to tap. */
export const MIN_TAP_PX = 40;

/** The space the game screen gives the board (mirrors the .board-wrap CSS). */
function available() {
  const vw = typeof window === 'undefined' ? 390 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 844 : window.innerHeight;
  const appWidth = Math.min(vw, vw >= 900 ? 680 : 640);
  return { w: Math.min(appWidth - 32, 620), h: Math.max(vh - 330, 260) };
}

/** Pixel gap between neighbouring dots if this board were shown on this screen. */
export function dotGapPx(size: BoardSize) {
  const { sp, W, H } = layout(size), { w, h } = available();
  const width = Math.min(w, h * (W / H));
  return (width * sp) / W;
}

/** True when the board fits this screen with lines big enough to tap. */
export const fits = (size: BoardSize) =>
  size.rows >= 1 && size.cols >= 1 && size.rows <= MAX_SIDE && size.cols <= MAX_SIDE && dotGapPx(size) >= MIN_TAP_PX;

/** Largest square that fits, used for the hint under the custom picker. */
export function largestSquare() {
  let n = 1;
  while (n < MAX_SIDE && fits({ rows: n + 1, cols: n + 1 })) n++;
  return n;
}

/** What the player picked on a size control: a standard square, or a custom rectangle. */
export interface BoardChoice { custom: boolean; n: number; rows: number; cols: number }
export const choiceSize = (c: BoardChoice): BoardSize => (c.custom ? { rows: c.rows, cols: c.cols } : { rows: c.n, cols: c.n });
