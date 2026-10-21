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

/** How the game screen is laid out (app.css, "game layout"): a short, wide screen (a phone turned sideways) puts the board
 *  beside everything else ('side'); Paper opens its two-page spread from 960 px wide ('spread'); otherwise one column. */
export type GameLayout = 'column' | 'side' | 'spread';
export function gameLayout(vw: number, vh: number, skin?: string): GameLayout {
  if (vw > vh && vh <= 540) return 'side';
  return skin === 'paper' && vw >= 960 ? 'spread' : 'column';
}

/** The safe areas (a notch, a home bar): env() has no script API, so a hidden element padded with them is read. */
let probe: HTMLElement | null = null;
function insets() {
  if (typeof document === 'undefined' || !document.body) return { t: 0, r: 0, b: 0, l: 0 };
  if (!probe) {
    probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
    document.body.append(probe);
  }
  const s = getComputedStyle(probe), px = (v: string) => parseFloat(v) || 0;
  return { t: px(s.paddingTop), r: px(s.paddingRight), b: px(s.paddingBottom), l: px(s.paddingLeft) };
}

/** The screen's size in CSS pixels. innerWidth and innerHeight follow the layout viewport, which a phone widens when a page is
 *  too wide for it (Setup's steppers on a 320-360 px phone); the game screen never is, so it gets only what the screen shows:
 *  the visual viewport, scaled back to no zoom (pinch zoom changes nothing). */
function screenSize() {
  if (typeof window === 'undefined') return { vw: 390, vh: 844 };
  const v = window.visualViewport;
  if (!v) return { vw: window.innerWidth, vh: window.innerHeight };
  return { vw: Math.min(window.innerWidth, Math.round(v.width * v.scale)), vh: Math.min(window.innerHeight, Math.round(v.height * v.scale)) };
}

/** The largest box the game screen gives the board, in CSS pixels. It mirrors app.css's game layout, number for number: the
 *  edges of the page, the top bar, the HUD and its chips (or Paper's score sheet), the buttons under the board. */
function available() {
  const { vw, vh } = screenSize();
  const skin = typeof document === 'undefined' ? 'table' : document.documentElement.dataset.skin;
  const paper = skin === 'paper', i = insets(), sides = Math.max(16, i.l) + Math.max(16, i.r);
  switch (gameLayout(vw, vh, skin)) {
    case 'side': {
      // The board fills the height; the rest keeps 300 px beside it, 20 px away (Paper: a 320 px page, and the board page
      // 14 px round the board).
      return { w: Math.min(vw - sides - (paper ? 348 : 320), 600), h: vh - Math.max(10, i.t) - Math.max(10, i.b) - (paper ? 28 : 0) };
    }
    case 'spread': {
      // The desk round the spread (28 px above and below, 20 px at the sides), the 360 px score page, 28 px round the board.
      const s = Math.min(600, vh - Math.max(28, i.t) - Math.max(28, i.b) - 56, vw - Math.max(20, i.l) - Math.max(20, i.r) - 416);
      return { w: s, h: s };
    }
    default: {
      // A short screen (760 px tall or less) takes a little less space round the edges.
      const short = vh <= 760;
      const top = Math.max(14, i.t) + 48 + (short ? 12 : 18) + (paper ? 162 + (short ? 10 : 14) : 113 + (short ? 54 : 58));
      const below = (short ? 56 : 58) + (short ? 16 : 28) + i.b;
      return { w: Math.min(Math.min(vw, vw >= 1024 ? 712 : 632) - sides, 600), h: vh - top - below };
    }
  }
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
