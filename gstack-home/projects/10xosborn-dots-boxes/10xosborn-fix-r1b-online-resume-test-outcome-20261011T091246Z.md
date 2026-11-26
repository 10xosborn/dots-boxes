# QA Report: Grid Rivals (Dots & Boxes), rejoining online games

| Field | Value |
|-------|-------|
| **Date** | 2026-10-11 |
| **Branch / commit** | fix/r1b-online-resume, 4125292 (base main cd588b2) |
| **PR** | not opened yet |
| **Tier / mode** | Standard; browser Full (diff-aware) |
| **Targets** | Emulator build at http://127.0.0.1:4175/ with local Firebase emulators (demo project) for online play; production build at http://127.0.0.1:4173/ with Firebase blocked for local games |
| **Isolation** | Local emulators only; rooms deleted through the emulator's local admin REST API; every context aborts live Firebase hosts: 0 attempts |
| **Driver** | gstack's own headless Chromium through gstack's bundled playwright-core (host desktop 1280x800 mouse, guest phone 390x844 touch); a restart is a new tab in the same profile |
| **Budget / guarded command time** | 900 s / 104.8 s over 4 probes, none timed out |
| **Charters** | [charters.md](charters.md): C1-C6 |
| **Framework** | Svelte 5 SPA (Vite), Firebase 12 |

## Health Score: 100/100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors) |
| Links | not scored (no links) |
| Visual | 100 ("That game has ended." in the muted note style; `screenshots/resume-ended-desktop.png`) |
| Functional | 100 (79 of 79 checks) |
| UX | 100 (rejoin in 0.4 s; no lobby flash, "Getting back into your game…" meanwhile) |
| Performance | not scored (separate /benchmark) |
| Content | 100 |
| Accessibility | 100 provisional (polite status regions; no screen reader used) |

## Evidence verdict: inconclusive (open: no evidence rows)

Final for this report root: a browser-only run produces no evidence rows. Results are in the probe outputs and checkpoints:

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json)

## Contracts

| # | Contract | Probe | Result |
|---|---|---|---|
| C6 (orientation) | Home and the local Continue card on the production build, no console errors | 001 ([output](probe-001.txt)) | 6/6 |
| C1 | Create and join save `dnb:room` with the right seat; a reload while waiting returns to the same code | 002 ([output](probe-002.txt)) | pass |
| C2 | Host reload mid-game: same room, seat and board in 443 ms (acceptance: within 3 s); play continues; no "stepped away" for the friend; guest reload 416 ms; browser restart 424 ms | 002 | pass |
| C3 | Leave and a room closed during play clear the save ("This game was closed."); a gone room or a lost seat: "That game has ended." and cleared | 002 | pass |
| C4 | A finished game records its end on both devices; not reopened 10 minutes later; a rematch clears it; saves older than 24 h ignored; invite links join and save | 002 | pass (22/22) |
| C5 | R1b-1 presence on this build: drop, away note, offline move once, recovery | 003 ([output](probe-003.txt)) | 20/20 |
| C6 | Local games: resume after reload and restart, Continue and Discard, Quit and Restart, pass-and-play, resumed scoring | 004 ([output](probe-004.txt)) | 31/31 |

## Top 3 Things to Fix

None found. 0 issues. (During development the suite caught one UX flaw, the lobby flashing while a rejoin loaded; it was fixed before this run with the "Getting back into your game…" panel.)

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

## Limits

- A browser restart was simulated with a new tab in the same profile (sessionStorage gone, localStorage and the IndexedDB sign-in kept). Real Android phone and iPhone checks remain for the owner.
- Online flows ran against the local emulators under a demo project, not the live project.
- The 10-minute and 24-hour rules were tested by ageing the saved timestamps, not by waiting.
- The "Getting back into your game…" panel shows for about 0.3 s here; slow networks were not simulated. Touch emulated; no screen reader.
- Cleanup: the emulators and previews (4173, 4175) are still running for the design review and benchmark.

## Fixes Applied

None needed.

## Ship Readiness

| Metric | Value |
|--------|-------|
| Health score | 100 (provisional) |
| Issues found / fixed / deferred | 0 / 0 / 0 |

**PR Summary:** "QA found 0 issues, fixed 0, health score 100 (provisional; evidence verdict inconclusive, browser-only): 79/79 checks, host back in the same seat 443 ms after a reload."
