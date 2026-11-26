# QA Report: Grid Rivals, the owner's four restyled theme modes

| Field | Value |
|-------|-------|
| **Date** | 2026-10-15 |
| **Target** | production build on http://127.0.0.1:4173/ (main's build `cff945c` beside it on :4177 for B7), Firebase blocked by hostname; repository commands |
| **Branch** | design/05-four-modes |
| **Commit** | `4d3b6cc` at baseline; `8659ce4` after the fix below (folded into the task's single commit: the owner asked for one commit per task) |
| **Tier** | Standard; mixed run: browser (Full, 900 s guard) and functional (repository commands, evidence tool) |
| **Scope** | Tabletop at night, Cozy Paper at night, Dark Neon, White Neon (restyled); Tabletop and Paper by day (must be untouched) |
| **Driver** | gstack's playwright-core with its headless Chromium (Aside is macOS-only; the browse daemon restarts on Windows): phone 390x844 at 2x with touch, desktop 1280x800 |
| **Charters** | [charters.md](charters.md): B1-B9 browser, F1-F4 functional |

## Browser: Health Score 100/100 (provisional)

| Category | Baseline | Final |
|----------|----------|-------|
| Console | 100 (0 page errors; the only console errors are the deliberately blocked Firebase requests) | 100 |
| Functional | 100 | 100 |
| UX | 100 | 100 |
| Visual | 97 (ISSUE-001, low) | 100 |
| Performance | 100 (one texture tile per paper mode, none in Neon, no backdrop-filter on the board) | 100 |
| Content | 100 | 100 |
| Accessibility | 100 (dots and lines 3:1 or more from pixels, keyboard play) | 100 |
| Links | not scored (the app navigates with buttons, no links in scope) | not scored |

Weighted: 99.7 → 100 at baseline (rounded), 100 final. Provisional: no real phone or Brave check; headless Chromium draws in software.

Evidence verdict (browser): inconclusive (open: no evidence rows), final for a browser-only root. Checkpoints: [checkpoint 002](browser/exploration-002.json) · [checkpoint 003](browser/exploration-003.json) · [checkpoint 004](browser/exploration-004.json) · [checkpoint 005](browser/exploration-005.json) · [checkpoint 006](browser/exploration-006.json) · [checkpoint 007](browser/exploration-007.json) · [checkpoint 008](browser/exploration-008.json) · [checkpoint 009](browser/exploration-009.json) · [checkpoint 010](browser/exploration-010.json) · [checkpoint 011](browser/exploration-011.json)

| # | Contract | Probe and result |
|---|---|---|
| B2 | Switching through all six modes leaves no colours behind; reload keeps the mode; the bar matches the page | 001 ([output](browser/probe-001.txt)): 17/19, both failures ISSUE-001 (Dark Neon's bar). Replay after the fix: 010 did not run (Chromium launch `spawn EBUSY`, an environment lock), 011 ([output](browser/probe-011.txt)): **19/19** |
| B3 | Dots and lines at least 3:1 from pixels; initials legible | 002 ([output](browser/probe-002.txt)): pass. Lines (median, worst in the stroke body): Tabletop 7.05/4.03, Paper 7.67/5.25, Dark Neon 6.31 (5.07)/16.72 (16.15), White Neon 4.93 (4.28)/3.80 (3.32); dots 6.12, 9.38, 14.23, 3.02 (worst 3.02); initials 4.78:1 or more |
| B5 | No backdrop-filter on any board; textures within 50 KB per mode | 003 ([output](browser/probe-003.txt)): pass. Tabletop at night `grain.webp` 20.3 KB, Paper at night `cardstock.webp` 37.3 KB, Neon none |
| B1 | Drags, taps, the dot-tap rule, rings and sounds in every mode (mouse in six, touch in five) | 004 ([output](browser/probe-004.txt)): **118/118** |
| B6 | Neon's room drifts, pauses for drags and with Animations off, never catches a tap; opaque static board; frosted cards only at night; nothing in Tabletop or Paper | 005 ([output](browser/probe-005.txt)): **21/21** |
| B7 | Tabletop and Paper by day pixel-identical to main | 006 ([output](browser/probe-006.txt)): pass. Home, Setup, game, result: 0 pixels differ in both; Settings differs only in the box holding Neon's own row (its new preview and blurb) |
| B4 | Violet only in Dark Neon | 007 ([output](browser/probe-007.txt)): pass. Outside Dark Neon 0.00-0.06% (edges where a coral dot meets a blue line in White Neon; Dark Neon's own preview tile in the Tabletop and Paper night pickers, 0.02-0.03%); Dark Neon 3.6-14.9% (its tiles, avatar discs, frosted sheet) |
| B8 | Game integrity | 008 ([output](browser/probe-008.txt)): **35/35** |
| B9 | Local games' resume | 009 ([output](browser/probe-009.txt)): **31/31** |

## Functional: contract outcomes (no score)

Evidence verdict (functional): **pass** ([evidence](functional/evidence.json); [checkpoint 002](functional/exploration-002.json) · [checkpoint 003](functional/exploration-003.json) · [checkpoint 004](functional/exploration-004.json) · [checkpoint 005](functional/exploration-005.json)).

| # | Contract | Capture | Outcome |
|---|---|---|---|
| ISSUE-001 regression | `npx vitest run tests/theme` | 001 (before the fix), 002 (after) | 001 failed `neon dark` only (superseded); 002 **7/7 pass** |
| F1 | `npm run check` | 003 | pass: 0 errors, 0 warnings (149 files) |
| F2 | `npm run build` | 004 | pass |
| F3 | `node token-audit2.mjs <repo>`: each restyled mode sets every colour token itself | 005 | pass: none missing in all four (82, 82, 98, 98 tokens) |
| F4 | `npm run test:rules` | - | not applicable: no Firebase rules, data or online change |

## Issues

### ISSUE-001: Dark Neon's browser bar kept the first page colour (low, Visual): fixed, verified

- **What:** in Dark Neon the browser bar (meta theme-color) and the theme picker's preview showed #05070D while the page is #050608. The page moved to a neutral black during the design review (magenta light on navy turned violet); the bar map in `src/lib/theme/themes.ts` and the pre-paint map in `index.html` kept the old value. Visually almost identical, but a mode not using its own colour, which the brief rules out.
- **Repro:** probe 001, checks `start neon-dark` and `switched to neon-dark` (`bar #05070D`).
- **Fix:** Dark Neon's bar and preview page colour set to #050608 in `src/lib/theme/themes.ts` and `index.html` (three values).
- **Why fixed under the Standard tier:** it is low severity, but it is one stale value in this task's own files, and the brief asks that each mode carry its own colours.
- **Regression test:** `tests/theme/theme-colours.test.ts` (new): every mode's bar, picker preview and pre-paint colour must equal the `--page` its own block sets in `app.css`, and the static meta must be the default mode's. Red before the fix (capture 001: `neon dark` failed, 6 passed), green after (capture 002: 7/7). Value: protects=each mode's bar and preview use its own page colour; fails_when=themes.ts or index.html drift from app.css's --page; why_new=nothing tested themes.ts or the pre-paint map; seam=none; no_claim=what the browser bar looks like on a real phone (static read of the sources).
- **Browser recheck:** probe 011, 19/19.
- **Fix status:** verified. Commit `8659ce4` (the task's commit, amended). Files: `src/lib/theme/themes.ts`, `index.html`, `tests/theme/theme-colours.test.ts`.

## Console Health

| Error | Count |
|-------|-------|
| page errors | 0 |
| failed resource loads | the blocked Firebase requests only (test isolation, as on main) |

## Limits

- Checkpoints 009-011 were written from the captured probe output by a short script (exact text, published before each probe) to fit the 900 s budget.
- Probe 010 did not run (Chromium launch `spawn EBUSY`); the same replay ran as 011.
- Headless Chromium with a software renderer and CDP touch; no real phone or Brave. GPU cost and drag frames on 12x12 belong to /benchmark.

## Revalidation after the benchmark's layer trim (2026-10-19, commit `6aaf438`)

/benchmark found the board appearing 8-14% later on a game reload: it built Neon's glow, reflection and glass-tile shapes in
every mode, hidden. `Board.svelte` and `HeroBoard.svelte` now build them only in Neon (reflections and node glow only in
Dark Neon). Affected contracts re-run on the rebuilt build (outputs in [revalidation/](revalidation/)):

| Check | Result |
|---|---|
| New: which layers exist per mode, on Home's demo board and the game board, including after switching theme mid-game (`dom-layers.mjs`) | 12/12 |
| B2 theme switching (`theme-switch.mjs`) | 19/19 |
| B3 Neon contrast from pixels (`board-contrast.mjs neon-dark,neon-light`) | unchanged: 6.31 (5.07) / 16.72, dots 14.23; 4.93 (4.28) / 3.80 (3.32), dots 3.02 |
| B1 drags, taps, rings, sounds in every mode (`drag-test-themes.mjs`) | 118/118 |
| B7 day modes against main (`day-diff.mjs`) | Home, Setup, game 0 pixels in both; the result differs only in the clock digit (Tabletop); Settings only in Neon's row |
| F1 `npm run check`, F2 build, `npx vitest run tests/theme` | 0/0, pass, 7/7 |

## Summary

Browser: 1 issue (low), fixed and verified; health 100 → 100 (provisional). Functional: 4 contracts pass, 1 not applicable; the new regression test went red then green.

**PR Summary:** QA found 1 issue, fixed 1, health score 100 → 100 (provisional); functional F1-F3 pass.
