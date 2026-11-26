# QA Report: Grid Rivals (Dots & Boxes): Hard's pondering and quicker AI moves

| Field | Value |
|-------|-------|
| **Date** | 2026-10-20 |
| **URL** | http://127.0.0.1:4173/ (production build of the commit, served by serve-one.mjs) |
| **Branch** | ai/4x4-and-speed |
| **Commit** | 324768f (2026-10-20), on main 10e07f1 |
| **PR** | — (not opened yet) |
| **Tier** | Standard |
| **Scope** | Diff-aware: the AI changes (src/lib/engine/ai-core.js, ai.ts, ai.worker.ts, src/screens/Game.svelte): Hard thinking on the player's time in the worker, the shorter AI pauses, pondering stopped on leaving; adjacent flows: resume after reload, Medium/Easy/two players, the no-Worker fallback |
| **Probe budget / guarded command time** | 900 s / 203.9 s (12 probes, 11 ran) |
| **Pages visited** | Home, Setup, Game (phone and desktop), Results dialog |
| **Screenshots** | 7 |
| **Framework** | Svelte 5 SPA (Vite) |

Driver: gstack's own headless Chromium 151 through its bundled Playwright 1.62.1, one scripted flow per probe (Aside is macOS-only). Phone: 390x844, DPR 3, touch. Desktop: 1280x800, mouse. Firebase blocked by hostname (`*.googleapis.com` except fonts, `*.firebaseio.com`, `*.firebasedatabase.app`, `*.firebaseapp.com`): nothing reached the live database.

## Health Score: 100/100 (provisional: Console, Functional, UX, Performance tested)

| Category | Score |
|----------|-------|
| Console | 100 |
| Links | not tested |
| Visual | not tested |
| Functional | 100 |
| UX | 100 |
| Performance | 97 |
| Accessibility | not tested |

(1500 + 2000 + 1500 + 970) / 60 = 99.5, rounded to 100.

## Top 3 Things to Fix

1. **ISSUE-001: Without a Web Worker, the player's line paints about 177 ms late on Hard's playout moves** (low, deferred, pre-existing on main)

No other issues found.

## Charters

| Contract | Risk | Entry point | Exit condition | Probe |
|---|---|---|---|---|
| A whole Hard 4x4 game by touch: AI's first line of a turn 250-450 ms after the player's (up to ~0.7 s when Hard runs playouts), further lines 200-280 ms apart, a ponder message on each player turn, the results dialog, no errors | the new pauses, the pondering protocol | Home → Play → Hard, 4×4 → Start game | game over | 003 |
| A player who answers in 120 ms: Hard's answer within one 40 ms slice, pauses unchanged | a move request arriving mid-slice | same | game over | 004 |
| Leaving mid-thought stops the worker | battery: pondering left running | Quit on the player's turn inside the pondering reach | CPU back to the Home screen's idle level | 005, 006 (calibration), 007 |
| Resume after a reload on the player's turn: same board, reset then ponder, game continues | the start() path | reload at 12+ lines | game over | 008 |
| Pondering is Hard-only | Medium/Easy/two players doing needless work | Medium, Easy, Two players | 16 lines or 8 taps | 009 |
| No Worker: Hard still plays a whole game | the fallback path (ponderAI is a no-op) | Worker removed before load | game over | 010 |
| Desktop Hard 5x5 with the mouse | bigger board: exact search from 34 left, pondering up to 38 | same, 5×5 | game over | 011 (harness stopped early), 012 |

## Results

| Probe | Result |
|---|---|
| 002 baseline | setup screen with every option, 0 console errors, one 74 ms load task, Firebase blocked (1 request) |
| 003 Hard 4x4, phone, 0.7 s thinking | game over 0–16; AI first line 273/435/702 ms (min/median/max, the 0.7 s ones are playout moves), further lines 205/241/280 ms; reset 1, ponder 13, choose 27; answers from 27 lines left on 1-14 ms; 0 errors, 0 long tasks |
| 004 Hard 4x4, 120 ms replies | game over 2–14; first line 295/390/738 ms, further 213/242/700 ms (700: a capture followed by a playout move); answers within a slice (42 and 68 ms mid-slice; 738 = a 0.7 s playout plus a slice); 0 errors |
| 005 Quit at 28 left | reset sent after Quit; CPU 67 ms/s before, 120 after: pondering had already finished at that depth (see 006) |
| 006 CPU calibration | 1017 ms/s during Hard's first move (the measure sees the worker); 309 ms/s on the player's turn at 28 left (all replies solved in a fraction of a second, then idle) |
| 007 Quit at about 30 left | **968 ms/s while pondering, reset on Quit, 144 ms/s after** (Home idle) |
| 008 Resume | 13 lines before and after the reload, player to move, `reset,ponder` after the reload, game over 1–15, answers 1-15 ms, 0 errors |
| 009 Modes | Medium: reset 1, choose 9; Easy: reset 1, choose 9; two players: reset 1; no ponder messages, 0 errors |
| 010 No Worker | game over 2–14, 0 errors; five 177 ms main-thread tasks (the fallback's quarter-time playouts) |
| 011 Desktop 5x5 | stopped at 55/60 lines (harness guard counted waits); everything seen in range; superseded by 012 |
| 012 Desktop 5x5 | game over 1–24; first line 270/367/701 ms, further 207/248/700 ms; positions pondered from 37 left; answers 1-22 ms in the endgame; 0 errors, 0 long tasks |

## Console Health

No console errors, uncaught errors or unhandled rejections in any probe.

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 1 |
| **Total** | **1** |

## Issues

### ISSUE-001: Without a Web Worker, the player's line paints about 177 ms late on Hard's playout moves

| Field | Value |
|-------|-------|
| **Severity** | low |
| **Category** | performance |
| **URL** | http://127.0.0.1:4173/ (game screen, Worker unavailable) |

**Description:** In browsers without module workers the AI runs on the page. Right after the player's line, Hard's choose() runs in a microtask before the browser paints, so on its playout moves (175 ms at the fallback's quarter time) the player's own line appears about 177 ms late (probe 010: five 177 ms long tasks; the gap from the player's line stamp to the AI's line read as low as 105 ms because the stamp itself came late). Expected: the player's line on screen at once. The path is unchanged by this branch (the same on main since PR #17) and affects only browsers without module workers.

**Repro Steps:**

1. Remove `Worker` before the app loads (probe 010's init script), start Hard 4×4.
2. Draw a line early in the game (Hard's playout phase).
3. **Observe:** a 177 ms main-thread task before the line paints. ![Result](screenshots/fallback-end.jpg) (end state; the delay is in the long-task log)

---

## Fixes Applied

None: the one issue is Low (Standard tier defers Low) and pre-existing.

## Regression Tests

| Issue | Test File | Status | Description |
|-------|-----------|--------|-------------|
| ISSUE-001 | — | deferred | pre-existing fallback behaviour, Low; not touched by this branch |

The branch's own tests (tests/ai/ai.test.ts: pondering against brute force on 3x4, waiting while a box is takeable) pass 12 of 12 runs (`npm run test:ai`).

---

## Evidence

Evidence tool verdict: **inconclusive** (open: no evidence rows). This is by design for a browser-only run: browser probes publish checkpoints instead of evidence rows.

[checkpoint 002](exploration-002.json), [checkpoint 003](exploration-003.json), [checkpoint 004](exploration-004.json), [checkpoint 005](exploration-005.json), [checkpoint 006](exploration-006.json), [checkpoint 007](exploration-007.json), [checkpoint 008](exploration-008.json), [checkpoint 009](exploration-009.json), [checkpoint 010](exploration-010.json), [checkpoint 011](exploration-011.json), [checkpoint 012](exploration-012.json)

Limits (also in annotations.json): probe 001 never reached the app (harness quoting), rerun as 002; probe 005 measured after pondering had finished, resolved by 006 and 007; probe 011 stopped early on a harness guard, superseded by 012, whose screenshot replaced 011's `desktop-end.jpg`; Chromium only, emulated phone; Links, Visual, Content and Accessibility not tested (no markup changed); the player was random play, so Hard's move quality rests on the unit tests and benches.

## Ship Readiness

| Metric | Value |
|--------|-------|
| Health score | 100 (provisional, 4 of 8 categories) |
| Issues found | 1 (low, pre-existing) |
| Fixes applied | 0 |
| Deferred | 1 |

**PR Summary:** "QA found 1 issue (low, pre-existing, deferred), fixed 0, health score 100 (provisional)."
