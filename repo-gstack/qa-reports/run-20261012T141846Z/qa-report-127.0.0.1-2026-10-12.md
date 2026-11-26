# QA Report: Grid Rivals (Dots & Boxes), three themes and the theme picker

| Field | Value |
|-------|-------|
| **Date** | 2026-10-12 |
| **Branch / commits** | design/01-themes, e28e7aa tested, fix 9e4d256 (base main 3b3de84) |
| **PR** | not opened yet |
| **Tier / mode** | Standard; browser Full (diff-aware) |
| **Target** | Production build served by `vite preview` at http://127.0.0.1:4173/ (rebuilt after the fix) |
| **Isolation** | Every context aborts live Firebase hosts by hostname: the app runs on its local adapter, nothing reaches the live project. Fonts are self-hosted, so no Google Fonts requests either |
| **Driver** | gstack's own headless Chromium through gstack's bundled playwright-core (phone 390x844 with touch at 2x, desktop 1280x800 with mouse) |
| **Budget / guarded command time** | 900 s / 345.2 s over 12 probes, none timed out; probing stopped with 2 min 17 s left, every contract passing on the final inputs |
| **Charters** | [charters.md](charters.md): C1-C4 |
| **Framework** | Svelte 5 SPA (Vite), Firebase 12 |

## Health Score: 99 → 100 (provisional)

| Category | Baseline | Final |
|----------|----------|-------|
| Console | 100 (0 errors; the blocked Firebase requests that log `net::ERR_FAILED` by design are counted apart) | 100 |
| Links | not scored (no links; navigation is buttons) | not scored |
| Visual | 100 (six modes reviewed side by side per screen) | 100 |
| Functional | 100 | 100 (C1-C4: 37 + 108 + 31 + 9 checks) |
| UX | 100 | 100 |
| Performance | not scored (separate /benchmark) | not scored |
| Content | 100 | 100 |
| Accessibility | 97 (ISSUE-001, Low) | 100 provisional (no screen reader used) |

Baseline (99): (100 × 0.65 + 97 × 0.15) / 0.80 = 99.4. Final: 100.

## Evidence verdict: inconclusive (open: no evidence rows)

Final for this report root: a browser-only run produces no evidence rows. Results are in the probe outputs and checkpoints:

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json) · [checkpoint 005](exploration-005.json) · [checkpoint 006](exploration-006.json) · [checkpoint 007](exploration-007.json) · [checkpoint 008](exploration-008.json) · [checkpoint 009](exploration-009.json) · [checkpoint 010](exploration-010.json) · [checkpoint 011](exploration-011.json) · [checkpoint 012](exploration-012.json)

## Contracts

| # | Contract | Baseline probe | Final probe |
|---|---|---|---|
| C4 (orientation) | Home and the Continue card on the default theme (Tabletop), phone and desktop, no console errors | 001 ([output](probe-001.txt)): 6/6 | covered by 010 |
| C1 | Every theme and mode renders Home, a game, Settings and the picker at both sizes with no sideways scroll and the theme's own font; live token contrast: text 12.95-15.3 and muted 5.03-8.28 against panels (bar 4.5); lines, boxes, initials and focus all at 3.22 or more (bar 3) | 002 ([output](probe-002.txt)): pass | 011 ([output](probe-011.txt)): pass, plus the ISSUE-001 regression check in all six modes |
| C2 | The picker: named button, focus on the current theme, arrows apply at once, a tap applies, saves and recolours the browser bar, light and dark inside, Esc / Done / backdrop close with focus returned, no flash after a reload, old settings load as Tabletop | 002: pass (31/31 with C1) | 011: pass (37/37 with C1) |
| C3 | Home with the offline banner and Continue card, the results dialog after a win, Setup and Custom, Leaderboard, My stats and Online in every theme and mode at both sizes; the self-hosted fonts load with no failures: 1 font request per page load on Tabletop, 2 on Neon, 4 on Paper (5, 10 and 20 over five page loads), one per face the theme uses | 003 ([output](probe-003.txt)): 108/108 | 012 ([output](probe-012.txt)): 108/108 |
| C4 | Local games: reload and restart resume, Continue and Discard, Quit and Restart, pass-and-play on touch, resumed scoring | 004 and 005 ([output](probe-005.txt)): blocked at the first step by ISSUE-001 | 010 ([output](probe-010.txt)): 31/31 |
| Edges | Saved settings with an unknown theme, a wrong type or broken JSON paint Tabletop (keeping the saved mode) before the app starts, no errors; Tab reaches the theme button with a visible outline in every theme and Enter opens the picker | 007 (test error), 008 ([output](probe-008.txt)): 9/9 | not affected by the fix |

## Top 3 Things to Fix

1. **ISSUE-001 (fixed and verified):** selected options read as "✓ Medium" to screen readers.

Nothing else found.

## Issues

### ISSUE-001: the tick on a selected option was read out as part of its name

| Field | Value |
|---|---|
| Severity / category | Low / Accessibility |
| Where | Every segmented control: Setup (mode, board size, difficulty, who starts), Leaderboard filters, Online board size, the picker's Light and Dark; every theme |
| Introduced by | this branch: `src/app.css` added `.seg button[aria-pressed="true"]::before{content:"\2713\00a0"}` as the non-colour sign of the selected option |
| Actual (before) | Chromium's accessibility tree names the buttons `"✓ Play the AI" [pressed]`, `"✓ 4×4" [pressed]`, `"✓ Medium" [pressed]`: a screen reader says "check mark" before every selected option, although "pressed" already says it. Exact-name lookups miss them, which stopped the local-games suite at its first step |
| Expected | The name is the label alone; the tick stays visible |
| Repro | Open Setup and read the accessibility tree of the Mode group ([probe 006](probe-006.txt), `screenshots/issue-001.png`) |
| Fix | 9e4d256: `content:"\2713\00a0";content:"\2713\00a0"/""`: empty alt text keeps the tick out of the name; browsers without that syntax (Safari before 17.4) keep the first declaration, so they still show the tick. Both declarations survive the build's CSS minifier (checked in `dist/`) |
| After | `"Play the AI" [pressed]`, `"4×4" [pressed]`, `"Medium" [pressed]`, `"Me" [pressed]`; exact lookup finds the button ([probe 009](probe-009.txt), `screenshots/issue-001-after.png`); the tick still shows in all six modes (`screenshots/screens-final/*-setup-custom.png`) |
| Fix status | verified (probes 009-012) |
| Regression check | `themes-test.mjs` (throwaway, outside the repo): "pressed buttons are named by their label alone (no tick)" in every theme and mode, green in probe 011. The repo has no UI test framework, so this stays coverage debt. Value: protects=segmented buttons' names equal their labels; fails_when=generated content enters the name again; why_new=no check read accessible names; seam=none; no_claim=what a real screen reader announces (Chromium's tree only) |

## Console Health

| Error | Count | First seen |
|-------|-------|------------|
| none (blocked Firebase requests logged by design: 15 in probe 011, 60 in probe 012, not counted) | 0 | |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 1 (fixed) |
| **Total** | **1** |

## Notes for the design review (not issues)

- On a phone, three screens are taller than the screen in every theme: Home with the Continue card and the offline banner (about 175 px), Setup with Custom open (133-148 px) and My stats (about 500 px). This PR changes no layout; the spec's responsive step (4) covers it, and the design review compares with main.
- `screenshots/initial-*.jpg` look faded because they were taken during the screens' 0.32 s entrance fade, which main has too.
- Paper's body font (Atkinson Hyperlegible) has a slashed zero by design, so "100 XP" reads "1ØØ XP" at a glance.

## Limits

- Touch was emulated (Chromium hasTouch at 390x844); no real phone, no Brave, no screen reader. Accessible names come from Chromium's accessibility tree.
- Firebase was blocked, so the app ran on its local adapter with the offline banner; online play and the live leaderboard were not exercised (no data-layer change in this PR).
- Performance was not measured here (separate /benchmark).
- Checkpoint 004's observationCommand names probe 002's command by mistake; its observed text is probe 003's output, which is the right one. Published checkpoints are never edited, so it stays as written.
- The ISSUE-001 regression check was added after the repair; its red evidence is the same exact-name lookup failing on the old build (probes 004-006), not a red run of the new check.
- Probe 007's three bad-settings failures were a test error (a colour read before the stylesheet applied); the test was corrected narrowly and probe 008 reran the same command.
- Cleanup: the preview on 4173 keeps running for the design review and the benchmark.

## Fixes Applied

| Issue | Commit | Files | Status |
|---|---|---|---|
| ISSUE-001 | 9e4d256 | `src/app.css` (1 rule, 1 comment line) | verified |

## Ship Readiness

Ready for the design review and the benchmark. `npm run check` 0 errors and 0 warnings after the fix; build passes.

**PR Summary:** QA found 1 issue, fixed 1, health score 99 → 100.

## Recheck after the design review (06d45e5)

The design review then made eight CSS fixes (01c2c74 to 06d45e5: label size, hover, level-up chip, theme card text, the ampersand, Neon rings, ticks only in Paper, Paper avatar stickers). Rerun on that build, same isolation and driver, outside this report's probe budget: `themes-test.mjs` 37/37 (including the ISSUE-001 regression check), `themes-screens.mjs` 108/108, `themes-edge.mjs` 9/9, `qa-r1a.mjs all` 31/31. No console errors.
