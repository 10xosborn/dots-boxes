# Design review: the spec's step 3 HUD (design/09-hud-avatars)

| Field | Value |
|---|---|
| Date | 2026-10-20 |
| Branch | design/09-hud-avatars, commit ac8e192 (stacked on #23 `c421b05`) |
| Target | production builds served locally (branch `dist-hud2`, base `dist-glass-A` = #23), Firebase blocked |
| Driver | gstack's bundled Playwright with its headless Chromium 151 (Aside is macOS-only) |
| Mode | diff-aware: the game screen's HUD (cards, turn pill, chips; Paper's score sheet and note), the top bar's level chip on every screen, Home's profile card |
| Reference | `docs/design/ui-themes-spec.md` (shared "Player avatars", "The eight game events" 5, each theme's D and E tables) and the phone and desktop game mockups |
| Detector | impeccable 0.1.3, DOM mode, the same 12 pages from both builds (6 modes x game and Home, phone): **70 → 68** |

## First impression (Tabletop by day, phone, a chain in progress)

The game screen communicates **a calm board game with clear players**. I notice the two player cards now read as people at a table: a burnt-orange disc with a white figure for Ama, ringed in her colour, and the bot for the AI on the golden disc. The first three things my eye goes to are **Ama's active card**, **the turn pill's "+1 extra turn ×2"**, and **the board**. That is the order the spec's hierarchy asks for in a chain (board first, turn second, scores third), except the active card's ring pulls slightly ahead of the board at the top of the screen, as in the mockup. One word: **settled**.

Paper by day: the cards became a ruled score sheet with a red margin line, stickers, tally gates and the circled score; the note "You closed 2 boxes, go again!" with the yellow swipe is the most charming thing on any of the six screens.

## Inferred system (what renders)

- Fonts unchanged per theme: Jost; Unbounded and Manrope; Kalam (names, scores, note) and Atkinson Hyperlegible (labels). Kalam is never used for a label or body text.
- New colour tokens, all from each theme's own palette: `--av1/--av2` (avatar discs in the player colours), `--av1-ink/--av2-ink` (the figure: white, or the card colour on the light night colours), `--bot` (the AI's colour, deepened in three modes), `--bot-visor/--bot-eye` (the spec's values); Paper's `--rule`, `--margin`, `--highlight`, `--hl-ink`, `--sticker-edge` (the full spec's Paper tokens).
- Avatar contrast (figure or bot head against its disc, icons need 3:1): Tabletop day 3.37 / 3.72, night 7.35 / 4.19 (bot 4.59); Dark Neon 6.42 / 6.39 (bot 4.73); White Neon 6.28 / 4.90; Paper day 3.51 / 5.97; Paper night 6.50 / 4.44 (bot 4.58). Highlighter text 11.29:1.

## Checks in real play (hud/flow.mjs, pass and play on a touch phone, Animations on, every mode): 52/52

The board's top edge never moves through nine moves (251 px; 242 in Paper); no cue before a capture; after Ama closes a box the pill reads "Ama's turn · +1 extra turn" (Paper: "Ama closed a box, go again!"); the live region ends "Extra turn."; the chain shows "×2" ("closed 2 boxes"); when the turn passes the cue goes and the active card, line, circle and underline follow; Paper's tally gains its newest mark as its own path; no console errors.

## Findings

### FINDING-001: Paper's underline marked the wrong words (medium, Visual hierarchy) — fixed, verified

The pencil underline under the player to move was a fixed 90 px curve, as in the mockup, where it sits under "Ama you". With pass-and-play's subtitle ("Ama Player 1") it ran on under the subtitle, and under a long name it stopped partway, so it no longer said which name it marked. Now it is exactly as wide as the name: the name truncates itself (ellipsis), carries the underline in its own padding, and its note sits beside it on the same baseline. A first attempt (underline inside the inline name) was clipped away by the row: Kalam's tall line box put it outside; caught in the screenshots and redone. Before: `screenshots/hud-finding-001-before.png`; after: `screenshots/hud-finding-001-after.png` (day, pass and play, night with the AI).

### FINDING-002: the period after "goes again" collided with the highlighter (polish, Content) — fixed

The highlighter's hand-cut edge has a negative margin, which pulled the full stop into it. The stop now sits inside the swipe, as "go again!" keeps its "!".

### Detector rows, confirmed by hand

- `low-contrast` 18 → 14: the four that went were the old initials in coloured discs on the cards (white on burnt orange 3.4:1; Paper's coral and indigo initials on kraft 3.2 and 4.4:1; denim on the Sienna desk 3.9:1), now SVG avatars measured above. The 14 left are the same as on #23 (text straight on the Sienna table and desk, which the detector reads against the colour under the multiplied wood; pixels give 4.6:1 or more, see DESIGN.md).
- `nested-cards` +2 (both Neon game pages): the turn pill's sliding half inside the pill bar, the spec's own component ("White pill whose tinted half slides to the mover"). It was flagged only because its padding moved from the inner text span to the pill, so the extra-turn cue can stack beside or under the turn. Spec-blessed, not counted as a finding.
- Everything else (`dark-glow`, `cramped-padding`, `repeating-stripes-gradient`, `layout-transition`) is identical on both builds.

## Differences from the mockups (for the PR)

1. Avatars are silhouettes (the spec's "a player with no avatar yet") and the AI's bot; the mockups show Ama's sample avatar. Avatars of your own arrive with the builder (step 6), which also adds the avatar with its pencil badge beside "Your name" on Setup.
2. The bot's disc is a deeper shade of the AI's colour where the white head needs it (Tabletop and Paper at night, Dark Neon); the Neon mockup does the same with its slate.
3. On a phone the extra-turn cue goes under the turn in the pill, in smaller type: one line ("Your turn · +1 extra turn") does not fit half the pill in these fonts. One line from 520 px of pill bar up (tablets and desktops).
4. A chain shows its count on a small tag (×2, ×3), from the shared spec's event 5 (plan F4); the theme mockups only show the first extra turn.
5. Paper's score sheet is a ruled card on the desk with its own margin line (the mockup's whole phone page is paper); the level is on the top bar's tab, not the sheet's details line (the mockup leaves it out too); the hand-drawn arrow to the board belongs to the desktop spread (step 4).
6. Paper's underline is as wide as the name (FINDING-001); Paper's notes for the AI, pass and play and online are written in the same voice ("Tactician closed a box, goes again.", "Kofi closed a box, go again!"); the mockup shows only yours.
7. Neon's turn pill uses its mockup's 13 px type on phones (it was 14.4 px, which cut "Tactician is thinking" short on a phone, also on #23).
8. Not changed here: Paper's top bar tab is not tilted as in its mockup (the top bar's restyle is step 6).

Also fixed on the way: Dark Neon's Home profile disc was Electric Violet (`--box1`, the captured tiles' colour) on #23 and main, against the owner's rule of violet only in captured tiles; it is now the player's magenta-red. Player cards no longer grow a line when a score reaches two digits ("Medium AI" wrapped and moved the board down on #23).

## Scores

| Category | Baseline (f90cf5b) | Final (ac8e192) |
|---|---|---|
| Visual hierarchy | B+ (FINDING-001) | A |
| Typography | A | A |
| Spacing and layout | A | A |
| Color and contrast | A | A |
| Interaction states | A | A |
| Responsive | A | A |
| Content | A (FINDING-002 is polish) | A |
| AI slop | A | A |
| Motion | A | A |
| Performance feel | A | A |

**Design score A- → A. AI slop A → A.** Nothing in the change reads as template work: the avatars are the spec's own art, the Paper sheet is hand-drawn SVG on the theme's tokens, and no new gradients, glows or cards were added.

PR summary: Design review found 2 issues, fixed 2. Design score A- → A, AI slop score A → A. Detector 70 → 68 (#23's build vs the branch, same 12 pages).
