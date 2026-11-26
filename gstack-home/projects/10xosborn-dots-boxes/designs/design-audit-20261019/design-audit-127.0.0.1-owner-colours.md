# Design review: the owner's 2026-10-19 colour changes (design/06-owner-colours)

| Field | Value |
|---|---|
| Date | 2026-10-19 |
| Target | production build on http://127.0.0.1:4173/, main's build (288ab3a) beside it for the untouched modes; Firebase blocked by hostname |
| Driver | gstack's playwright-core with its headless Chromium (Aside is macOS-only; gstack's browse daemon restarts on Windows) |
| Scope | Tabletop at night, Cozy Paper at night, Dark Neon (changed); Tabletop and Paper by day, White Neon (must be untouched) |
| Sizes | phone 390x844 at 2x with touch; desktop 1280x800 |
| Commits | task 4d1e9a4, fixes 299b981, 7f82b7d, 37c8de0, 1a25175 (to be folded into the task's one commit, the owner's rule) |

## What changed (the owner's request)

- Tabletop at night and Cozy Paper at night take their day textures in Sienna Brown #A0592B: the day's maple planks stained Sienna (the tile multiplied onto #B77D5F, so the wood averages #A0592B), the day's felt in its wooden rim; the day's paper on a Sienna desk (multiplied onto #A75E2F) and, twice over, on a deeper Sienna sheet. Cards, controls, the felt and the sheet use deeper Sienna shades (#6B3A1E, #774326, #6A3A1C).
- Dark Neon: Bright Magenta-Red #BD0249 for you (Deep Burgundy #4E011F under "Your turn", Dark Wine #350014 at the top of the room and in the browser bar) and Golden Orange #E28C19 for the other player, instead of magenta-pink and lime.

## First impression

The night table now reads as the day table after dark: real wood grain and knife marks in a warm Sienna, the felt mat in its rim, the cards in the same family. Paper at night is a Sienna kraft desk with a darker sheet; it feels like the day's paper, not a separate theme. Dark Neon reads crimson and amber neon on black glass; nothing is pink. My eye goes to the board, then the score cards, then the turn pill, as intended. One word: warm.

## Findings

| # | Impact | Category | Finding | Fix | Status |
|---|---|---|---|---|---|
| 001 | High | Color & Contrast | Text straight on the Sienna table and desk (the top bar's "Grid Rivals", Home's "Dots & Boxes" and tagline, the offline note) measured 3.1-4.4:1 from pixels (bar 4.5). The Sienna surface sits between light and dark, and the wood's light streaks and the paper's fibres are as light as the text needs to be dark. | `--head-text: #FFFFFF` in both modes, and text straight on the page (not on a card) takes it: `.tag`, `.hero .kicker` (and its "&"), help and muted text outside cards. White keeps 4.6:1 or more over the lightest grain. | verified (299b981) |
| 002 | Medium | Color & Contrast | Tabletop at night, Settings: the chosen theme's name on its tinted card measured 4.44:1 (the tint plus the button sheen) | `--select-tint` #86502E → #7A4628 (the gold ring still marks the choice) | verified (7f82b7d) |
| 003 | Medium | Color & Contrast | Dark Neon: your lines in #BD0249 measured 3.31:1 median but 2.98:1 worst: #BD0249 itself is 2.98:1 on the Obsidian Glass, so the line's edges (outside its lighter core) were under the owner's 3:1 | `--line1` #C3064F for the board's lines only, a hair lighter (3.16:1); the rings, pill, logo and room light keep #BD0249 exactly | verified (37c8de0): 3.51 median, 3.15 worst |
| 004 | Polish | Color | Dark Neon: your initials and stripes (#FFF1F4) carried a faint pink cast (counted as pink, 0.1-0.4% of the screen) | pure white #FFFFFF | verified (1a25175): pink 0.00% on the board |

Not findings (checked by hand):
- The design detector's 40 remaining low-contrast rows read the plain colour under each texture (#B77D5F, #A75E2F), which never shows on its own (the detector cannot see blend modes); every visible text line passes when measured from pixels.
- Its dark-glow rows are Neon's glow, which the owner's glass-and-light brief asks for; cramped-padding, stripes and layout-transition rows are unchanged structures (the same as the 10-15 review).
- Paper's "Grid Rivals" (white, median 5.4:1) dips in the probe only because its pencil underline starts on the text box's bottom edge; "Game resumed…" is screen-reader-only text that is not drawn.
- Dark Neon's Home in a full-page capture shows a flat band below the first screen: the fixed room background does not extend in full-page captures (also on main); on a phone it always fills the screen.

## Measurements (final build)

- Text from pixels (7 screens per mode, phone and desktop): Tabletop and Paper at night pass every visible line; Dark Neon passes all, worst 3.9:1 on the large orange score digit (bar 3).
- Board from pixels: Tabletop at night lines 7.51 / 4.28, dots 6.52 (worst 6.09), initials 10.8 / 6.9; Paper at night 6.64 / 4.54, dots 8.11 (7.70), initials 5.75 / 4.36 (large); Dark Neon 3.51 (3.15) / 8.08 (7.29), dots 14.2, initials 9.3 / 6.9.
- Violet: 0.00% in Tabletop and Paper at night (0.02-0.03% where the theme picker shows Dark Neon's own preview); only in Dark Neon's tiles and avatar discs.
- Pink in Dark Neon: 0.00% on the board, at most 0.03% of a screen (anti-aliased edges of the logo and the score digit).
- Theme switching through all six modes, reloads included: 19/19 (each mode's own colours; the browser bar matches each page).
- Each restyled mode still sets every colour token itself (token audit: none missing).
- Untouched modes against main, pixel for pixel: Tabletop and Paper by day 0 pixels on Home, Setup, game, result and Settings; White Neon 0 except the game clock's digit (0:42 vs 0:43).

## Scores

| | Baseline (task commit) | Final |
|---|---|---|
| Design score | B+ (one high contrast finding, two medium) | A |
| AI slop score | A (warm materials from the owner's own day textures; no generic patterns) | A |
| Detector | 158 rows (44 low-contrast) | 154 (40, all over blend-mode bases) |

Outside voices: Codex is not installed on this PC (outside_status: unavailable); native review only.

PR summary: Design review found 4 issues, fixed 4. Design score B+ → A, AI slop score A → A.

## Alternatives kept for the owner

`screenshots/alternative-T1-sienna-table-game.png` and `alternative-P1-sienna-desk-game.png`: the same Sienna table and desk with the cards, board and buttons left in the old walnut and cocoa (one token block each to switch).
