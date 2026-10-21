// The size picker judges the phone's screen, not a page the phone has widened: `npx vitest run tests/layout`.
// Regression: ISSUE-001 — on small phones the picker offered boards whose dots end up under 40 px once Setup's steppers had widened the page
// Found by /qa on 2026-10-21
// Report: .gstack/qa-reports/run-20261021T150224Z/qa-report-127.0.0.1-2026-10-21.md
import { afterEach, describe, expect, it } from 'vitest';
import { dotGapPx, fits, gameLayout } from '../../src/lib/boardFit';

/** A browser as boardFit reads it: the layout viewport (innerWidth, innerHeight), the visual viewport (what the screen shows,
 *  and its zoom) and the theme. No body, so no safe-area insets. */
function browser(inner: [number, number], visual: [number, number, number], skin: string) {
  Object.assign(globalThis, {
    window: { innerWidth: inner[0], innerHeight: inner[1], visualViewport: { width: visual[0], height: visual[1], scale: visual[2] } },
    document: { documentElement: { dataset: { skin } } },
  });
}
afterEach(() => { delete (globalThis as Record<string, unknown>).window; delete (globalThis as Record<string, unknown>).document; });

describe('the size picker measures the screen, not a widened page', () => {
  it('a 360x640 Neon phone whose page widened to 373x664 still refuses 7x6 (its dots would be 38.3 px apart)', () => {
    browser([373, 664], [360, 640, 1], 'neon');
    expect(dotGapPx({ rows: 7, cols: 6 })).toBeCloseTo(38.3, 1);
    expect(fits({ rows: 7, cols: 6 })).toBe(false);
    expect(fits({ rows: 6, cols: 6 })).toBe(true);
  });
  it('a 320x568 Paper phone whose page widened to 335x595 refuses 5x6 (39.4 px)', () => {
    browser([335, 595], [320, 568, 1], 'paper');
    expect(dotGapPx({ rows: 5, cols: 6 })).toBeCloseTo(39.4, 1);
    expect(fits({ rows: 5, cols: 6 })).toBe(false);
    expect(fits({ rows: 5, cols: 5 })).toBe(true);
  });
  it('pinch zoom changes nothing: zoomed in twice on the same phone, 7x6 is still refused', () => {
    browser([360, 640], [180, 320, 2], 'neon');
    expect(dotGapPx({ rows: 7, cols: 6 })).toBeCloseTo(38.3, 1);
    expect(fits({ rows: 7, cols: 6 })).toBe(false);
  });
  it('the layout is judged on the screen too: a phone turned sideways stays side by side when its page widens', () => {
    expect(gameLayout(844, 390)).toBe('side');
    browser([880, 407], [844, 390, 1], 'table');
    expect(dotGapPx({ rows: 5, cols: 5 })).toBeCloseTo(60.7, 1);   // the board fills the height (370 px), as measured in the game
  });
});
