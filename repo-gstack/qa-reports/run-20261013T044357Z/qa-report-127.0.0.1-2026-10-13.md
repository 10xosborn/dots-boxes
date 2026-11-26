# QA Report: Grid Rivals, drawing lines by dragging from dot to dot

| Field | Value |
|-------|-------|
| **Date** | 2026-10-13 |
| **Branch / commit** | feat/drag-to-draw at 6c6176f (code identical to f8f949e; the last commit is docs), base main 3eb4981 |
| **PR** | not opened yet |
| **Tier / mode** | Standard; browser Full (diff-aware) |
| **Target** | Production build served by `vite preview` at http://127.0.0.1:4173/ (`index-Bal4HcnW.js`, `index-B_pd92fR.css`) |
| **Isolation** | Every context aborts live Firebase hosts by hostname; nothing reaches the live project |
| **Driver** | gstack's own headless Chromium through playwright-core 1.62.1: mouse at 1280x800, real touch (CDP touch events, pointerType touch) and taps on a 390x844 phone |
| **Budget / guarded command time** | 900 s / 262.1 s over 7 probes, none timed out; stopped with 427 s left because every scoped contract was tested |
| **Charters** | [charters.md](charters.md): C0-C6 |
| **Framework** | Svelte 5 SPA (Vite), Firebase 12 |

## Health Score: 100 → 100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors; blocked Firebase requests are logged by design and not counted) |
| Links | not scored (no links) |
| Visual | 100 (drag states reviewed in all six modes) |
| Functional | 100 |
| UX | 100 |
| Performance | not scored (separate /benchmark) |
| Content | 100 |
| Accessibility | 100 (keyboard-only game passes; the hover preview now reaches 3:1 in every mode) |

Provisional: no real phone, no screen reader, and online play not exercised (see Limits).

## Evidence verdict: inconclusive (open: no evidence rows)

Final for this report root: a browser-only run produces no evidence rows. Results are in the probe outputs and checkpoints:

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json) · [checkpoint 005](exploration-005.json) · [checkpoint 006](exploration-006.json) · [checkpoint 007](exploration-007.json)

## Contracts

| # | Contract | Probe and result |
|---|---|---|
| C0 | Orientation: Home at phone and desktop size, no console errors | 001 ([output](probe-001.txt)): 6/6 |
| C1 | The gesture: drags right and down draw exactly those lines; a short drag, a drag onto a drawn line and a drag off the board draw nothing; the dragging line, the dot's ring and the snapped line's ring show; taps on lines draw; a tap right on a dot draws nothing; a tap near a dot along a line draws that line; the grab cursor; sounds pick 660 Hz, snap 990, line 520, cancel 330/262, silent with Sound off. All six modes with a mouse, two with real touch | 002 ([output](probe-002.txt)): 88/88 |
| C2 | Edges: a drag during the AI's turn draws nothing and the AI then moves once; a second finger mid-drag is ignored and the first finger's line is drawn once; letting go outside the board draws a snapped line and nothing otherwise; the hover preview is the mover's line colour at 3:1 or more in every mode | 003 ([output](probe-003.txt)): 10/10 |
| C3 | Game integrity: 5x5 against Hard to the end, custom 7x7 on a phone, 12x12 on desktop, a whole 3x3 game by keyboard only, reload and restart | 004 ([output](probe-004.txt)): 35/35 |
| C4 | Local games with touch taps and resume | 005 ([output](probe-005.txt)): 31/31 |
| C5 | Board structure, odd shapes, the keyboard cursor ring, confetti, ids; hover preview 3.31-8.7:1 (was 1.94-3.43:1 on main) | 006 ([output](probe-006.txt)): 85/85 |
| C6 | Themes and the picker in every mode, live token contrast | 007 ([output](probe-007.txt)): 37/37 |

## Issues

None found in this branch.

Resolved here: the previous PR's deferred **ISSUE-002** (the hover preview reached only 1.9-3:1 in four modes): the preview now uses the mover's line colour, 3.31:1 to 8.7:1 in every mode (probe 006), checked at 3:1 or more in probe 003.

**Intentional behaviour change (not an issue):** a tap right on a dot, where more than one free line meets, no longer draws an arbitrary line; taps on lines, and taps near a dot along a line, still draw. The local-games suite had made its moves by tapping dot centres, so its helper now taps just beside the dot on a line.

## Console Health

| Error | Count | First seen |
|-------|-------|------------|
| none (15 blocked Firebase requests in probe 007, logged by design) | 0 | |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

## Limits

- Online play was not exercised: it needs the Firebase emulators (Java), and this PC had about 1.4 GB free. The online screen renders the same Board component with the same `onmove` callback and `interactive` flag.
- Touch was emulated (CDP touch events and Playwright taps in Chromium); no real phone, no Brave, no screen reader.
- Sounds were checked by recording the oscillator frequencies the page starts, not by listening.
- Firebase was blocked; the app ran on its local adapter.
- The repo has no UI test framework; the browser checks are throwaway scripts outside the repo.

## Final commit re-run (7ff79a2)

After the design review's fix (the wider ring under a finger), every suite ran again on the final build (`index-Mt9-zyyv.js`, `index-B_pd92fR.css`; check 0/0, 148 files), outputs in [final-7ff79a2/](final-7ff79a2/):

| Suite | Result |
|---|---|
| The gesture, all six modes, mouse and touch (drag-test) | 88/88 |
| Drag edges (drag-edge) | 10/10 |
| Game integrity (integrity-r1a all) | 35/35 |
| Local games and resume (qa-r1a all) | 31/31 |
| Board structure, odd boards, cursor ring, confetti, hover preview contrast (materials-probe) | 85/85 |
| Themes and token contrast (themes-test) | 37/37 |
| Viewports, rotation, colour vision, reduced motion (acceptance-pr8) | 27/27 |
| Hover and press on every control (dr-hover) | 37/37 |
| Every other screen in every mode (themes-screens) | 108/108 |
| Ghanaian names (gh-names-test) | 30/30 |
| Text over the materials, from pixels (texture-text) | 13/13 |
| Bad saved settings, theme button focus (themes-edge) | 9/9 |

510 checks, 0 failures.

## Ship Readiness

`npm run check` 0 errors and 0 warnings; build passes. Ready for the design review and the benchmark.

**PR Summary:** QA found 0 issues (and confirmed last PR's deferred hover-preview contrast is fixed), health score 100 → 100.
