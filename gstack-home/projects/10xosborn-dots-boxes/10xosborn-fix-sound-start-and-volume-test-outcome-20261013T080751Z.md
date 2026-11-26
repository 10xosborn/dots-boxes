# QA Report: Grid Rivals, sounds start in the first click and are loud enough to hear

| Field | Value |
|-------|-------|
| **Date** | 2026-10-13 |
| **URL** | http://127.0.0.1:4173/ (production build `index-D4rNLOBV.js`, Firebase blocked); main's build `index-Mt9-zyyv.js` on :4177 for C4 |
| **Branch** | fix/sound-start-and-volume |
| **Commit** | af35e85 (2026-10-13 07:52 UTC), base main 3521b1b |
| **PR** | not opened yet |
| **Tier** | Standard; browser Full, diff-aware |
| **Scope** | `src/lib/sound.ts`, `src/screens/Settings.svelte` and everything that plays a sound (drag, moves, boxes, game ends), plus the Settings screen |
| **Probe budget / guarded command time** | 900 s / 193.0 s over 7 probes, none timed out; stopped with 461 s left because every scoped contract was tested |
| **Pages visited** | every screen (Home, Setup, game, results, Settings, Leaderboard, My stats, Online) in six modes |
| **Screenshots** | 97 (from the drag and screens suites) |
| **Framework** | Svelte 5 SPA (Vite) |
| **Driver** | gstack's playwright-core 1.62.1 with its Chromium 151 under Chrome's autoplay rule (`--autoplay-policy=document-user-activation-required`), and the owner's Brave 155 (headless, throwaway profile, Brave's defaults). Real mouse clicks and drags, touch taps on a 390x844 phone. Aside is macOS-only (`NEEDS_ASIDE`) |
| **Charters** | [charters.md](charters.md): C1-C7 |

## Health Score: 100/100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors; no AudioContext warnings) |
| Links | not scored (no links) |
| Visual | 100 (every screen in six modes, C7) |
| Functional | 100 |
| UX | 100 |
| Performance | not scored (separate /benchmark) |
| Content | 100 |
| Accessibility | not scored (no accessibility surface changed; the keyboard path that also starts the engine was not probed) |

Main, on the same probes: Functional 92 for the owner's issue (Medium: sounds started paused, came late, and peaked at -22 to -30 dBFS, too quiet for PC speakers), 98 overall.

## Evidence verdict: inconclusive (open: no evidence rows)

Final for this report root: a browser-only run produces no evidence rows. Results are in the probe outputs and checkpoints:

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json) · [checkpoint 005](exploration-005.json) · [checkpoint 006](exploration-006.json) · [checkpoint 007](exploration-007.json)

## Contracts

| # | Contract | Probe and result |
|---|---|---|
| C1 | With Sound on: no engine before the page is used; created inside the first click (or tap) and running before the game; a move, a drag (pick, snap, line) and a box heard at once; line -6.6 dBFS, box -6.4 dBFS (were -26.3 and -21.8); Sound off creates nothing; the Sound switch plays the chime at once and pauses the engine when off; no AudioContext warnings. Chromium and Brave | 001 ([output](probe-001.txt)): 34/34 |
| C2 | A game's end plays its whole jingle at once, unclipped: win -3.7 dBFS, lose -3.9 dBFS | 002 ([output](probe-002.txt)): 6/6 |
| C3 | The drag gesture and every sound by pitch, six modes, mouse and touch | 003 ([output](probe-003.txt)): 88/88 |
| C4 | The same suite on main catches the original problems | 004 ([output](probe-004.txt)): 24 FAIL, as expected (below) |
| C5 | Home at phone and desktop size, no console errors | 005 ([output](probe-005.txt)): 6/6 |
| C6 | Local games, reload, resume | 006 ([output](probe-006.txt)): 31/31 |
| C7 | Settings and every other screen in six modes, phone and desktop | 007 ([output](probe-007.txt)): 108/108 |

**C4 on main, in both browsers:** the engine is made at load while the page is unused (`"state":"suspended","active":false`), is still paused when the game starts, and on phones starts before any tap; the first move's sound is scheduled while paused (`[[520,"suspended"]]`) and the drag's sounds a moment later too. Two kinds of FAIL there are not defects: main has no limiter, so the level tap reads -Infinity (main's real levels, measured offline: -26.3 dBFS for a line, -21.8 for a box), and the chime and pausing when Sound is off are new behaviour.

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

None found in this branch. The owner-reported issue (no sound on their Windows PC) is what the branch fixes; C1-C4 verify the fix and show the problem on main.

## Fixes Applied

None in this run's fix loop (the fix, af35e85, was committed before QA).

## Regression Tests

| Issue | Test File | Status | Description |
|-------|-----------|--------|-------------|
| owner report: no sound | scratch `sound-test.mjs`, `sound-endgame.mjs` (outside the repo) | deferred | The repo has no UI test framework (CLAUDE.md, Testing); browser checks are throwaway scripts. A Vitest unit test of `sound.ts` would need a mocked Web Audio API and couldn't show what matters here (when browsers let the engine start), so it fails the test value bar. |

## Limits

- No real speakers: audibility is inferred from the engine state when each note starts and from the level measured at the app's limiter output.
- Brave ran headless with a throwaway profile and Brave's defaults; the owner's own profile may have a per-site autoplay setting this run can't see.
- Online play not exercised (needs the Firebase emulators; low memory). Its sound calls are unchanged.
- The keyboard path that also starts the engine (`keydown`) was not probed.
- iPhone Safari not tested (its silent switch mutes web audio by design).

## Ship Readiness

| Metric | Value |
|--------|-------|
| Health score | 100 → 100 (main on the same probes: 98) |
| Issues found | 0 |
| Fixes applied | 0 |
| Deferred | 0 |

`npm run check` 0 errors and 0 warnings; build passes.

**PR Summary:** QA found 0 issues in the branch and verified the no-sound fix in Chromium and Brave (the same checks fail on main), health score 100 → 100.
