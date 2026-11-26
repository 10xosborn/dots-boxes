# QA Report: Grid Rivals, the spec's step 2 board marks, Paper's pencil lines and Neon's ring cores

| Field | Value |
|-------|-------|
| **Date** | 2026-10-15 (run started 2026-10-14 23:52 UTC) |
| **URL** | http://127.0.0.1:4173/ (production build `index-DFqW9QV6.js`, `index-C_BYGn3r.css`, Firebase blocked) |
| **Branch** | design/04-board-marks |
| **Commit** | 1609688 (code at a0a5a54; 1609688 is docs), base main 2f770e0 |
| **PR** | not opened yet |
| **Tier** | Standard; browser Full, diff-aware |
| **Scope** | `src/components/Board.svelte` (the last-move mark, the stronger last line, person and bot icons, Paper's pencil lines, hatching and tilted initials, Neon's ring cores), `src/components/HeroBoard.svelte` (pencil lines on Home), `src/screens/Game.svelte`, `Online.svelte`, `Home.svelte` (the `skin` and `bot` props), `src/app.css` (the mark tokens and styles) |
| **Probe budget / guarded command time** | 900 s / about 690 s over 14 probes, none timed out; finished with about 90 s left |
| **Pages visited** | Home, Setup, the game (4x4 by taps, saved 4x4 and 7x7 games, pass-and-play and AI, 1x1, 1x12, 2x7, 3x3, 5x5, 7x7, 12x12), results, Leaderboard, My stats, Settings, Online, the theme sheet; six modes; phone and desktop; every viewport in C8 |
| **Screenshots** | 169 (in `screenshots/`) |
| **Framework** | Svelte 5 SPA (Vite) |
| **Driver** | gstack's playwright-core with its headless Chromium: real mouse at 1280x800, touch at 390x844 (Aside is macOS-only) |
| **Charters** | [charters.md](charters.md): C1-C12, plus C13 added during the run |

## Health Score: 100/100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors in every suite) |
| Links | not scored (no links) |
| Visual | 100 (six modes, every screen, odd boards, viewports) |
| Functional | 100 |
| UX | 100 |
| Performance | not scored (separate /benchmark) |
| Content | 100 |
| Accessibility | 100 (PR #15's ISSUE-001 resolved by the ring cores, C6) |

Provisional: no real phone or screen reader; online play not exercised (the Online screen passes `skin` but no room was played).

## Evidence verdict: inconclusive (open: no evidence rows)

Final for this report root: a browser-only run produces no evidence rows. Results are in the probe outputs and checkpoints:

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json) · [checkpoint 005](exploration-005.json) · [checkpoint 006](exploration-006.json) · [checkpoint 007](exploration-007.json) · [checkpoint 008](exploration-008.json) · [checkpoint 009](exploration-009.json) · [checkpoint 010](exploration-010.json) · [checkpoint 011](exploration-011.json) · [checkpoint 012](exploration-012.json) · [checkpoint 013](exploration-013.json) · [checkpoint 014](exploration-014.json)

## Contracts

| # | Contract | Probe and result |
|---|---|---|
| C1 | The step 2 marks in all six modes: no mark before a move; one mark of the theme's kind (Tabletop a pip, Neon a ring, Paper two pencil ellipses) centred on the last line, following each move; Tabletop's last line a shade stronger (darker by day, lighter at night), the others unchanged; pass-and-play boxes carry initials; against the AI Tabletop shows a person and a bot, the others initials; Paper's 4x4 lines are pencil curves with a faint second stroke, straight at 7x7, boxes hatched, initials bigger and tilted; only Neon at night's landing rings carry a bright core | 001 ([output](probe-001.txt), [full](probe-001-full.txt)): 59/59 |
| C2 | C1 against main's build (2f770e0), to prove the suite tests the change | 002 ([output](probe-002.txt), [full](probe-002-full.txt)): 31 pass, 28 fail, as expected: every mark, stronger-line, icon, pencil, hatching and core check fails on main; no-mark-before-a-move and initials pass |
| C3 | The elastic band and the turning landing rings, six modes, Animations off, touch; Paper's band at its pencil width | 003 ([output](probe-003.txt)): 75/75 |
| C4 | Drag from dot to dot, taps, the dot's ring and the snapped ring, mouse and touch, over Paper's curved lines | 004: harness error (the suite's screenshot folder argument was missing; it stopped before opening a page). 005 ([output](probe-005.txt)): 88/88 |
| C5 | Board structure on odd shapes (1x1 wobbly; 1x12, 2x7 and 12x12 straight), the cursor ring 3:1 from pixels, rims, cores, confetti | 006 ([output](probe-006.txt)): 85/85 |
| C6 | Landing-ring contrast from pixels during a held drag, median / 10th percentile: Tabletop day 3.50 / 2.77; Tabletop night 4.04 / 3.17; Neon night rings 3.15 / 2.56, **bright cores 5.92 / 4.91**; Neon day 3.18 / 2.62; Paper day 2.99 / 2.65; Paper night 4.73 / 4.07. Every mode except Neon at night matches PR #15's figures | 007 ([output](probe-007.txt)): measurements |
| C8 | Viewports and rotation, the four colour-vision emulations, reduced motion and the Animations switch, with the hatching and marks | 008 ([output](probe-008.txt)): 27/27 |
| C9 | Game integrity: Hard to the end, phone 7x7, 12x12, keyboard-only 3x3, reload, restart | 009 ([output](probe-009.txt)): 35/35 |
| C10 | Local games' resume: reload, browser restart, Continue and Discard | 010 ([output](probe-010.txt)): 31/31 |
| C11 | Drag edges: the AI's turn, a second finger, letting go off the board | 011 ([output](probe-011.txt)): 10/10 |
| C12 | Themes and the picker: switching, persistence, no flash on reload, keyboard, Esc, the browser bar | 012 ([output](probe-012.txt)): 37/37 |
| C13 | Added during the run (the themes suite predates the marks and never switches with a move on the board): switching themes from the top bar mid-game redraws the mark in the new theme's kind on the same line, Paper swaps in pencil paths with ghosts and Tabletop swaps them out, a later move moves the mark, no errors (`skin-switch.mjs`) | 013 ([output](probe-013.txt)): 7/7 |
| C7 | Text over its real background, 7 screens x six modes x phone and desktop | 014 ([output](probe-014.txt)): 13/13 |

Not run in the window: `button-depth.mjs`, `aurora-glass.mjs`, `themes-screens.mjs` and `themes-edge.mjs` (this branch doesn't touch buttons, the aurora or those screens). All suites run again on the final build before the PR.

## Top 3 Things to Fix

None found.

## Issues

None. PR #15's ISSUE-001 (Neon at night's landing rings near 3:1 on the glass board, low) is resolved by commit 79c755d, the owner's "bright core" choice: each ring now carries a thin bright centre at 5.92:1 median (4.91:1 at the 10th percentile), while the ring itself stays at 3.15:1 (C6).

## Found and fixed before this run (in the branch's commits)

- Probe updates, not product: the drag, materials, texture-text, R1a, integrity, spring and drag-edge suites read lines as `<line>` only; Paper's lines are now `path.ln` curves with `.ghost` twins, so the suites read both and skip the ghosts. The spring suite now expects Paper's pencil band width (`max(4, gap x 0.06)`) and skips the core twins when counting rings. `ring-contrast.mjs` reports the cores apart.

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
| Low | 0 |

Fixes in this run: 0 verified, 0 best-effort, 0 reverted; 0 deferred. PR #15's deferred ISSUE-001 resolved by 79c755d (verified by C6).

**PR Summary:** QA found 0 issues, fixed 0, health score 99 → 100.
