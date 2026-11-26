# QA Report: Grid Rivals, the owner's dark palettes, gold buttons with depth, sharper materials, Neon's aurora and glass

| Field | Value |
|-------|-------|
| **Date** | 2026-10-13 |
| **URL** | http://127.0.0.1:4173/ (production build `index-Cip7Shun.js`, `index-BBwpoLpI.css`, Firebase blocked) |
| **Branch** | design/03-dark-palettes |
| **Commit** | b32f6a9 (code at aaf519c; b32f6a9 is docs), base main ba0e9a0 |
| **PR** | not opened yet |
| **Tier** | Standard; browser Full, diff-aware |
| **Scope** | `src/app.css`, `src/assets/textures/*`, `src/App.svelte` (the aurora), `src/screens/Home.svelte`, `src/components/SizePicker.svelte`, `ThemeChoices.svelte`, `src/lib/theme/themes.ts`, `index.html`: every theme's night palette, button depth in all six modes, Tabletop's per-player lines, the new texture tiles, Neon's aurora and frosted glass, the picker previews and the browser bar |
| **Probe budget / guarded command time** | 900 s / about 610 s over 12 probes, none timed out; stopped with 40 s left, before C11's resume suite |
| **Pages visited** | Home (with the offline banner and Continue card), Setup (with Custom), the game (4x4, 3x3, 5x5, 7x7, 12x12, 1x1, 1x12, 2x7), results, Leaderboard, My stats, Settings, Online, the theme sheet; six modes; phone and desktop; every viewport in C9 |
| **Screenshots** | 277 (in `screenshots/`) |
| **Framework** | Svelte 5 SPA (Vite) |
| **Driver** | gstack's playwright-core with its headless Chromium: real mouse at 1280x800, touch at 390x844 (Aside is macOS-only); C10 in Brave 155 headless with a throwaway profile |
| **Charters** | [charters.md](charters.md): C1-C11 |

## Health Score: 99/100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors in every suite) |
| Links | not scored (no links) |
| Visual | 100 (six modes, every screen, odd boards, viewports) |
| Functional | 100 |
| UX | 100 |
| Performance | not scored (separate /benchmark) |
| Content | 100 |
| Accessibility | 97 (ISSUE-001, low) |

Provisional: no real phone or screen reader; online play not exercised; C11's local-resume suite not run in this window.

## Evidence verdict: inconclusive (open: no evidence rows)

Final for this report root: a browser-only run produces no evidence rows. Results are in the probe outputs and checkpoints:

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json) · [checkpoint 005](exploration-005.json) · [checkpoint 006](exploration-006.json) · [checkpoint 007](exploration-007.json) · [checkpoint 008](exploration-008.json) · [checkpoint 009](exploration-009.json) · [checkpoint 010](exploration-010.json) · [checkpoint 011](exploration-011.json) · [checkpoint 012](exploration-012.json)

## Contracts

| # | Contract | Probe and result |
|---|---|---|
| C1 | Neon's aurora: three lights behind everything (z-index -1, no pointer events), drifting with Animations on (three running animations, time advancing 783-800 ms over 800 ms); still with Animations off and for a reduced-motion visitor; the button under the lights gets the tap; the board is frosted glass (`blur(18px) saturate(1.5)`, background alpha 0.42 at night and 0.62 by day), the cards frosted at night (`blur(14px)`) and solid by day; no aurora and no glass in Tabletop or Paper | 001 ([output](probe-001.txt), [full](probe-001-full.txt)): 19/19 |
| C2 | Button depth in six modes: the main action is the button colour under a sheen (gold #F2B84B at night); plain buttons, theme button, level chip, steppers and chosen options carry the sheen; switches are recessed tracks with raised knobs; hover deepens by day (Tabletop, Paper), brightens at night, glows in Neon by day; labels from pixels (5th percentile), main / plain, at rest then hover: Tabletop day 3.28 / 13.85, 4.22 / 11.01 (bar 3 for the 19 px bold main label); night 8.79 / 9.67, 9.23 / 7.65; Neon day 5.75 / 15.44, 5.75 / 15.44; night 8.79 / 7.94, 9.33 / 6.35; Paper day 5.97 / 12.72, 7.32 / 10.2; night 9 / 11.16, 9.56 / 8.73 | 002 ([output](probe-002.txt), [full](probe-002-full.txt)): 64/64; crops in `screenshots/buttons/` |
| C5 | Text over its real background, 7 screens x six modes x phone and desktop, 151 lines each: worst Tabletop day 3.19:1 (bar 3, "Play again" 19 px bold), 4.71:1 ("&", bar 4.5); Tabletop night 7:1; Neon day 4.89:1; Neon night 4.56:1 (the tagline over the aurora); Paper day 5.76:1; Paper night 3.65:1 (bar 3, the 22 px brand) | 003 ([output](probe-003.txt), [full](probe-003-full.txt)): 13/13 |
| C3 | Theme switching, the picker (new swatches with each player's lines), persistence, no flash on reload, keyboard, Esc, the browser bar (Deep Plum at night), live contrast | 004 ([output](probe-004.txt)): 37/37 |
| C6 | Board structure and materials on odd shapes, the keyboard cursor's ring 3:1 from pixels (Neon's glass boards measured from pixels only: 5.4:1 at night, 5.21:1 by day), rims, opacity, cores, confetti, ids | 005 ([output](probe-005.txt)): 85/85 |
| C7 | The elastic band and the landing rings in the mover's line colour, six modes, Animations off, touch | 006 ([output](probe-006.txt)): 75/75 |
| C10 | C1 in Brave 155: aurora, glass, still with Animations off and reduced motion | 007 ([output](probe-007.txt), [full](probe-007-full.txt)): 19/19 |
| C4 | Every other screen in six modes, phone and desktop: theme applied, no sideways scroll, fonts load, no console errors | 008 ([output](probe-008.txt)): 108/108 |
| C9 | Viewports and rotation, the four colour-vision emulations, reduced motion and the Animations switch | 009 ([output](probe-009.txt)): 27/27 |
| C8 | Drag from dot to dot, taps, the dot's ring and the snapped ring, mouse and touch | 010 ([output](probe-010.txt)): 88/88 |
| C7 (rings) | Landing-ring contrast from pixels, median / 10th percentile (main in brackets, measured before this run on main's build): Tabletop day 3.50 / 2.77 (9.66 / 7.51, its single dark ink); Tabletop night 4.04 / 3.17 (3.02 / 2.37); Neon night 3.26 / 2.59 (4.57 / 3.87); Neon day 3.20 / 2.65 (3.37 / 2.72); Paper day 2.99 / 2.65 (3.11 / 3.03); Paper night 4.73 / 4.07 (2.98 / 2.89) | 011 ([output](probe-011.txt)): measurements |
| C11 | Game integrity: Hard to the end, phone 7x7, 12x12, keyboard-only 3x3, reload, restart | 012 ([output](probe-012.txt)): 35/35 |
| C11 | Local games' resume (`qa-r1a.mjs`) | not run in the window (40 s left on the clock). Run right after on the same build, outside the guard: 31/31 ([full](after-clock/qa-r1a-full.txt)) |

## Top 3 Things to Fix

1. ISSUE-001 (low, deferred): Neon at night's landing rings, see below.

## Issues

### ISSUE-001: Neon at night's landing rings sit near 3:1 on the glass board (low, Accessibility)

- **What:** the broken rings round the dots a drag can land on measure 3.26:1 (median) and 2.59:1 (10th percentile) against the board, down from 4.57 / 3.87 on main.
- **Why:** the board is now Deep Indigo glass over the aurora (the owner's choice), lighter than main's solid night board, and the aurora's lights brighten it in places. A deeper indigo light behind the board moved it only to 3.29 (tried and put back).
- **Impact:** the rings are an aid; the band itself shows the drag and taps still draw lines. The same level as Neon and Paper by day (3.20 and 2.99 median), which shipped in PR #14.
- **Fix status:** deferred (low; Standard tier fixes medium and up). Options for later: give Neon's rings the lines' glow, or a darker, less see-through board, which trades away some of the glass the owner asked for.

## Found and fixed before this run (in the branch's commits)

- Small muted text straight on the sharper wood and paper desk by day fell to 3.3-3.9:1 (8 texture-text failures, Tabletop and Paper by day, phone and desktop); it now uses full ink, and Home's "&" leans further to the ink on the maple table.
- Tabletop at night: the old 22% lamp pool on the new Deep Teal felt washed the light lines and rings to 2.9:1 (median, about 2.2:1 at the pool's centre); the lamp is 6% at night and the line tints a step lighter, now 4.04 / 3.17.
- Tabletop by day: the first per-player line pair (#9E4E17 and #8C600B) was only dE 19 apart; now #BF4E1E and #7C5E08 (dE 39, 3.4:1 and 4.3:1).
- The sheen first dropped Tabletop's white "Play again" label to 3.06:1; the day highlight now ends above the label (3.19:1, bar 3).
- Probe fixes, not product: `materials-probe.mjs` read a translucent glass token as NaN (now measured from pixels); `themes-test.mjs` expected the old Paper night bar colour.

## Console Health

| Error | Count | First seen |
|-------|-------|------------|
| none | 0 | |

Blocked Firebase requests show in the console as expected (counted apart by the suites).

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 1 (deferred) |

Fixes in this run: 0 verified, 0 best-effort, 0 reverted; 1 deferred.

**PR Summary:** QA found 1 issue (low, deferred), fixed 0, health score 100 → 99.
