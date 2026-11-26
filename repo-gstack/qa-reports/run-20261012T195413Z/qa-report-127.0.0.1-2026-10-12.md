# QA Report: Grid Rivals (Dots & Boxes), new palettes, materials and lighting

| Field | Value |
|-------|-------|
| **Date** | 2026-10-12 |
| **Branch / commits** | design/02-materials, 9b21b74 tested, fix 9501ba4 (base main 83e2c8b) |
| **PR** | not opened yet |
| **Tier / mode** | Standard; browser Full (diff-aware) |
| **Target** | Production build served by `vite preview` at http://127.0.0.1:4173/ (rebuilt and restarted before the run and after each repair) |
| **Isolation** | Every context aborts live Firebase hosts by hostname: the app runs on its local adapter, nothing reaches the live project. Fonts are self-hosted |
| **Driver** | gstack's own headless Chromium through gstack's bundled playwright-core 1.62.1 (phone 390x844 with touch at 2x; desktop 1280x800 or 1920x1080 with mouse and keyboard). Aside is macOS-only |
| **Budget / guarded command time** | 900 s / 357.3 s over 10 probes, none timed out; probing stopped with 54 s left because no remaining probe fitted |
| **Charters** | [charters.md](charters.md): C0-C11 |
| **Screenshots** | 53: orientation 3 (`initial-phone.jpg`, `initial-desktop.jpg`, `continue-card-phone.jpg`), materials 36 (24 board shapes, 6 cursors after the fix, 6 confetti), close-ups 12, ISSUE-001 after 2; texture-text saves only failing screens (none) |
| **Framework** | Svelte 5 SPA (Vite), Firebase 12 |

Prior learning applied: self-check-inherits-its-frames-blindspot (confidence 9/10, from 2026-09-19). The existing suites check contrast from tokens, a frame that cannot see the new textures, vignettes and glow, so this run added two probes that measure real pixels. One of them found ISSUE-001.

## Health Score: 98 → 99 (provisional)

| Category | Baseline | Final |
|----------|----------|-------|
| Console | 100 (0 errors; blocked Firebase requests that log `net::ERR_FAILED` by design are not counted) | 100 |
| Links | not scored (no links; navigation is buttons) | not scored |
| Visual | 100 (close-ups in six modes, odd board shapes, cursor, confetti reviewed) | 100 |
| Functional | 100 | 100 |
| UX | 100 | 100 |
| Performance | not scored (perf probe not reached; separate /benchmark) | not scored |
| Content | 100 | 100 |
| Accessibility | 89 (ISSUE-001 Medium, ISSUE-002 Low) | 97 (ISSUE-002 deferred) |

Baseline: (100 × 0.65 + 89 × 0.15) / 0.80 = 97.9 → 98. Final: (100 × 0.65 + 97 × 0.15) / 0.80 = 99.4 → 99. Provisional: no screen reader, no real phone.

## Evidence verdict: inconclusive (open: no evidence rows)

Final for this report root: a browser-only run produces no evidence rows. Results are in the probe outputs and checkpoints:

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json) · [checkpoint 005](exploration-005.json) · [checkpoint 006](exploration-006.json) · [checkpoint 007](exploration-007.json) · [checkpoint 008](exploration-008.json) · [checkpoint 009](exploration-009.json) · [checkpoint 010](exploration-010.json)

## Contracts

| # | Contract | Probe and result |
|---|---|---|
| C0 | Orientation: Home on Tabletop at phone and desktop size, the Continue card, no console errors | 001 ([output](probe-001.txt)): 6/6 |
| C1 | Text over the real materials (new probe): every text line on Home (banner, Continue card), Settings, Leaderboard, My stats, Setup, a game and the results dialog, six modes, both sizes, at 4.5:1 (3:1 large) against the pixels under it | 002 ([output](probe-002.txt)): 13/13; 151 lines per mode. Tightest: Paper by day's tagline on the desk 4.51:1, Tabletop by day's offline note on the Leaderboard 4.52:1, Neon by day's large score digit 4.17:1 (bar 3). Decorative avatar initials (aria-hidden) are lower, for example Neon at night's "R" at 2.28:1, and are not counted |
| C2 | The board's new structure (new probe): 1x1, 1x12 and 12x12 at 1920x1080 and 2x7 on a phone, six modes: one lane per line, one dot per point, inside the screen, wood rim only in Tabletop; one tap or click draws one line; bright cores only in Neon at night, one per line; a closed box has its rim and opacity; the game ends. No duplicate ids on Home, in a game, or with the theme sheet over it. Confetti uses only the theme's colours and removes its canvas. Keyboard cursor 3:1 | 003 ([output](probe-003.txt)): 79/85, the six failures all ISSUE-001; replayed exactly in 004 ([output](probe-004.txt)): identical apart from timestamps; minimized in 005 ([output](probe-005.txt)): 1/7. After the repairs: 006 ([output](probe-006.txt)) 6/7 (Tabletop at night still 2.54:1), 007 ([output](probe-007.txt)) 7/7 |
| C4 | Game integrity on the repaired board: a 5x5 game against Hard to the end, custom 7x7 on a phone and 12x12 on a large screen with reloads, a whole 3x3 game played with the keyboard only, reload and restart resume | 008 ([output](probe-008.txt)): 35/35 |
| C8 | Edges: bad saved settings paint Tabletop with the new bar colours (#e3b970, #2a1f18) before the app starts; Tab reaches the theme button with a visible outline in every theme | 009 ([output](probe-009.txt)): 9/9 |
| C11 | Board close-ups in six modes (felt and wood rim, glass and glow, paper) | 010 ([output](probe-010.txt)): captured and reviewed, nothing broken |
| C3, C5, C6, C7, C9, C10 | Themes suite, other screens, local games, viewports and colour vision, Ghanaian names, the materials' cost | not run inside this QA budget; run separately as PR checks (not QA evidence) |

## Top 3 Things to Fix

1. **ISSUE-001 (fixed and verified):** the keyboard cursor was too faint to see on every board.
2. **ISSUE-002 (deferred, Low):** the hover preview is below 3:1 in four modes; the next PR (drag from dot to dot) redraws the preview.

Nothing else found.

## Issues

### ISSUE-001: the keyboard cursor was too faint against the board

| Field | Value |
|---|---|
| Severity / category | Medium / Accessibility |
| Where | Every game board, all six modes, keyboard play (Tab to the board, then arrow keys) |
| Introduced by | Not new code: Board.svelte drew the cursor as a 2.4x-wide line in `--accent` at 35% opacity before this branch too (by the same formula about 1.6-1.7:1 on main's Tabletop by day and Neon at night, computed from main's tokens, not measured). This branch's palettes and surfaces move it to 1.36-2.38:1 from tokens, 1.4-1.88:1 from pixels, and to the lowest value of all (1.4:1) on the default theme |
| Actual (before) | Tabletop by day 1.36:1 (tokens) / 1.4:1 (pixels), Tabletop at night 2.38 / 1.82, Neon at night 1.86 / 1.88, Neon by day 1.7 / 1.71, Paper by day 1.68 / 1.71, Paper at night 1.83 / 1.58. WCAG 1.4.11 asks 3:1 for a state indicator; a sighted keyboard player can hardly see which line Enter will draw |
| Expected | The spec's shared rule: the keyboard cursor adds a focus ring in the theme's focus colour, 3:1 or more against the board |
| Repro | `materials-probe.mjs <dir> cursor` on 9b21b74 (probe 005): 4x4 pass-and-play at 1280x800, Tab to the board, ArrowRight, compare the cursor with the board beside it |
| Fix | 9501ba4: Board.svelte adds `rect.kbd-ring` round the cursor line (a capsule enclosing the line and its dots); app.css draws it as a 3 px non-scaling stroke in `--focus`, and in `--accent` (brass) for Tabletop at night, because the felt under the light from above is about rgb(96,110,105) there and turquoise reached only 2.54:1 (probe 006). The translucent band stays |
| After | Pixels: Tabletop by day 5.91:1, Tabletop at night 3.98, Neon at night 7.39, Neon by day 5.69, Paper by day 5.25, Paper at night 4.58 (probe 007); `screenshots/issue-001-after.png`, `screenshots/issue-001-after-table-dark.png` |
| Fix status | verified (probes 007-010 on the final build; a rebuild of 9501ba4 gives the same asset hashes) |
| Regression check | `materials-probe.mjs` (throwaway, outside the repo): "keyboard cursor stands out from the board (3:1)" in every mode, red on 9b21b74 (probes 003-005), green on 9501ba4 (probe 007). The repo has no UI test framework, so this stays coverage debt. Value: protects=the keyboard cursor reaches 3:1 against the board in all six modes; fails_when=the ring is removed, recoloured below 3:1, or the surface under it gets lighter; why_new=no check measured the cursor; seam=none; no_claim=Chromium at desktop 1x only; other browsers and real screens not checked |

### ISSUE-002: the hover preview is faint in four modes (deferred)

| Field | Value |
|---|---|
| Severity / category | Low / Accessibility |
| Where | Mouse hover over a free line, desktop |
| Actual | The dotted preview in the mover's colour at 75%: Tabletop by day 1.94:1, Tabletop at night 2.16, Neon by day 2.71, Paper by day 2.6, Paper at night 3.01, Neon at night 3.43 (tokens, probe 003). Same code as main |
| Why deferred | The preview is extra help for mouse players (a click works without it), and the owner's next change, drawing by dragging from dot to dot, replaces this preview with a themed drag line. That PR must give it 3:1 |

## Console Health

| Error | Count | First seen |
|-------|-------|------------|
| none (blocked Firebase requests are logged by design and not counted) | 0 | |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 1 (fixed) |
| Low | 1 (deferred) |
| **Total** | **2** |

## Notes for the design review (not issues)

- The new cursor ring is brass in Tabletop at night while the board's own focus outline is turquoise: two colours on one board in that mode.
- Paper draws no lane guides between the dots in either mode, while Tabletop and Neon do; DESIGN.md's Materials section names guides only for Tabletop, so this looks intended.
- Neon at night's AI avatar initial reaches 2.28:1 (decorative, aria-hidden; the name beside it carries identity).

## Limits

- Touch was emulated (Chromium hasTouch at 390x844, 2x); no real phone, no Brave, no screen reader.
- Firebase was blocked, so the app ran on its local adapter with the offline banner; online play and the live leaderboard were not exercised (no data-layer change).
- The budget ran out before C3, C5, C6, C7, C9 and C10; they are not QA evidence here.
- texture-text skips SVG text (decorative box initials), input values and placeholders, and lists aria-hidden and disabled text apart.
- The cursor check samples pixels at desktop size (1x) in Chromium only, 6 px beyond the ring at the cursor's position.
- After the repair the cursor check measures the ring when one exists; on the old build it measures the band.
- The cursor screenshots were overwritten by the recheck runs (same names); the before evidence is the numeric output of probes 003-005.
- Cleanup: the preview on 4173 keeps running for the remaining checks, the design review and the benchmark.

## Fixes Applied

| Issue | Commit | Files | Status |
|---|---|---|---|
| ISSUE-001 | 9501ba4 | `src/components/Board.svelte` (1 element, 1 comment), `src/app.css` (2 rules) | verified |

## Ship Readiness

`npm run check` 0 errors and 0 warnings after the fix; build passes. Ready for the separate PR checks (C3, C5-C7, C9, C10), the design review and the benchmark.

**PR Summary:** QA found 2 issues, fixed 1 (1 Low deferred to the drag-to-draw PR), health score 98 → 99.
