# QA Report: Grid Rivals (Dots & Boxes): the spec's step 5, dialogs

| Field | Value |
|-------|-------|
| **Date** | 2026-10-21 |
| **URL** | http://127.0.0.1:4173/ (`dist-step5`, this branch) beside http://127.0.0.1:4174/ (`dist-step4`, #26); emulator build `dist-emu-step5` on 127.0.0.1:4175 with the local Firebase emulators |
| **Branch** | design/11-dialogs, uncommitted working tree on `634f519` (PR #28's fix, whose tree is #26's tested tip; the owner's rule is one commit per task, so nothing is committed during QA) |
| **Commit** | none yet |
| **PR** | — (opened after the gates) |
| **Tier** | Standard |
| **Scope** | Diff-aware: the results dialog (a native modal per theme, Paper's scorecard), the themed confirm in place of all five confirm() calls, the confetti inside the dialog, Tab kept inside dialogs; adjacent: resume, the game's top bar, the HUD, theme switching, drags, online play |
| **Probe budget / guarded command time** | 900 s / about 11.5 min of guarded probes (14 probes, 13 checkpoints); required rechecks ran after it with fixed timeouts |
| **Pages visited** | 6 screens (Home, Settings, the game, its results, the online game and its results) at 13 viewports |
| **Screenshots** | about 200 (`browser/screenshots/`) |
| **Framework** | Svelte 5 SPA (Vite) |

Driver: gstack's bundled Playwright with its headless Chromium 151 (Aside is macOS-only); the gstack preamble hung after its first lines and ran in degraded mode. Production Firebase blocked by hostname in every context. Charters: [charters.md](charters.md).

Checkpoints: [checkpoint 001](browser/exploration-001.json), [checkpoint 002](browser/exploration-002.json), [checkpoint 003](browser/exploration-003.json), [checkpoint 004](browser/exploration-004.json), [checkpoint 005](browser/exploration-005.json), [checkpoint 006](browser/exploration-006.json), [checkpoint 007](browser/exploration-007.json), [checkpoint 008](browser/exploration-008.json), [checkpoint 009](browser/exploration-009.json), [checkpoint 010](browser/exploration-010.json), [checkpoint 011](browser/exploration-011.json), [checkpoint 012](browser/exploration-012.json), [checkpoint 013](browser/exploration-013.json).

Evidence tool: materialized, verdict **inconclusive (open: no evidence rows)**. This was a browser-only run and the tool counts only functional captures; the browser results are below.

## Health Score: 100 → 100 (provisional: Performance is /benchmark's; Links untouched by this diff, not scored)

| Category | Baseline | Final |
|----------|----------|-------|
| Console | 100 (0 errors) | 100 |
| Links | not scored | not scored |
| Visual | 100 | 100 |
| Functional | 100 | 100 |
| UX | 100 | 100 |
| Performance | not scored | not scored |
| Accessibility | 100 (modal dialogs named by their titles, focus on the safe or main action, Tab kept inside, labelled level bar) | 100 |

## Top 3 Things to Fix

None: QA found no product defect. (The design review before it fixed two layout issues; three defects found while building, a click on the confirm's own padding closing it, Tab leaving the dialogs and the results scrolling on sideways phones, were fixed before QA and are rechecked here.)

## Console Health

No errors on any screen in any probe (page-error hooks in every script; the suites also fail on console errors).

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

## Contracts

| # | Contract | Result | Evidence |
|---|---|---|---|
| C1 | The themed confirm in place of confirm() | **pass**: 96/96 in six modes (Quit, Esc, focus back on Quit, Restart, the logo with and without its note, Leave keeps the game for Home, Discard and Keep it, Reset my stats with a click outside and Delete, a question dismissed when the AI's last line ends the game); padding clicks 3/3 stay open; no browser dialog anywhere | probes 1, 13; `browser/probe-001.txt`, `probe-013.txt` |
| C2 | The results as a modal | **pass**: 70/70 in six modes (named by its title, Play again focused, Esc twice ignored, Tab and Shift+Tab inside, labelled progressbar, Play again by Enter, Change settings, Leaderboard, Paper's card re-placed after turning the phone); Tab wrap in the theme sheet and the confirm, both directions | probes 7, 12 |
| C3 | The results fit every screen | **pass**: 120/120 (six modes; 320x568, 390x844, 844x390, 768x1024, 1440x900; win, loss, level up, pass and play): nothing scrolls or leaves the screen, every label inside its button, panels centred | recheck `browser/recheck-results.txt` |
| C4 | Online results | **pass**: the guest's final tap under where Leave opens presses nothing, Rematch works after it (6/6); step 4's online suite 23/23 (notes in the chips' place, Leave, rematch) | probe 6, recheck `recheck-online-new.txt` |
| C5 | Confetti | **pass**: inside the dialog, the screen's size at 1x and 2x, the burst centred (x≈198 of 390; #26's build at 2x: a 780x1688 canvas, the burst at x=407, off the screen); once on a win, none on a loss, a draw or with Animations off (4/4) | probe 14, recheck `recheck-confetti-none.txt` |
| C6 | Earlier behaviour | **pass**: hud/flow 52/52, hud/edge 76/76, theme-switch 19/19, drag-test 88/88, the top bar 14/14 (its brand test on the themed dialog), qa-r1a 29/31 and integrity-r1a 33/35 (see below) | probes 2-5, 8-11, recheck `recheck-edge.txt` |

### The suites that answered confirm()

`qa-r1a` and `integrity-r1a` accepted every browser confirm; their step-5 copies (`step5/qa-r1a5.mjs`, `step5/integrity-r1a5.mjs`) answer the themed dialog yes the same way. One check needed a narrow correction: B6 read the saved game on the line right after clicking Discard, which worked only while confirm() blocked. It failed on the exact replay too (deterministic), then passed once the copy waits for the answer to land (up to 3 s); probe 1 had already shown Discard removing the game. The top-bar suite's brand test moved onto the themed dialog (`step5/topbar-check5.mjs`).

### Known flakes, not from this change

A2 and A4 (qa-r1a) and I5b (integrity-r1a) race the AI's reply after a reload: they failed in 2 of 3 and 1 of 1 runs here, and on #26's build A2 and A4 failed in 1 of 2 runs (I5b passed there this time). They are the same misses recorded since #25.

## Not covered

- Browsers other than Chromium 151 headless; real phones; a real screen reader (the accessibility tree was read through Playwright's ARIA snapshot).
- Online results on the 320 px phone and sideways (covered offline, same component).
