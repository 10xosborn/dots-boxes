// Each theme mode's browser-bar colour and picker preview match its own page colour in app.css, in themes.ts and in
// index.html's pre-paint script: `npx vitest run tests/theme`.
// Regression: ISSUE-001 — Dark Neon's browser bar kept #05070D after its page became #050608
// Found by /qa on 2026-10-15
// Report: .gstack/qa-reports/run-20261015T101536Z/qa-report-127.0.0.1-2026-10-15.md
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SKINS, type Mode, type Skin } from '../../src/lib/theme/themes';

const css = readFileSync('src/app.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const html = readFileSync('index.html', 'utf8');
/** The selector of the block that sets each mode's own colours. */
const BLOCK: Record<Skin, Record<Mode, string>> = {
  table: { light: ':root, [data-skin="table"]', dark: '[data-skin="table"][data-theme="dark"]' },
  neon: { light: '[data-skin="neon"][data-theme="light"]', dark: '[data-skin="neon"][data-theme="dark"]' },
  paper: { light: '[data-skin="paper"]', dark: '[data-skin="paper"][data-theme="dark"]' },
};
const page = (skin: Skin, mode: Mode) => {
  const body = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(m => m[1].trim() === BLOCK[skin][mode])?.[2] ?? '';
  return body.match(/--page:\s*(#[0-9A-Fa-f]{6})/)?.[1].toUpperCase();
};
/** index.html's inline map: {table:['#light','#dark'], ...}. */
const prePaint = Object.fromEntries([...html.matchAll(/(table|neon|paper):\['(#[0-9A-Fa-f]{6})','(#[0-9A-Fa-f]{6})'\]/g)].map(m => [m[1], { light: m[2].toUpperCase(), dark: m[3].toUpperCase() }]));

describe('each mode paints the browser bar and its preview in its own page colour', () => {
  for (const s of SKINS) for (const mode of ['light', 'dark'] as Mode[]) {
    it(`${s.id} ${mode}`, () => {
      const own = page(s.id, mode);
      expect(own, 'the mode sets --page in its own block').toMatch(/^#[0-9A-F]{6}$/);
      expect(s.bar[mode].toUpperCase(), 'themes.ts bar').toBe(own);
      expect(s.swatch[mode][0].toUpperCase(), 'themes.ts picker preview page').toBe(own);
      expect(prePaint[s.id]?.[mode], 'index.html pre-paint map').toBe(own);
    });
  }
  it('the static theme-color meta is the default mode, Tabletop at night', () => {
    expect(html.match(/<meta name="theme-color" content="(#[0-9A-Fa-f]{6})"/)?.[1].toUpperCase()).toBe(page('table', 'dark'));
  });
});
