# QA Report: Grid Rivals (Dots & Boxes)

| Field | Value |
|-------|-------|
| **Date** | 2026-10-10 |
| **URL** | http://127.0.0.1:4173/ (vite preview of the production build) |
| **Branch** | fix/r1a-resume-local-games |
| **Commit** | 8b5d504 (2026-10-10) |
| **PR** | not opened yet |
| **Tier** | Standard |
| **Scope** | Diff-aware: game resume (AI and pass-and-play), the Continue card on Home, resumed-score handling, plus adjacent flows (new game, Quit, Restart, results, leaderboard, stats) |
| **Probe budget / guarded command time** | 900 s / 45.4 s (6 probes run, 2 not run) |
| **Pages visited** | Home, Setup, Game, Results, Leaderboard, Stats (single-page app, no routes) |
| **Screenshots** | 9 |
| **Framework** | Svelte 5 SPA (Vite) |

Driver: gstack's own headless Chromium through gstack's bundled playwright-core (Aside is macOS-only; `$B` cannot block requests, and this local build talks to production Firebase). Every context blocked Firebase, so nothing reached production.

## Health Score: 100/100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors across every probe) |
| Links | not scored (no links: single-page app) |
| Visual | 100 |
| Functional | 100 |
| UX | 100 |
| Performance | not scored (measured separately with /benchmark) |
| Accessibility | 100 ("Game resumed" announced; Continue button 50 px tall) |

Content was also checked (card text) with no findings. Provisional: 6 of 8 categories tested.

## Evidence verdict: inconclusive (open: no evidence rows)

The gstack evidence tool's verdict for this report root is final: **inconclusive**, because a browser-only run produces no functional evidence rows. The browser results are in the probe outputs and checkpoints below.

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json) · [checkpoint 005](exploration-005.json) · [checkpoint 006](exploration-006.json) · [checkpoint 007](exploration-007.json) · [checkpoint 008](exploration-008.json)

## Top 3 Things to Fix

None found. 0 issues.

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

## Contracts (charters in [charters.md](charters.md))

| # | Contract | Probe | Result |
|---|---|---|---|
| C0 | Home loads at desktop and phone with no console errors; the Continue card shows, fits a 390x844 phone (358 px wide, no sideways scroll) and its Continue button is 50 px tall | 001 | 6/6 pass |
| — | Investigation: the full-page phone screenshot showed a white band at the bottom. Viewport screenshots after scrolling show the dark background and a readable Settings button at 390x844 (with the card) and 360x640 (without it): a Chromium full-page capture artifact of the fixed body background, not a defect | 002 | not a defect |
| C1 | A reload during an AI game reopens it: same 11 lines, clock 0:04 → 0:04, "Game resumed. Score 0 to 0. Tactician to move.", then the AI moves | 003 | pass |
| C2 | After a browser restart Home offers "Continue your game" (4×4 against Tactician: 12 of 40 lines drawn); Continue opens the same game; leaving through Home keeps it; a later reload goes to Home; Discard clears it | 003 | pass (13/13 with C1) |
| C3 | Quit and Restart clear the saved game; a finished game isn't kept; Play again starts an empty game | 006 | 6/6 pass |
| C4 | Pass-and-play on a 390x844 touch phone survives a reload with the right player up | 007 | 3/3 pass |
| C5 | A resumed 3×3 win against Easy (6–3) is saved once under its game id with resumed: true and 66 XP; results say "Resumed games don't set fastest-win times."; the 3×3 Easy fastest board stays empty while most wins shows 1; Stats show no fastest time | 008 | 9/9 pass |

## Limits

- Checkpoint 005 was published in error before probe C had output; its claim that C3 passed is void (see checkpoint 006). Probes 004 and 005 did not run because bun.exe was locked for about 30 s (most likely an antivirus scan of the freshly installed bun 1.4.2); probe C was re-run as probe 006.
- Firebase was blocked to keep production untouched, so the Firebase adapter path (a resumed win leaves `best` unchanged; the create-only rules refuse a second save of the same game id) was verified by code reading, not live.
- Touch was emulated (Chromium hasTouch at 390x844); no real Android phone or iPhone was used.

## Fixes Applied

None needed.

## Regression Tests

No test framework in the repo yet; bootstrap deferred to R1b (Vitest, with the Firebase rules tests). The scripted browser checks used here are throwaway and not committed.

## Ship Readiness

| Metric | Value |
|--------|-------|
| Health score | 100 → 100 (provisional) |
| Issues found | 0 |
| Fixes applied | 0 |
| Deferred | 0 |

**PR Summary:** "QA found 0 issues, fixed 0, health score 100 → 100 (provisional; evidence verdict inconclusive: browser-only run)."
