# QA Report: Grid Rivals (Dots & Boxes): the spec's step 4, responsive layout

| Field | Value |
|-------|-------|
| **Date** | 2026-10-21 |
| **URL** | http://127.0.0.1:4173/ (`dist-step4`, this branch) beside http://127.0.0.1:4174/ (`dist-turns`, #25); emulator build `dist-emu-step4` on 127.0.0.1:4175 with the local Firebase emulators |
| **Branch** | design/10-responsive, uncommitted working tree on #25 `4613e6f` (the owner's rule: one commit per task, so fixes are not separate commits) |
| **Commit** | none yet (final build's index CSS `ecf63fd68d4b`) |
| **PR** | — (opened after the gates) |
| **Tier** | Standard |
| **Scope** | Diff-aware: game screens (column, side by side, Paper's spread), Home, the online game's notes, boardFit.ts / fits() and the size picker, the top bar the game screens now draw, the floating notice |
| **Probe budget / guarded command time** | 900 s / about 9 min of guarded probes (7 checkpoints); required rechecks ran after expiry with fixed timeouts |
| **Pages visited** | 7 screens (Home, Setup, the online lobby, the game in three layouts, the online game) at 20+ viewports |
| **Screenshots** | about 70 (`browser/screenshots/`) |
| **Framework** | Svelte 5 SPA (Vite) |

Driver: gstack's bundled Playwright with its headless Chromium 151 (Aside is macOS-only; the `$B` CLI loses its page every minute or two on this PC). Production Firebase blocked by hostname in every context: 0 requests. Charters: [charters.md](charters.md).

Checkpoints: [checkpoint 001](browser/exploration-001.json), [checkpoint 002](browser/exploration-002.json), [checkpoint 003](browser/exploration-003.json), [checkpoint 004](browser/exploration-004.json), [checkpoint 005](browser/exploration-005.json), [checkpoint 006](browser/exploration-006.json), [checkpoint 007](browser/exploration-007.json).

Evidence tool: materialized, verdict **inconclusive (open: no evidence rows)**. This was a browser-only run and the tool counts only functional captures; the browser results are below.

## Health Score: 97 → 100 (provisional: Performance is /benchmark's; Links untouched by this diff, not scored)

| Category | Baseline | Final |
|----------|----------|-------|
| Console | 100 (0 errors) | 100 |
| Links | not scored | not scored |
| Visual | 92 (ISSUE-002) | 100 |
| Functional | 92 (ISSUE-001) | 100 |
| UX | 100 | 100 |
| Performance | not scored | not scored |
| Accessibility | 100 (keyboard to the board, focus ring on the spread, 44 px targets) | 100 |

ISSUE-003 (low, Visual) was found during the final pass, after the baseline score; it is fixed.

## Top 3 Things to Fix

All three are fixed and verified:

1. **ISSUE-001: the size picker allowed boards whose dots end up under 40 px on small phones.** boardFit read the widened layout viewport instead of the screen.
2. **ISSUE-002: Setup's Custom steppers overflowed on 320-360 px phones,** so the page panned sideways (also on #25).
3. **ISSUE-003: the floating notice covered the top of the player cards on phones.**

## Console Health

No errors on any screen in any probe (the page-error and console-error hooks were on in every script).

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 2 |
| Low | 1 |
| **Total** | **3** |

## Contracts (final build)

| # | Contract | Result |
|---|---|---|
| C1 | Game screens fit and boardFit predicts the real board | fit-check 180/180 (9 viewports × 4 modes × 5 shapes: predicted = measured dot gap within 1 px, no scroll); before QA 420/420 on 21 viewports |
| C2 | The picker's limits are what fits, follow the theme, work in the lobby | picker-check 24/24 (largest board ≥ 40 px and one more row < 40 px at 320-1280 px; Tabletop 9x11 → Paper's spread 12x12 → back to 9x10; the lobby) |
| C3 | Rotation mid-game; input on every layout | dr-flow 10/10 (board box restored exactly; tap and mouse drag; Tab to the board, focus ring on the spread) |
| C4 | Online notes take the chips' place; boards still; Leave after 2 minutes | online-r1b4: 23/23 and 4/4, 0 production requests |
| C5 | Home fits phones upright and sideways | 36/36 screens (3 modes × 6 viewports × with and without a saved game): no scroll, no widening |
| C6 | The game's own top bar and the floating notice | topbar-check 14/14; notice-overlap 30/30 (6 modes × 5 sizes: the notice ends above the cards, Dismiss 44 px) |
| C7 | Earlier behaviour | hud/flow 52/52, hud/edge 76/76, theme-switch 19/19, drag-test 88/88, qa-r1a 31/31, integrity-r1a 34/35: the resume checks A2, A4 and I5b race the AI's 250-450 ms reply after a reload and failed on #25's build too in this session (qa-r1a 29/31 twice, I5 14/16 on both builds), the known flake |
| — | Static | `npm run check` 0 errors 0 warnings; `npm run build`; `npx vitest run tests/layout tests/theme` 11/11 |

## Issues

### ISSUE-001: the size picker allowed custom boards whose dots end up under 40 px on small phones

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | functional |
| **URL** | Setup → Board size → Custom (and the online lobby's picker) |

**Description:** On a 360x640 Neon phone the steppers reached 7x6, and that game showed dots 38.3 px apart; on a 320x568 Paper phone 5x6 gave 39.4 px (MIN_TAP_PX is 40). Expected: the largest board the picker offers keeps dots 40 px or more apart. Cause: `boardFit.ts` measured the screen with `innerWidth`/`innerHeight`, which follow the layout viewport; once Setup's steppers overflowed (ISSUE-002), the phone widened that viewport to 373x664 (335x595), so the board looked bigger than the game screen would make it. #25's build had it too (it offered 5x6 at 39.4 px on the same Paper phone). Prior learning applied: mobile-overflow-widens-viewport (confidence 9/10, from 2026-10-21).

**Repro:** a 360x640 phone, Neon by day → Play → Custom → press More rows and More columns until both stop (7x6) → Start game → dots 38.3 px apart. Confirmed by the exact replay (checkpoint 002); minimized in picker-debug.mjs (innerWidth 360 → 373 when Custom opens).

**Fix:** boardFit measures the screen from the visual viewport at no zoom (`visualViewport.width × scale`, capped by `innerWidth`), so neither a widened page nor pinch zoom changes what fits. Files: `src/lib/boardFit.ts`.

**Evidence:** `browser/screenshots/issue-001-before-paper-320x568-result.png` (#25: 5x6, 39.4 px), `issue-001-after-neon-360x640-result.png` (6x6, 44.7 px), `issue-001-after-paper-320x568-result.png` (5x5, 41.0 px); picker-check 22/24 → 24/24.

### ISSUE-002: Setup's Custom steppers overflowed on 320-360 px phones

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | visual |
| **URL** | Setup → Custom |

**Description:** Rows and Columns sat side by side in two equal columns; Neon's wide numbers (a 164 px stepper at 360 px) and Paper at 320 px did not fit, the Columns stepper ran past the screen's edge and the page panned sideways. Also on #25's build. **Fix:** the steppers wrap onto separate lines when their content doesn't fit side by side (`flex-wrap`, `min-width: max-content`): no breakpoint to guess per theme. Files: `src/components/SizePicker.svelte`. **Evidence:** `issue-002-before-*.png` (#25) and `issue-002-after-*.png`; setup-wide: Setup's viewport stays the screen's size on every phone checked (#25 still 373x664 and 335x595).

### ISSUE-003: the floating notice covered the top of the player cards on phones

| Field | Value |
|-------|-------|
| **Severity** | low |
| **Category** | visual |
| **URL** | any game screen while a notice shows (Firebase unreachable) |

**Description:** Found when theme-switch reloaded into a game: the offline notice ("Could not reach Firebase, so results are saved on this device for now.") wrapped to two lines with its Dismiss button underneath (78 px), so it covered the top of the cards, not just the top bar. **Fix:** on game screens the notice is one row, text then Dismiss (44 px tall) at the right, in tighter lines, a little higher; the Dismiss button's inline style moved into the stylesheet. Files: `src/app.css`, `src/components/TopBar.svelte`. **Evidence:** notice-overlap 18/30 → 30/30 (its bottom edge above the cards or score sheet at 320-1280 px in every mode); `topbar-390x844-notice.png`, `issue-003-after-*.png`. The notice still covers the top bar until dismissed (by design: it never moves the board; Quit stays reachable); theme-switch's fixture now dismisses it after its reload.

## Fixes Applied

| Issue | Fix Status | Commit | Files Changed |
|-------|-----------|--------|---------------|
| ISSUE-001 | verified | in the task's single commit | src/lib/boardFit.ts, tests/layout/boardFit.regression-1.test.ts |
| ISSUE-002 | verified | in the task's single commit | src/components/SizePicker.svelte |
| ISSUE-003 | verified | in the task's single commit | src/app.css, src/components/TopBar.svelte |

## Regression Tests

| Issue | Test File | Status | Description |
|-------|-----------|--------|-------------|
| ISSUE-001 | tests/layout/boardFit.regression-1.test.ts (`npx vitest run tests/layout`) | in the task's commit | red before the fix (3 failed: 41.1, 41.4 and 63.5 px from the widened viewport), green after (4 passed) |
| ISSUE-002 | — | skipped | CSS-only: browser evidence (setup-wide, screenshots) |
| ISSUE-003 | — | skipped | CSS-only: browser evidence (notice-overlap) |

Value: protects=fits() judges the phone's screen, not a layout viewport an overflowing page widened; fails_when=boardFit reads innerWidth/innerHeight alone again or drops the zoom scale; why_new=no unit test covered boardFit (its browser fit-check lives outside the repo); seam=none; no_claim=a real browser's widening and safe-area insets (window, visualViewport and document stubbed; unit only)

## Ship Readiness

| Metric | Value |
|--------|-------|
| Health score | 97 → 100 (+3, provisional) |
| Issues found | 3 |
| Fixes applied | 3 (verified: 3, best-effort: 0, reverted: 0) |
| Deferred | 0 |

**PR Summary:** "QA found 3 issues, fixed 3, health score 97 → 100."

## Limits

- The evidence tool's verdict is inconclusive by construction (no functional captures in a browser-only run).
- Two diagnosis runs (picker-debug, setup-wide) ran outside the deadline guard between checkpoints 001 and 002; their finding was confirmed by the guarded replay.
- The 2-minute online scenario and the earlier suites ran after the budget, as required rechecks; everything the verdict relies on was rerun on the final build.
- One qa-r1a rerun on the branch printed no summary (most likely a browser launch failure); the run before it passed 31/31.
- Not covered: real phones and Safari (safe-area insets, the iOS toolbar's effect on 100dvh), production Firebase.
