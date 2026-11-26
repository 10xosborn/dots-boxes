# QA Report: Grid Rivals, the owner's 2026-10-19 colour changes

| Field | Value |
|-------|-------|
| **Date** | 2026-10-19 |
| **URL** | http://127.0.0.1:4173/ (branch build), main's build (288ab3a) on :4177 for B6; Firebase blocked by hostname |
| **Branch** | design/06-owner-colours |
| **Commit** | f793df3 (2026-10-19) |
| **PR** | — (opened after this report) |
| **Tier** | Standard |
| **Scope** | Tabletop at night and Cozy Paper at night (Sienna Brown with their day textures), Dark Neon (magenta-red and golden orange); Tabletop and Paper by day and White Neon must be untouched |
| **Probe budget / guarded command time** | browser 900 s guard (Full); 11 probes in about 8 minutes; functional unbounded, 4 captures with 300 s timeouts |
| **Pages visited** | Home, Setup, game, results, Settings, Leaderboard, My stats, the theme picker, in every mode as each probe needs |
| **Screenshots** | 41 in browser/screenshots |
| **Framework** | Svelte 5 SPA (Vite) |
| **Driver** | gstack's playwright-core with its headless Chromium, from scratchpad scripts (Aside is macOS-only; gstack's browse daemon restarts on Windows); phone 390x844 at 2x with touch, desktop 1280x800 |
| **Charters** | [charters.md](charters.md) |

## Browser: Health Score 100/100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 page errors; the only console errors are the deliberately blocked Firebase requests) |
| Links | not scored (the app navigates with buttons) |
| Visual | 100 |
| Functional | 100 |
| UX | 100 |
| Performance | 100 (each mode downloads only its own textures) |
| Accessibility | 100 (dots, lines and text at their bars, measured from pixels) |

Provisional: no real phone or Brave; headless Chromium draws in software. The design review before this run found and fixed
4 issues (text on the Sienna page, a selected tint, Dark Neon's line shade, a pink cast); see its report.

Evidence verdict (browser): inconclusive (open: no evidence rows), final for a browser-only root. Checkpoints:
[checkpoint 002](browser/exploration-002.json) · [checkpoint 003](browser/exploration-003.json) · [checkpoint 004](browser/exploration-004.json) · [checkpoint 005](browser/exploration-005.json) · [checkpoint 006](browser/exploration-006.json) · [checkpoint 007](browser/exploration-007.json) · [checkpoint 008](browser/exploration-008.json) · [checkpoint 009](browser/exploration-009.json) · [checkpoint 010](browser/exploration-010.json) · [checkpoint 011](browser/exploration-011.json)

| # | Contract | Probe and result |
|---|---|---|
| B1 | Drags, taps, the dot-tap rule, rings and sounds in every mode (mouse in six, touch in the restyled ones) | 001 ([output](browser/probe-001.txt)): **118/118** |
| B2 | Switching through all six modes leaves no colours behind; reload keeps the mode; the bar matches each page | 002 ([output](browser/probe-002.txt)): **19/19** (Tabletop at night page #A0592B, board #6A3A1C; Paper at night page #A0592B, its sheet's base #734121; Dark Neon page and bar #350014, lines #C3064F and #E28C19) |
| B3 | Dots and lines at least 3:1 from pixels; initials legible | 003 ([output](browser/probe-003.txt)): pass. Lines (median, worst): Tabletop 7.51 / 4.28, Paper 6.64 / 4.54, Dark Neon 3.51 (3.15) / 8.08 (7.29); dots 6.52 (6.09), 8.11 (7.70), 14.23 (11.46); initials 10.77 and 6.91, 5.75 and 4.36 (large text), 9.33 and 6.91 |
| B4 | Text at least 4.5:1 (large 3:1) from pixels, 7 screens per changed mode, phone and desktop | 004 ([output](browser/probe-004.txt)) superseded by 011 ([output](browser/probe-011.txt)): **7/7**, every visible line at its bar; worst 4.62-4.68:1 on the Sienna page (bar 4.5) and 3.91:1 on Dark Neon's large score digits (bar 3). Between them only the probe changed: it now skips screen-reader-only text (never drawn) and hides Paper's pencil underline under the brand while sampling, the two artefacts 004 reported |
| B5 | Violet only in Dark Neon; no pink in Dark Neon | 005 ([output](browser/probe-005.txt)) screenshots, 006 ([output](browser/probe-006.txt)): pass. Violet outside Dark Neon 0.00-0.06% (Dark Neon's own preview in the picker, White Neon's line junctions as on main); Dark Neon 0.8-13.9% (its tiles and avatar discs); pink in Dark Neon at most 0.030% (anti-aliased edges of the logo and a score digit), 0.000% on the board |
| B6 | Tabletop and Paper by day and White Neon pixel-identical to main | 007 ([output](browser/probe-007.txt)): pass. 0 pixels differ on Home, Setup, game and Settings in all three; the results dialog differs only in its elapsed time (42.3 s against 42.4 s, cropped side by side) in Tabletop and White Neon |
| B7 | Each mode downloads only its own textures | 008 ([output](browser/probe-008.txt)): **6/6**: Tabletop by day and at night felt 32.5 KB + wood-day 44.9 KB; Paper by day and at night paper-day 38.5 KB; Neon none |
| B8 | Game integrity | 009 ([output](browser/probe-009.txt)): **35/35** |
| B9 | Local games' resume | 010 ([output](browser/probe-010.txt)): **31/31** |

## Functional: contract outcomes (no score)

Evidence verdict (functional): **pass** ([evidence](functional/evidence.json); [checkpoint 002](functional/exploration-002.json) · [checkpoint 003](functional/exploration-003.json) · [checkpoint 004](functional/exploration-004.json)).

| # | Contract | Capture | Outcome |
|---|---|---|---|
| F1 | `npm run check` | 001 | pass: 0 errors, 0 warnings (149 files) |
| F2 | `npm run build` | 002 | pass |
| F3 | `npx vitest run tests/theme` | 003 | pass: 7/7 |
| F4 | `node token-audit2.mjs <repo>`: each restyled mode sets every colour token itself | 004 | pass: none missing (82, 82, 98, 98 tokens) |
| - | `npm run test:rules` | - | not applicable: no Firebase rules, data or online change |

## Top 3 Things to Fix

None found by this run. Watch items, not defects:
1. Tabletop at night now downloads 77 KB of texture (it reuses the day's felt and wood) instead of 20 KB; shared with Tabletop by day, so switching costs nothing. The /benchmark run measures the load effect.
2. Text straight on the Sienna page sits at 4.6-4.7:1: comfortable, but there is little room for lighter text colours there.

## Console Health

| Error | Count | First seen |
|-------|-------|------------|
| page errors | 0 | - |
| failed resource loads | the blocked Firebase requests only (test isolation) | - |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

## Limits

- Headless Chromium (software rendering) with CDP touch; no real phone and no Brave in this run.
- Checkpoint 008's hypothesis names the wrong screens for the clock difference; its observed output is exact (see B6).
- Probe 004 is superseded by probe 011 (only the probe changed).

**PR Summary:** QA found 0 issues, fixed 0, health score 100 → 100 (provisional); functional F1-F4 pass.
