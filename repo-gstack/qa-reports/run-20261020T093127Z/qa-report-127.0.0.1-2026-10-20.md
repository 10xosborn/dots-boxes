# QA Report: Grid Rivals: the spec's step 2 board marks on the restyled modes

| Field | Value |
|-------|-------|
| **Date** | 2026-10-20 |
| **URL** | http://127.0.0.1:4173/ (production build of `3e7ea88`, served by serve-one.mjs) |
| **Branch** | design/07-board-marks (on main `10e07f1`) |
| **PR** | — (not opened yet) |
| **Tier** | Standard |
| **Scope** | Diff-aware: Board.svelte and HeroBoard.svelte (the last-move marks, Tabletop's person and bot, Paper's pencil by day, Neon's ring cores), app.css tokens; adjacent: board input (taps, drags, springs, edge cases), theme switching, game integrity |
| **Probe budget / guarded command time** | 900 s / 272.3 s (11 probes) |
| **Pages visited** | Home, Setup, Game in all six modes (phone 390x844 touch; desktop 1280x800 in the drag suites) |
| **Framework** | Svelte 5 SPA (Vite) |

Driver: gstack's own headless Chromium 151 through its bundled Playwright, one suite per probe (Aside is macOS-only).
Firebase blocked by hostname.

## Health Score: 99/100 (provisional: Console, Functional, Visual, UX, Accessibility tested; Performance in /benchmark)

| Category | Score |
|----------|-------|
| Console | 100 |
| Links | not tested |
| Visual | 100 |
| Functional | 100 |
| UX | 100 |
| Performance | not tested here (/benchmark) |
| Accessibility | 97 |

(1500 + 2000 + 1000 + 1500 + 1455) / 75 = 99.4, rounded to 99.

## Top things to fix

1. **ISSUE-001: Paper by day's coral lines are 2.99:1 on the textured sheet** (low, pre-existing, deferred)

No issue found in the branch's change.

## Results

| Probe | Suite | Result |
|---|---|---|
| 001 | marks-test2.mjs (updated for 2026-10-20: pencil and hatching by day only, ring cores in both Neon modes, the blue pip, Neon's ring centre) | 63/63 |
| 002 | marks-switch.mjs (new: the board now reads the theme from the app's settings; one game switched through five modes) | 22/22 |
| 003 | theme-switch.mjs | 19/19 |
| 004 | drag-test.mjs (mouse in every mode, real touch) | 88/88 |
| 005 | spring-test.mjs | 74/75: a test fixture error (below) |
| 006 | spring-test.mjs, expectation corrected | 75/75 |
| 007 | drag-edge.mjs | 10/10 |
| 008 | board-contrast.mjs | dots, lines and initials at 3:1+ in Tabletop, Paper at night and Neon; no Paper by day lines read (curves); Neon's 1.00 was the ring's centre |
| 009 | line-contrast2.mjs (new: lines along their middle, curves included, off the last-move mark) | Neon: dark 4.04 / 8.69, light 4.28 / 3.32 (worst p1 / p2); Paper by day p1 2.99, p2 5.09 |
| 010 | line-contrast2.mjs on main | Paper by day p1 2.99, p2 5.09: the same |
| 011 | integrity-r1a.mjs | 35/35 |

Test fixture error (probe 005): spring-test.mjs expected Paper's pencil width (0.06 of a gap) for the snapped band in
Paper at night, a leftover from when step 2 drew Paper in pencil in both modes. The agreed design keeps Paper at night's
die-cut strips at the full 0.085 (the band measured 17.4 px, the line width); the expectation now reads Paper by day.

## Console Health

No console errors or uncaught exceptions in any suite.

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 1 (pre-existing) |
| **Total** | **1** |

## Issues

### ISSUE-001: Paper by day's coral lines are 2.99:1 on the textured sheet

| Field | Value |
|-------|-------|
| **Severity** | low |
| **Category** | accessibility |
| **URL** | game screen, Paper by day |

**Description:** player 1's lines (--line1 #FC4422, the owner's coral) measure 2.99:1 against the sheet's median colour
from pixels (the paper texture darkens the cream #FCF8EF), a hair under the 3:1 non-text guideline; player 2's indigo is
5.1:1. Identical on main (probe 010), so not caused by the pencil lines. Suggested fix, the owner's call: a line-only coral
a shade deeper (about 5% darker reaches 3:1 over the texture).

---

## Fixes Applied

None in this run (no defect in the change; ISSUE-001 is Low and pre-existing, deferred under the Standard tier). The design
review's FINDING-001 fix (Tabletop's blue pip, `3e7ea88`) is what this run tested.

## Evidence

Evidence tool verdict: **inconclusive** (open: no evidence rows), by design for a browser-only run.

[checkpoint 002](exploration-002.json), [checkpoint 003](exploration-003.json), [checkpoint 004](exploration-004.json), [checkpoint 005](exploration-005.json), [checkpoint 006](exploration-006.json), [checkpoint 007](exploration-007.json), [checkpoint 008](exploration-008.json), [checkpoint 009](exploration-009.json), [checkpoint 010](exploration-010.json), [checkpoint 011](exploration-011.json)

Limits (also in annotations.json): 005 superseded by 006 after the fixture correction; 008's gaps measured by 009; Chromium
only, emulated phone; performance in /benchmark; no online game (Online passes the board the same props as before).

## Ship Readiness

| Metric | Value |
|--------|-------|
| Health score | 99 (provisional) |
| Issues found | 1 (low, pre-existing) |
| Fixes applied | 0 |
| Deferred | 1 |

**PR Summary:** "QA found 1 issue (low, pre-existing, deferred), fixed 0, health score 99 (provisional); 312 checks pass across 9 suites."
