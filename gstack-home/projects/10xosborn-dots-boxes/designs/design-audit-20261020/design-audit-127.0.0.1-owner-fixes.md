# Design review: fix/owner-2026-10-20 (the owner's 2026-10-20 reports)

- Branch `fix/owner-2026-10-20` on main `ab4c706`; task commit `0ad568e`, fix `87b0ed6`. Production builds served locally, Firebase blocked.
- Driver: gstack's own headless Chromium through its bundled Playwright (no Aside on Windows). Scope (diff-aware): the game board in all six theme modes (keyboard cursor, Paper's line colours, the first lines of a game) and the Home demo board, each against main.
- Screenshots: `screenshots/fix/` (sheets `sheet-cursor.png`, `sheet-aiturn.png`, `sheet-paper.png`, `sheet-hero.png`; `finding-001-before.png` / `-after.png`).

## First impression

The board says "your move" more quietly now. With the keyboard, the line Enter would draw shows as the mouse's hover preview does, a dotted line in the mover's colour, inside the focus ring. The old thick band in the button colour looked like a highlighted line rather than a choice. My eye goes to: the ring, the drawn lines, then the dots. One word: calmer.

## What changed, as rendered

| Area | Main | Branch |
| --- | --- | --- |
| A game's first line (Tabletop, Paper; Home demo) | Not painted until a line in the other direction arrives (AI's turn sheet: the player's first line missing in 4 of 6 modes; Home demo at 560 ms: first line missing in the same 4) | Painted at once in all six modes |
| Keyboard cursor | A band 2.4 lines wide in the button colour at 35% inside the ring; stays on the AI's turn and jumps back to the middle after each line | The hover preview in the mover's line colour inside the 3 px ring (3.29-6.31:1 from pixels on the ring's outline; an earlier probe reading of 5.07-10.7:1 sampled beside the ring, corrected later on 2026-10-20); hidden on the AI's turn; after its line is drawn, the nearest free line |
| Paper by day, your lines | #FC4422, 2.99:1 on the textured sheet | #EF4120, 3.28:1 (lines and their previews only) |
| Paper at night, your lines | #E8D5B5 (6.38:1), hard to tell from the ivory dots | #C9B085 Deep Sand Beige (4.38:1), reads as a line, not a dot |

Pixel diff against main (`day-diff.mjs`, phone 2x): Tabletop by day 0 pixels on Home, Setup, the game and the results, so the whole-board filter regions change nothing else; Paper by day only its coral lines and the picker swatch.

## Findings

### FINDING-001 (polish, Color): Paper at night, your boxes' rim kept the old beige. Fixed, verified.
Each box has a rim in its owner's line colour at 55-65% (the other player's denim rim matches their denim line), but yours stayed light beige inside the new sand lines. Now `--box-rim1: rgba(201,176,133,.65)`, the sand at the denim rim's strength. CSS only (`src/app.css`), commit `87b0ed6`. Before/after: `finding-001-before.png`, `finding-001-after.png`.

### Note (no finding): sand and denim share a lightness
Your sand (#C9B085) and the other player's denim (#8FB8D6) both measure about 4.4:1 on the sheet, so they differ in hue only. Simulated (Machado 2009, CIELAB): the pair is 45.8 apart for normal vision, 42.9 protan, 47.1 deutan, 40.6 tritan, all further apart than the old beige and denim (40.8 / 37.1 / 42.5 / 38.2). Only full monochromacy (about 1 in 30,000) would lose them, and the boxes keep their patterns. No change; listed for the owner.

## Detector
Static scan of the rendered DOM (impeccable 0.1.3; cross-origin CSS not resolved), 14 pages per build: main 72, branch 72, the same 5 rules and counts (`low-contrast` 18 on page text over textures and gradients, `dark-glow` 24, `cramped-padding` 8, `nested-cards` 2, `layout-transition` 6), all present before this branch and triaged in earlier audits (text contrast over the textures is measured from pixels by `texture-text.mjs`). The board's strokes are SVG, which the scan doesn't read. Detector: 72 → 72.

## Scores
- Design score: A → A (one polish finding fixed).
- AI slop score: A → A (no new patterns; the thick translucent highlight is gone).

## Spec differences (for the PR)
- The spec's Neon section describes the keyboard cursor as "a wide translucent coral line" and Paper's as "a dashed graphite outline"; the build follows the shared rule in every theme ("preview in the mover's colour; keyboard cursor adds a focus ring", no preview off-turn), the owner having asked about the wide highlight.

## Outside voices
Not run: Codex isn't installed; no subagent was started (this session starts agents only when the owner asks). Single-reviewer audit.

> Design review found 1 issue, fixed 1. Design score A → A, AI slop score A → A. Detector 72 → 72.
