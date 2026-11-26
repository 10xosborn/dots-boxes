# Charters: QA of the owner's 2026-10-19 colour changes (design/06-owner-colours, f793df3)

Target: production build of the branch on http://127.0.0.1:4173/ (scratchpad `serve-one.mjs`), main's build (288ab3a) on :4177
beside it for comparisons (`serve-two.mjs`). Firebase blocked by hostname in every browser context (nothing reaches live
Firebase); Google Fonts allowed. Driver: gstack's playwright-core with its headless Chromium, from scratchpad scripts (Aside is
macOS-only; gstack's browse daemon restarts on Windows). Writes: this report directory and the scratchpad only; source changes
only to fix a confirmed issue. Mixed run: browser (Full, 900 s guard) and functional (repository commands).

Diff: src/app.css (Tabletop at night, Paper at night and Dark Neon token blocks; their page and board surfaces; an on-page
text rule), src/lib/theme/themes.ts (bars, swatches), index.html (pre-paint colours), two texture tiles removed, DESIGN.md and
the UI spec. Pages affected: every screen in the three changed modes; the theme picker in all modes.

## Browser

| # | Contract | Risk | Entry and probe | Exit condition |
|---|---|---|---|---|
| B1 | Drags, taps, the dot-tap rule, rings and sounds work in every mode (mouse in all six, touch in the changed ones) | the surface changes (rim pseudo-element, multiply layers) could catch pointer events or hide rings | `drag-test-themes.mjs` | all checks pass |
| B2 | Switching through all six modes leaves no colours behind; reload keeps the mode; the browser bar matches each page | stale bar or token fall-back | `theme-switch.mjs` | 19/19 |
| B3 | Dots and lines at least 3:1 from pixels in the changed modes; initials legible | Sienna felt and sheet; magenta-red on the glass | `board-contrast.mjs table-dark,paper-dark,neon-dark` | every value at or above its bar |
| B4 | Text at least 4.5:1 (large 3:1) from pixels on 7 screens per changed mode, phone and desktop | text straight on the textured Sienna page | `texture-text.mjs` with MODES=table-dark,paper-dark,neon-dark | no visible text below its bar |
| B5 | Violet only in Dark Neon; no pink in Dark Neon | the owner's 2026-10-15 rule and today's request | `four-modes-shots.mjs` then `violet-check.mjs` and `pink-check.mjs` | violet 0 outside Dark Neon (bar the picker's own Dark Neon preview); pink below 0.05% |
| B6 | Tabletop and Paper by day and White Neon pixel-identical to main | the brief: leave other modes untouched | `day-diff.mjs ... table,paper,neon` under `serve-two.mjs` | 0 pixels apart from the clock |
| B7 | Each mode downloads only its own textures | a hidden pseudo-element can still fetch its background | `texture-requests.mjs` (request log) | 6/6 |
| B8 | Game integrity | regression in play | `integrity-r1a.mjs all` | 35/35 |
| B9 | Local games' resume | regression in resume | `qa-r1a.mjs` | 31/31 |

## Functional

| # | Contract | Command | Exit condition |
|---|---|---|---|
| F1 | Type check | `npm run check` | 0 errors, 0 warnings |
| F2 | Production build | `npm run build` | exit 0 |
| F3 | Bars, previews and pre-paint colours equal each mode's page | `npx vitest run tests/theme` | 7/7 |
| F4 | Each restyled mode sets every colour token itself | `node token-audit2.mjs <repo>` | none missing |
