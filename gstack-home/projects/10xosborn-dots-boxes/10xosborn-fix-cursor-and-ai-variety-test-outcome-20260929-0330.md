# QA Report: Grid Rivals (Dots & Boxes)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-29 |
| **URL** | http://127.0.0.1:4173/ (`vite preview` of the production build); live site for the "before" repro |
| **Branch** | fix-cursor-and-ai-variety |
| **Commit** | c256d31 |
| **PR** | not opened yet |
| **Tier** | Standard |
| **Scope** | Diff-aware: game board input (mouse, touch, keyboard), Hard AI on 3×3 and custom boards |
| **Duration** | about 25 minutes |
| **Pages visited** | Home, Setup, Game (3×3, custom 5×7, custom 5×4), Results |
| **Screenshots** | 20 |
| **Framework** | Svelte 5 SPA (Vite) |

## Health Score: 94 → 100

| Category | Before | After |
|----------|--------|-------|
| Console | 100 | 100 |
| Links | 100 | 100 |
| Visual | 77 | 100 |
| Functional | 92 | 100 |
| UX | 85 | 100 |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |

## Console Health

No console errors in any run. In the Playwright runs Firebase was blocked on purpose (so no test data reached production); the app showed its "Could not reach Firebase" banner and saved to the device, as designed.

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 1 |
| Medium | 2 |
| Low | 0 |
| **Total** | **3** |

## Issues

### ISSUE-001: Keyboard cursor stays on the board during mouse or touch play (reported)

| Field | Value |
|-------|-------|
| **Severity** | high |
| **Category** | visual / ux |
| **URL** | Game screen, any board |

**Description:** Clicking or tapping focuses the board, and focus drew the keyboard cursor: a thick faded line (on 3×3, the bottom edge of the centre box) that stays all game.
**Repro (live site):** Play → Play the AI → 3×3 → Hard → Start game → click a line. Result: board state `cursor: 1` and the faded line is visible (`live-before-3x3-mouse.png`).

### ISSUE-002: Browser focus ring around the board after a click or tap (found by QA)

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | visual |
| **URL** | Game screen, any board |

**Description:** After a click or tap, the board keeps a white ring (computed `outline: auto 5px`), Chromium's default focus ring for focused SVG, for the rest of the game. Same trigger as ISSUE-001. Keyboard focus should keep the app's accent outline.
**Repro (live site):** same steps as ISSUE-001 (`live-before-3x3-mouse.png`, `desktop-3x3-mouse-2.png`).

### ISSUE-003: Hard AI opens the same way after every restart on 3×3 (reported)

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | functional / ux |
| **URL** | Game screen, 3×3, Hard |

**Description:** The opening book stored one move per position, so Hard's opening never changed.

## Fixes Applied

| Issue | Fix Status | Commit | Files Changed |
|-------|-----------|--------|---------------|
| ISSUE-001 | verified | c7be6c7 | src/components/Board.svelte |
| ISSUE-002 | verified | c256d31 | src/app.css |
| ISSUE-003 | verified | b8c58e6 | src/lib/engine/ai-core.js, scripts/opening-book.mjs |

### Verification (36/36 checks, final build)

- **Desktop 3×3 (1280×800):** hover shows the dashed preview; clicks draw lines with no cursor and no ring, before and after the AI replies; Tab back to the board shows the cursor and the accent outline; arrows move the cursor; Enter draws exactly the line under it; the cursor stays through AI replies in keyboard play; a click hides it again; a hidden cursor is shown by the first Enter without drawing, then Space draws; hover preview still works afterwards.
- **Desktop custom 5×7:** same mouse and keyboard checks pass.
- **Phone 390×844, real touch taps (3×3 and custom 5×4):** taps draw lines; board focused but no cursor, no ring, no stuck preview, before and after AI replies.
- **Whole 3×3 game against Hard with the keyboard only:** reaches the results screen.
- **Hard moving first:** 12 new games gave 9 to 10 different opening lines per run; the Restart button gave 5 to 18 different openings per run (16 restarts: 11 different; 30 restarts: 18 different).
- Screenshots: `pw-A1-desktop-hover`, `pw-A3-desktop-mouse-play`, `pw-A4-desktop-keyboard-focus`, `pw-A7-desktop-keyboard-play`, `pw-B2/B5-desktop-custom-*`, `pw-C-phone-touch-33`, `pw-D-phone-touch-custom54`, `pw-E-keyboard-full-game`, `pw-F-hard-first-move-game1/2`.

## Regression Tests

No test framework in the repo (the owner has automated tests on the "Next up" list, not chosen yet), so no test files were added. The AI change ships with `node scripts/opening-book.mjs --check`, which checks the book and the Hard AI against a full solve of every 3×3 position and plays Hard vs Hard.

## Tooling notes

- Round 1 used the gstack browse CLI (desktop mouse play, live-site repro, the focus-ring finding). On this Windows machine the CLI kept replacing its own server: its health check (`page.evaluate("1")` with a 2-second limit) failed now and then, and each restart killed the running browser and lost the game. After that, the scenarios were driven with gstack's bundled playwright-core 1.58.2 and Chromium, which also allowed real touch taps (`hasTouch`) and blocking Firebase.
- One early run showed a stale opening reading after Restart. It did not reproduce in 46 instrumented restarts (each showed the confirm dialog and cleared the board) or 4 more full runs; treated as a harness timing glitch.

## Ship Readiness

| Metric | Value |
|--------|-------|
| Health score | 94 → 100 (+6) |
| Issues found | 3 (2 reported, 1 found by QA) |
| Fixes applied | 3 (verified: 3) |
| Deferred | 0 |

**PR Summary:** "QA found 3 issues, fixed 3, health score 94 → 100."
