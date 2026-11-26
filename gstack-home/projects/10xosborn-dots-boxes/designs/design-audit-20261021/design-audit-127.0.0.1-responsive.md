# Design review: the spec's step 4, responsive layout (design/10-responsive)

| Field | Value |
|---|---|
| Date | 2026-10-21 |
| Branch | design/10-responsive, uncommitted working tree on #25 `4613e6f` (the owner's rule: one commit per task, so fixes are in the tree, not separate commits) |
| Target | production builds served locally: branch `dist-step4`, base `dist-turns` (#25); Firebase blocked by hostname |
| Driver | gstack's bundled Playwright with its headless Chromium 151 (Aside is macOS-only; the `$B` CLI loses its page every minute or two on this PC) |
| Mode | diff-aware: the game screens in their three layouts (one column; side by side on short, wide screens; Paper's two-page spread), Home, the online game's notes |
| Reference | `docs/design/ui-themes-spec.md` (Breakpoints; Cozy Paper's spread, score sheet and turn note), `Paper-Desktop-Game` and the `*-Phone-Game` mockups, DESIGN.md (spec format, tokens calibrated) |
| Detector | impeccable 0.1.3, DOM mode (static scan of the rendered DOM; cross-origin CSS not resolved): **128 → 128** on the 23 pages both builds have; 296 on the branch's 48 pages, unchanged by the fixes |

Coverage note: the capture of both builds was stopped by Claude Code's low-memory reaper while the session sat idle. The branch half had finished (60 screenshots, 48 DOM dumps: six modes; game at 360x640, 390x844, 844x390, 768x1024, 1280x800, 1440x900; Home with and without a saved game at 360x640 and 390x844); #25's half reached Tabletop (both modes) and part of Dark Neon (27 screenshots, 23 dumps). It was not restarted (the owner's rule). The detector delta uses only the pages both builds have.

## First impression (Tabletop by day, a 360x640 phone, an extra turn pending)

The game screen communicates **a whole game on one screen**. I notice that on #25's build the same phone showed the chips on two rows, the board cut off by the bottom edge and only the tops of Quit and Restart; on this branch the chips keep one row, the board is the full width (327 px) and Quit and Restart sit right under it. The first three things my eye goes to are **the turn pill ("Your turn, +1 extra turn")**, **the board**, **the two scores**: the intended order. One word: **complete**.

Paper on a desktop is the most changed screen: a notebook spread centred on the kraft desk, the score sheet written on the ruled left page with the stickers out in the margin and the pencil arrow from "go again!" to the board on the right page, the spine shaded between them. It reads like the mockup, at the spec's 600 px board.

## Inferred system (what renders)

Fonts, colours and tokens are unchanged. New layout values, all from the spec or its mockups: column widths 600 (from 640 px) and 680 (from 1024 px); the board at most 600 px; Paper's spread from 960 px with a 360 px score page, rules every 36 px, the margin line at 36 px, the page shadow `0 1px 0 #E0D6C2, 0 18px 30px -18px rgba(70,52,30,.35)` and a 14 px spine shadow at 25% (spec's elevation); side by side when landscape and 540 px tall or less (the owner's choice). Short screens (760 px tall or less) take 16 px at the foot instead of 28 and 12 under the top bar instead of 18.

## Checks

- **Nothing scrolls** (scroll-audit, six modes, nine viewports): every game screen, Home on every phone held upright, the online lobby at 360 px and up. Before: the game scrolled on short phones (7-71 px) and sideways (198-222 px); Home 73-183 px on short phones and 340-370 sideways. Setup, Leaderboard, Stats and Settings still scroll on small phones (the owner's call: step 6).
- **The size picker matches the real board** (fit-check: four modes, 21 viewports, five board shapes, boardFit.ts bundled into the page): 420 boards, predicted and measured dot gap equal within 1 px, no page scrolled.
- **Flows** (dr-flow.mjs): a phone turned sideways mid-game switches to side by side and back with the board box exactly restored, and taps draw on both; on Paper's spread a mouse drag draws a line, Tab goes top bar, board, Quit, Restart, and the board's focus ring shows; no page errors. 10/10.
- **Edge states** (dr-edge.mjs): two 16-letter names in pass and play with an extra turn pending, and a two-line online note in the chips' place, on the spread, sideways and on 320-390 px phones: no scrolling, no widening, the note fits its box, names truncate. (Its "clipped .sc" flag on Paper is the score's pencil circle, drawn 3 px past its box on purpose.)
- **Online** (emulators, online-r1b4.mjs): "Reconnecting…" and "stepped away" take the chips' place without moving either player's board; after 2 minutes Leave becomes the main button. 27/27.

## Findings

### FINDING-001: Paper's pencil arrow landed on the turn note when the note filled its line (medium, Visual hierarchy) — fixed, verified

On a phone turned sideways, Paper's note is one line, as on phones, and the arrow started at the line's right end. With long names ("Abcdefghijklmnop closed a box, go again!") the words reached that end and the arrow's tail crossed "go again!" and its highlighter; on any spread the arrow could also run under a long online note written on the line below. Now the arrow is drawn on the desktop spread only, where it starts from the note's second line, clear of its words (the spec draws it there; phones get the note as one line), and it steps aside while an online note or error is written below.

Screenshots: `edge-paper-light-844x390-note.png` (before, in the first edge run), `finding-001-after.png`, `edge-paper-light-1280x800-note.png`.

### FINDING-002: Paper's top-bar chip cut the name to one letter on narrow bars (polish, Spacing) — fixed, verified

Paper writes the chip on one line ("Ama Lv 1"). On a bar 290 px wide or less (Paper's page on a phone turned sideways at 667x375, and any 320 px phone) the name shrank to "A." beside the brand and the theme button. The bar is now a container and, that narrow, leaves out "Lv N" (still in the chip's spoken label, and on Home and Stats): "Ama" shows whole at every width checked. The desktop spread's bar (300 px) keeps "Ama Lv 1", as in the mockup.

Screenshots: `finding-002-after-667.png`, `finding-002-after-320-home.png`.

### Detector rows, confirmed by hand

- On the 23 pages both builds have, every rule's count is unchanged (dark-glow 40, low-contrast 36, repeating-stripes-gradient 23, cramped-padding 14, layout-transition 12, nested-cards 3).
- On the branch-only pages, the sideways and spread layouts show exactly the rows of the upright column for the same mode (Paper by day 2 per game page, Paper at night 15, White Neon 8): the new layouts add none. These are the rows earlier reviews confirmed by hand (text straight on the textured page, the turn pill's sliding half, Neon's glow).

## Outside voices

Not run: Codex is not installed on this PC (logged as unavailable), and the Claude design subagent is skipped under the owner's standing rule (no subagents unless asked). Single-model review.

## Not changed here (noted)

- Tabletop and Neon on tall phones keep empty table below Quit and Restart (390x844: 172 px), as their phone mockups do; Paper pins its buttons to the foot of the page, as its mockup does.
- At 320 px "My stats" wraps onto two lines on Home, and the cards cut names to a letter or two: as on #25 (step 6 restyles Home and the top bar).

## Differences from the mockups (for the PR)

- Paper's spread: the board page grows with the screen up to the spec's 600 px board (mockup: a fixed 560 px page with a 500 px board, which would leave 12x12 off big screens); the theme button sits on the page's top line beside the name (not in the mockup, which predates the theme button); the pencil arrow starts from the note's second line.
- Tabletop and Neon on a 360 px phone: the level chip is left out when the four chips don't fit one row (the 390 px mockups fit all four).
- Sideways phones and Home have no mockups: both follow the spec's rules (nothing scrolls, the board shrinks first).

## Scores

| Category | Base (#25, for layout) | Branch before fixes | Final |
|---|---|---|---|
| Visual hierarchy | A | A- (FINDING-001) | A |
| Typography | A | A | A |
| Spacing & layout | B (short phones cut the board and buttons off) | A | A |
| Color & contrast | A | A | A |
| Interaction states | A | A | A |
| Responsive | C (the game scrolled on short phones and sideways) | A | A |
| Content | A | A | A |
| AI slop | A | A | A |
| Motion | A | A | A |
| Performance feel | A | A | A |

**Design score A- → A** (branch before and after fixes; #25's build would grade B on this diff's scope). **AI slop A → A.** Detector **128 → 128** (shared pages).

> Design review found 2 issues, fixed 2. Design score A- → A, AI slop score A → A.
