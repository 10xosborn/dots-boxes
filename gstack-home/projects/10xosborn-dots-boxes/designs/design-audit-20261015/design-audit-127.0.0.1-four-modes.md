# Design audit: the owner's four restyled theme modes (2026-10-15)

| Field | Value |
|---|---|
| Target | production build of `design/05-four-modes` on http://127.0.0.1:4173/ (Firebase blocked by hostname, Animations off) |
| Commit | `f136084` plus the three fixes below (folded into the task's single commit; the owner asked for one commit per task) |
| Scope | Tabletop at night, Cozy Paper at night, Dark Neon, White Neon: Home, Settings, Setup, a game, the result, Stats on a phone (390x844 at 2x); Home and the game on desktop (1280x800). Tabletop and Paper by day checked for "untouched" against main |
| Driver | gstack's own headless Chromium through Playwright scripts (Aside is macOS-only; the browse daemon restarts on Windows) |
| Calibrated against | the owner's 2026-10-15 brief (Task 3). DESIGN.md's front matter still holds the old night tokens for these four modes and is updated in the same task |
| Mode | OPERATE (a game app); the brief asks for Dark Neon's near-black and glow, so that "look" is requested, not defaulted |

## First impression

The four modes communicate **one game in four materials**. I notice the paper themes now read as warm, matte and quiet:
walnut and coffee browns, platinum or beige strips, ivory or ash dots, and no shine anywhere. Neon is the opposite on
purpose: obsidian or opal glass and coloured light. The first three things my eye goes to on every game screen are the
board, the active player's card and the score; that is the intended order. One word: **material**.

## Scores

| | Baseline (`f136084`) | Final |
|---|---|---|
| Design score | A- | A |
| AI slop score | A | A |
| Detector (impeccable 0.1.3, rendered DOM) | 134 | 134 (no rule touched by the fixes; see below) |

Category grades (final): hierarchy A, typography A, spacing A, colour and contrast A (B at baseline: FINDING-001),
interaction states A, responsive A, content A, AI slop A, motion A, performance feel A (A- at baseline: FINDING-003).

## Measured (from pixels, phone at 2x)

| Mode | Lines: you / other player (median, worst in the stroke body) | Dots | Initials on their tiles |
|---|---|---|---|
| Tabletop at night | 7.05 / 4.03 | 6.12 (worst 5.72) | 11.2 / 7.1 |
| Cozy Paper at night | 7.67 / 5.25 | 9.38 (8.90) | 5.65 / 4.78 |
| Dark Neon | 6.31 (5.07) / 16.7 (16.2) | 14.2 (11.5) | 6.90 / 8.46 |
| White Neon (after FINDING-001) | 4.93 (4.28) / 3.80 (3.32) | 3.02 (3.02) | 8.99 / 8.63 |

Violet (4x4-pixel blocks, hue 255-300 degrees, saturation 0.18 or more): Tabletop at night 0.00%, Cozy Paper at night
0.00%, White Neon 0.00-0.05% (a few blocks where a coral dot's edge meets a blue line), Dark Neon 3.6-7.9% (its tiles,
the avatar discs that mirror them and the tiles' lit edges). The Neon board has no backdrop-filter in either mode; Neon
loads no texture; Tabletop at night loads only `grain.webp` (20.3 KB), Cozy Paper at night only `cardstock.webp` (37.3 KB).

Untouched: Tabletop and Paper by day are pixel-identical to main on Home, Setup and the game. On Settings only Neon's own
row differs (its new White Neon preview and blurb), and on the result only the clock's last digit (42.4 s vs 42.3 s, the
test's own timing).

## Findings

### FINDING-001: White Neon's light-pipe cores took the line centres below 3:1 (high, colour and contrast): fixed, verified

- **What:** the whiter core drawn inside each line (62% line colour) measured 2.73:1 (blue) and 2.23:1 (teal) against the
  opal board, under the brief's "dots and drawn lines need at least 3:1".
- **Fix:** `--core-mix: 85%` for White Neon (`src/app.css`): the core is still lighter than the line, and keeps 4.28:1 and
  3.32:1 at its lightest. Before/after: `screenshots/finding-001-before.png`, `finding-001-after.png`.

### FINDING-002: Dark Neon's hover light was the old Neon cyan (polish, interaction states): fixed, verified

- **What:** buttons, chips and options lit up in #21BDCA on hover, a cyan from the old palette, beside the new Cyber Cyan
  nodes (#00F0FF).
- **Fix:** the Neon hover rules use Cyber Cyan (`src/app.css`); White Neon keeps its own indigo hover. Before/after:
  `finding-002-before-chip.png`, `finding-002-after-chip.png`.

### FINDING-003: Tabletop at night downloaded the day rim's wood tile it never shows (medium, performance): fixed, verified

- **What:** the night board drops the wooden rim with `content:none` on `.board-wrap::before`, but Chromium still fetched
  that pseudo-element's background image (`wood-day.webp`, 45 KB) as soon as a game opened.
- **Fix:** the night rule also sets `background:none` (`src/app.css`). Request log before: `wood-day-*.webp`; after: none.

### Detector rows (not findings)

- `[dark-glow]` 66: Neon's coloured light on the active card, the turn pill, the board's edge, the gold main button and
  the hover states. The brief asks for exactly this ("glowing nodes", "laser glow", "a saturated coloured halo"); every
  colour now comes from the new palettes.
- `[cramped-padding]` 24 (turn bar, board frame) and `[layout-transition]` 12 (the XP bar's width): structures this
  branch does not touch (no change to those rules in the diff); the same on main.
- `[repeating-stripes-gradient]` 32, advisory: Tabletop by day's plank seams (untouched) and Dark Neon's faint light
  streaks, which the brief asks for.

Static scan of the rendered DOM; cross-origin CSS not resolved.

## Outside voices

Codex is not installed (`outside_status: unavailable`); no independent review agent was started (agents run only at the
owner's request). Native review only.

## Summary

3 findings, 3 fixed and verified, 0 deferred. Design score A- → A, AI slop A → A, detector 134 → 134.

**PR summary:** Design review found 3 issues, fixed 3. Design score A- → A, AI slop score A → A.
