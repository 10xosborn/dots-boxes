# QA Report: Grid Rivals, the elastic drag and the landing rings

| Field | Value |
|-------|-------|
| **Date** | 2026-10-13 |
| **URL** | http://127.0.0.1:4173/ (production build `index-Bc2asnoY.js`, `index-DLFGDFIy.css`, Firebase blocked); main's build `index-D4rNLOBV.js` on :4177 for C4 |
| **Branch** | feat/springy-drag |
| **Commit** | 7a8a446 (code at 3be28e4; 7a8a446 is docs), base main af69571 |
| **PR** | not opened yet |
| **Tier** | Standard; browser Full, diff-aware |
| **Scope** | `src/components/Board.svelte`, `src/app.css`, `DESIGN.md`: the drag band, the landing rings, and everything around the board's input |
| **Probe budget / guarded command time** | 900 s / 303.2 s over 8 probes, none timed out; stopped with 407 s left because every scoped contract was tested |
| **Pages visited** | Home, Setup, the game (4x4, 3x3, 5x5, 7x7, 12x12, 1x1, 1x12, 2x7), results; six modes; every viewport in C8 |
| **Screenshots** | 124 (drag, materials and acceptance suites) |
| **Framework** | Svelte 5 SPA (Vite) |
| **Driver** | gstack's playwright-core 1.62.1 with its headless Chromium 151: real mouse at 1280x800, CDP touch at 390x844 (Aside is macOS-only) |
| **Charters** | [charters.md](charters.md): C1-C8 |

## Health Score: 100/100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors) |
| Links | not scored (no links) |
| Visual | 100 (board structure, odd shapes, six modes) |
| Functional | 100 |
| UX | 100 |
| Performance | not scored (separate /benchmark) |
| Content | 100 |
| Accessibility | 100 (keyboard-only game, reduced motion and the Animations switch stop all motion, colour-vision emulations) |

Provisional: no real phone, Brave, or screen reader; online play not exercised.

## Evidence verdict: inconclusive (open: no evidence rows)

Final for this report root: a browser-only run produces no evidence rows. Results are in the probe outputs and checkpoints:

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json) · [checkpoint 005](exploration-005.json) · [checkpoint 006](exploration-006.json) · [checkpoint 007](exploration-007.json) · [checkpoint 008](exploration-008.json)

## Contracts

| # | Contract | Probe and result |
|---|---|---|
| C1 | Rings on exactly the dots a drag can land on (free lines only, corners two), dashed and turning; the snapped ring whole and still; the tip bounces past the snapped dot (about 10 px on a 96 px gap) and settles on it by frame 15-16, at the line's full width; a sideways swing bends the band 11-13 px and it straightens at rest with no frames left running; let go with no line, the band springs home and goes in 110-130 ms, rings at once, nothing drawn; a drawn drag leaves no band; Animations off: straight, exact, no bounce, gone at once, rings still. Six modes with a mouse, Animations off, phone touch | 001 ([output](probe-001.txt), [full](probe-001-full.txt)): 75/75 |
| C2 | The gesture, its sounds, taps, the dot's ring and the snapped ring, six modes, mouse and touch | 002 ([output](probe-002.txt)): 88/88 |
| C3 | Drag edges: the AI's turn, a second finger, letting go off the board | 003 ([output](probe-003.txt)): 10/10 |
| C4 | C1 on main | 004 ([output](probe-004.txt), [full](probe-004-full.txt)): fails at its first check (no rings), then stops with `TypeError: Cannot read properties of null (reading 'bendPx')` because main has no band path to measure (it draws a straight `line.drag`). As expected |
| C5 | Game integrity: 5x5 against Hard to the end, phone 7x7, 12x12, keyboard-only 3x3, reload, restart | 005 ([output](probe-005.txt)): 35/35 |
| C6 | Local games, touch taps, reload and resume | 006 ([output](probe-006.txt)): 31/31 |
| C7 | Board structure, odd shapes, cursor ring, confetti, ids, preview contrast | 007 ([output](probe-007.txt)): 85/85 |
| C8 | Viewports, rotation, colour vision, reduced motion and the Animations switch | 008 ([output](probe-008.txt)): 27/27 |

## Top 3 Things to Fix

None in this branch.

## Console Health

| Error | Count | First seen |
|-------|-------|------------|
| none | 0 | |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

## Issues

None found in this branch.

## Fixes Applied

None in this run's fix loop.

## Regression Tests

| Issue | Test File | Status | Description |
|-------|-----------|--------|-------------|
| owner request: springy drag, landing rings | scratch `spring-test.mjs` (outside the repo) | deferred | The repo has no UI test framework (CLAUDE.md, Testing); browser checks are throwaway scripts. The behaviour is motion over frames in a real browser, which a unit test couldn't show. |

## Limits

- The spring suite was written alongside the code and can share its blind spots; C4 shows it fails on main, and the design review checks the motion by eye.
- Touch was CDP-emulated in Chromium; no real phone, Brave or screen reader.
- Online play not exercised (needs the Firebase emulators; low memory); the online screen renders the same Board.
- The themes and other-screens suites weren't in this guarded run (unchanged areas); they run as separate PR checks.

## Ship Readiness

| Metric | Value |
|--------|-------|
| Health score | 100 → 100 |
| Issues found | 0 |
| Fixes applied | 0 |
| Deferred | 0 |

`npm run check` 0 errors and 0 warnings; build passes.

**PR Summary:** QA found 0 issues, health score 100 → 100; the elastic drag and landing rings pass 75 checks in all six modes, with Animations off and on a phone, and the same suite fails on main.
