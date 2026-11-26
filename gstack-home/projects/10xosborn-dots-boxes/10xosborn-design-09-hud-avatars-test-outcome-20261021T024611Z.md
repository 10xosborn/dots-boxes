# QA Report: Grid Rivals (Dots & Boxes): the spec's step 3 HUD

| Field | Value |
|-------|-------|
| **Date** | 2026-10-21 (started 2026-10-20 23:52 UTC) |
| **URL** | http://127.0.0.1 (production builds served by the scratchpad's `serve-two.mjs`: `dist-hud2` = ac8e192 before the fixes, `dist-hud3` = the fixes, now commit e4226a8; #23's `dist-glass-A` beside it; the emulator build `dist-emu-hud` on :4175 for online play) |
| **Branch** | design/09-hud-avatars (stacked on #23, base `design/08-liquid-glass`) |
| **Commit** | e4226a8 (the step's single commit; QA's two fixes folded in, the owner's one-commit-per-task rule) |
| **Tier** | Standard (fixes critical, high and medium) |
| **Scope** | Diff-aware: player cards with avatars, the extra-turn cue, Paper's score sheet and note, the top bar's level chip, the profile card, Online's HUD |
| **Exploration budget** | 900 s (deadline guard), 5 checkpoints; the regression suites and online play ran after it as explicit plan checks |
| **Driver** | gstack's bundled Playwright with its headless Chromium 151 (Aside is macOS-only); Firebase blocked by hostname, online on the local emulators |
| **Framework** | Svelte 5 SPA (Vite) |

Charters: [charters.md](charters.md). Checkpoints: [001](browser/exploration-001.json), [002](browser/exploration-002.json), [003](browser/exploration-003.json), [004](browser/exploration-004.json), [005](browser/exploration-005.json).

## Health Score: 98 → 100 (provisional: Performance is scored by /benchmark; Links untouched by this change, not scored)

| Category | Baseline | Final |
|----------|----------|-------|
| Console | 100 (0 errors) | 100 |
| Visual | 92 (ISSUE-002) | 100 |
| Functional | 100 | 100 |
| UX | 92 (ISSUE-001) | 100 |
| Content | 100 | 100 |
| Accessibility | 100 | 100 |
| Performance | not scored | not scored |

## Issues

### ISSUE-001: Paper's turn note lost "go again!" with a long name (Medium, UX) — fixed, verified

**Repro:** Paper (day or night), pass and play with a 16-letter player ("Akosua Asantewaa"), she closes boxes, on a 390x844 or 360x640 phone. The note read "Akosua Asantewaa closed 6 boxes, go …": the line's ellipsis took the end of the sentence, which is the extra-turn cue itself. Confirmed by exact replay (the 360 px screenshot byte-identical) and at 390 px.
**Cause:** the note was one inline line with `text-overflow: ellipsis`, which always cuts the end.
**Fix:** the mover's name truncates (`.who`), the rest of the note never shrinks (`.rest`), with 3 px of room for the highlighter's hand-cut edge: now "Akosua … closed 6 boxes, go again!". Files: `src/components/PlayerCards.svelte`, `src/app.css`.
**Evidence:** `hud/edge.mjs` "ISSUE-001" checks red 4/4 on the old build (Paper day and night, 360 and 390), green after; screenshots `hud/qa-edge2/paper-dark-390.png` (before), `hud/qa-green2/sheet.png` (after).

### ISSUE-002: the top bar grew wider than the screen with a long name (Medium, Visual) — fixed, verified

**Repro:** a 16-letter profile name ("Kwabena Mensah-B"), Home or a game, 360x640 phone: the page became 370 px wide in Tabletop and Neon and 398 px in Paper (397 at 390 px in Paper, where "Lv 1" also broke onto two lines), so the page scrolls sideways. #23's build stays at the screen's width with the same name, so this branch introduced it (its chip is wider: the avatar ring, the name in 15 px, Paper's name and level side by side).
**Cause:** nothing in the chip could shrink: `.tb-right`, `.lvl-chip` and `.lvl-txt` kept their content's width, and the name kept its 9em in its column.
**Fix:** the chip shrinks (`min-width: 0` down the chain), its name truncates to whatever room is left (`max-width: min(9em, 100%)`), "Lv 1" never wraps, and the brand stays on one line, so the top bar keeps its 48 px. With the same name the bar is now 48 px in every mode at 360 px; on #23 the brand wrapped (two lines in Tabletop and Paper, a 56 px bar in Paper). File: `src/app.css`.
**Evidence:** `hud/edge.mjs` "ISSUE-002" checks red 8/8 (page 370/398/397 px), green after; `hud/topbar.mjs` before and after.

## Results by charter

| # | Contract | Result |
|---|---|---|
| C1 | Cards and avatars in all six modes and six states | 36/36 states render with no overflow (`hud-shots.mjs`); both cards one height with two-digit scores |
| C2 | The extra-turn cue in real play | 52/52 (`hud/flow.mjs`: no cue before a capture, the cue, "Extra turn." in the live region, ×2, the cue gone when the turn passes, the board never moves: 251 px, 242 in Paper); the cue after a reload into an extra turn (saved games) |
| C3 | Paper's sheet with long names and big scores | 76/76 after the fixes (`hud/edge.mjs`, 360 and 390 px, 13-13 on 6x6): 40 px lines, names truncate, tallies and scores stay on the sheet (the tallies give way to a long name, by design) |
| C4 | The top bar's chip | label "Ama, level 1. Open your stats" (#23: "Level 1. Open your stats"); fits every screen after ISSUE-002 |
| C5 | Profile card | avatar on Home in every mode; Dark Neon's profile disc was Electric Violet on #23 (the tiles' colour), now magenta-red |
| C6 | Online | 8/8 on the emulators (`hud/online-hud.mjs`): the host's pill "Your turn · +1 extra turn" and "×2", the guest's note "Player closed a box, goes again.", each screen right when the turn passes; nothing reached production |
| C7 | Accessibility | avatars `aria-hidden` (3 per game screen); text on the HUD's own surfaces 5.89:1 to 14.28:1 (pill text 12.38 and 14.28, Paper's note 13.29 and 8.10, notes 6.40 and 5.89, highlighter 11.29); keyboard-only game 24/24 lines (integrity I4) |
| C8 | Responsive | 360x640, 390x844, 1280x800; one line in the pill from 520 px of bar (desktop), the cue under the turn on phones |
| C9 | Theme switch during an extra turn | Tabletop → Paper → Dark Neon → Paper at night: the cue kept in each theme's form, no errors (22/22, `hud/switch.mjs`) |
| C10 | Animations off | no animation running in the HUD after each switch |

## Regression suites (final build)

integrity 34/35 and resume 29/31 on the first pass (see below), then 16/16 (I5) and 31/31 on a replay; sounds and cursor 20/20, hover 8/8, marks 63/63, theme switched mid-game 22/22, theme switching 19/19, elastic band 75/75, drag 88/88, drag edges 10/10, paint 0/36 unpainted; `npm run check` 0/0, theme tests 7/7.

**Not a regression, a probe race:** integrity-r1a's I5b ("reload at move 10 → the same board") and qa-r1a's A2/A4/A5 read the board right after a reload into the AI's turn and race the AI's 250-450 ms pause (PR #20 shortened it). On #23's build the same probes failed I5b in 3 of 3 runs and A2/A4 in 1 of 3; on this branch they failed in the first pass and passed on a replay. The game is right in every run; the probes need to hold the AI (as `hud-shots.mjs` does with a silent worker) before reading.

## Probe updates (not product changes)

`theme-switch.mjs` expected #19's colours: updated to Neon's glass board (#23) and Paper's line colours (#22) (13/19 → 19/19 on both builds). `hud/switch.mjs` now measures the highlighter's text against `--highlight` (its swipe is a background image). New probes in the scratchpad's `hud/`: `hud-shots.mjs`, `flow.mjs`, `edge.mjs`, `topbar.mjs`, `switch.mjs`, `online-hud.mjs`, `dumps.mjs`, `sheet.mjs`.

## Fixes applied

| Issue | Status | Commit | Files |
|---|---|---|---|
| ISSUE-001 | verified | e4226a8 (folded) | src/components/PlayerCards.svelte, src/app.css |
| ISSUE-002 | verified | e4226a8 (folded) | src/app.css |

Regression coverage: both are layout defects, which the repo's tests (Vitest, no DOM) can't see; the browser checks in `hud/edge.mjs` are the regression evidence (red before, green after). No browser test infrastructure in the repo: coverage debt, as for earlier UI PRs.

> QA found 2 issues, fixed 2, health score 98 → 100 (provisional; performance in /benchmark).
