---
# gstack: design-md-format=spec
# The UI design is locked to docs/design/ui-themes-spec.md and docs/design/mockups/.
# These tokens copy the spec's tables (palettes updated by the owner on 2026-10-12, the dark modes on 2026-10-13, and Tabletop at night,
# Paper at night and both Neon modes on 2026-10-15); where they differ, the spec wins.
name: Grid Rivals
description: A two-player game of lines and boxes with three themes players can switch between; Minimalist Premium, a board game on a table, is the default.
colors:
  # 1. Tabletop: maple table (light) and walnut (dark). By day: burnt orange, pale mint, pastel and golden yellow.
  #    At night (owner, 2026-10-15: "sleek, modern", warm browns): a Deep Walnut Brown page, a Dark Walnut Brown board of matte
  #    felt-paper, platinum lines for you and copper for the other player, ash dots, a dark felt tint for boxes, gold buttons.
  table-light-table: "#E3B970"
  table-light-felt: "#C4DFC9"
  table-light-frame: "#B0602A"
  table-light-line-1: "#BF4E1E"
  table-light-line-2: "#7C5E08"
  table-light-dot: "#2C4637"
  table-light-p1: "#D77027"
  table-light-p1-deep: "#C2611F"
  table-light-p2: "#F4AF3D"
  table-light-p2-mark: "#B07A12"
  table-light-p2-deep: "#9C6B0E"
  table-light-box-rim-1: "#9E4E17"
  table-light-box-rim-2: "#94650C"
  table-light-accent: "#D77027"
  table-light-accent-lip: "#9E4E17"
  table-light-on-accent: "#FFFFFF"
  table-light-ink: "#2B241D"
  table-light-ink-2: "#5A4632"
  table-light-pill: "#FFF8E9"
  table-light-control: "#F6EAD0"
  table-light-select-tint: "#FCE6B2"
  table-light-sel-ring: "#9E4E17"
  table-light-focus: "#8A3F0E"
  table-light-gold: "#8C5F0A"
  table-dark-table: "#4F3B32"
  table-dark-felt: "#5A4538"
  table-dark-frame: "#3F2F27"
  table-dark-line-1: "#E5E4E2"
  table-dark-line-2: "#E0A070"
  table-dark-dot: "#D6D3CE"
  table-dark-p1: "#E5E4E2"
  table-dark-p1-deep: "#F2F1EF"
  table-dark-p2: "#E0A070"
  table-dark-p2-deep: "#EFBC93"
  table-dark-box: "#20160F"   # at 40%, both players
  table-dark-box-rim-1: "rgba(229,228,226,.55)"
  table-dark-box-rim-2: "rgba(224,160,112,.7)"
  table-dark-accent: "#F2B84B"
  table-dark-accent-lip: "#A87418"
  table-dark-on-accent: "#241005"
  table-dark-ink: "#F5EEE6"
  table-dark-ink-2: "#D9CBBE"
  table-dark-pill: "#604A3F"
  table-dark-control: "#5B463B"
  table-dark-select-tint: "#7A5E4C"
  table-dark-sel-ring: "#F2B84B"
  table-dark-focus: "#F2B84B"
  table-dark-gold: "#FFD08A"
  # 2. Neon, dark and light (owner, 2026-10-15): glass and emitted light only. Dark Neon: an Obsidian Glass board, Cyber Cyan
  #    nodes, Neon Magenta lines for you and electric lime for the other player, Electric Violet glass tiles (the only violet in
  #    any theme), a near-black room. White Neon: a Frosted Opal Glass board, Hot Coral nodes, Deep Electric Blue lines for you
  #    and deep teal for the other player, Vivid Lime glass tiles with a deeper lime edge, a cool grey-blue room.
  neon-dark-page: "#050608"
  neon-dark-aurora: "linear-gradient(160deg, #040506, #07080B 50%, #050608), lights #FF007F, #00F0FF at 20%"
  neon-dark-board: "#0B0F19"
  neon-dark-text: "#F1F5FF"
  neon-dark-muted: "#AEB8CC"
  neon-dark-p1: "#FF007F"
  neon-dark-p1-deep: "#FF4DA0"
  neon-dark-p2: "#C6FF00"
  neon-dark-p2-deep: "#D4FF4D"
  neon-dark-line-1: "#FF007F"
  neon-dark-line-2: "#C6FF00"
  neon-dark-box: "#7B2CBF"   # at 78%, both players
  neon-dark-box-rim: "#A970F0"
  neon-dark-initial-1: "#FFD1E8"
  neon-dark-initial-2: "#E6FF8A"
  neon-dark-dot: "#00F0FF"
  neon-dark-accent: "#F2B84B"
  neon-dark-on-accent: "#241005"
  neon-dark-sel-ring: "#F2B84B"
  neon-dark-panel: "rgba(17,18,22,.7)"
  neon-dark-panel-strong: "rgba(30,32,38,.78)"
  neon-dark-focus: "#F2B84B"
  neon-dark-gold: "#FFD08A"
  neon-light-page: "#D5DEE7"
  neon-light-aurora: "linear-gradient(160deg, #DFE6EE, #D5DEE7 55%, #D8E4EB), lights #FF4500, #0047FF, #39FF14 at 12%"
  neon-light-board: "#EBF1F5"
  neon-light-text: "#141832"
  neon-light-muted: "#4A5270"
  neon-light-p1: "#0047FF"
  neon-light-p1-deep: "#0040E6"
  neon-light-p2: "#007F73"
  neon-light-p2-deep: "#00756A"
  neon-light-line-1: "#0047FF"
  neon-light-line-2: "#007F73"
  neon-light-box: "#39FF14"   # at 85%, both players
  neon-light-box-rim: "#178A00"
  neon-light-initial-1: "#0A2A8C"
  neon-light-initial-2: "#003F44"
  neon-light-dot: "#FF4500"
  neon-light-dot-edge: "#D93A00"
  neon-light-accent: "#4657CE"
  neon-light-on-accent: "#FFFFFF"
  neon-light-sel-ring: "#4657CE"
  neon-light-panel: "#FFFFFF"
  neon-light-focus: "#4657CE"
  neon-light-gold: "#B5560C"
  # 3. Cozy Paper: a cream sheet on a kraft desk (light). By day orange, teal, indigo, cyan and coral. At night (owner, 2026-10-15:
  #    "warm, tactile"): a Deep Cocoa Brown sheet of heavyweight cardstock on a Dark Coffee Brown desk, ivory paper dots, warm beige
  #    die-cut strips for you and denim blue for the other player, a parchment wash for boxes, gold buttons.
  paper-light-desk: "#E6DCC7"
  paper-light-page: "#FCF8EF"
  paper-light-graphite: "#2E2B27"
  paper-light-graphite-2: "#625A50"
  paper-light-p1: "#FC4422"
  paper-light-p1-wash: "#FFE1D8"
  paper-light-p2: "#4657CE"
  paper-light-p2-wash: "#E2E5FA"
  paper-light-accent: "#4657CE"
  paper-light-select-tint: "#D3F2EA"
  paper-light-sel-ring: "#007F62"
  paper-light-ring: "#00936F"
  paper-light-gold: "#B04E07"
  paper-dark-desk: "#492E1F"
  paper-dark-page: "#513626"
  paper-dark-graphite: "#F6EEDF"
  paper-dark-graphite-2: "#DCCBB3"
  paper-dark-p1: "#E8D5B5"
  paper-dark-p1-deep: "#F0E2C6"
  paper-dark-p2: "#8FB8D6"
  paper-dark-p2-deep: "#A5C6E0"
  paper-dark-wash: "#F3EAD7"   # at 20%, both players
  paper-dark-initial-1: "#FFF6E4"
  paper-dark-initial-2: "#C9E0F2"
  paper-dark-dot: "#F3EAD7"
  paper-dark-accent: "#F2B84B"
  paper-dark-on-accent: "#241005"
  paper-dark-panel: "#513626"
  paper-dark-sel-ring: "#F2B84B"
  paper-dark-ring: "#F2B84B"
  paper-dark-gold: "#FFD08A"
typography:
  table-ui:
    fontFamily: Jost
    fontWeight: 400
    fontSize: 0.9375rem
    fontFeature: tnum
  table-display:
    fontFamily: Jost
    fontWeight: 800
    fontSize: 2.25rem
  neon-display:
    fontFamily: Unbounded
    fontWeight: 800
    fontSize: clamp(2.3rem, 10vw, 3.6rem)
  neon-body:
    fontFamily: Manrope
    fontSize: 1rem
    lineHeight: 1.5
  paper-display:
    fontFamily: Kalam
    fontWeight: 700
    fontSize: 1.875rem
  paper-body:
    fontFamily: Atkinson Hyperlegible
    fontSize: 0.9375rem
    lineHeight: 1.5
rounded:
  table-card: 14px
  table-pill: 9999px
  neon-lg: 22px
  neon-md: 14px
  neon-sm: 10px
  paper-sm: 3px
  paper-md: 6px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
---

# Grid Rivals

**The design is locked:** the owner's UI themes spec (`docs/design/ui-themes-spec.md`, committed without its tool-specific handoff section) is the authority, and `docs/design/mockups/` holds the boards with the exact values. This file collects the tokens and the decisions in one place for the repository. Where it differs from the spec, the spec wins.

## Overview

**Product:** Grid Rivals: Dots & Boxes, a free web game (Svelte 5, GitHub Pages, Firebase). Two players: you against an AI (Rookie, Tactician, Maestro), two people on one device, or a friend online by invite link. Boards 3x3 to 6x6 (ranked) and custom up to 12x12; XP, levels and leaderboards.

**Players:** students from 10 up and adults, mostly on mid-range Android phones; laptops second.

**Three themes, chosen by the player** (owner's decision, 2026-10-12):

| Theme | Modes | Character | Fonts |
|---|---|---|---|
| 1. Tabletop (Minimalist Premium; the default) | maple table, walnut | By day a board game on a table with knife marks in its grain: a pale mint felt mat in a wood-grain rim casting a shadow; lines and dots engraved in the felt, a printed guide under every line, solid box fills with a rim; cream cards; burnt orange for you, golden yellow for the opponent, each with their own line colour. At night sleek and modern: a Dark Walnut Brown board of matte felt-paper with a fine dusty grain on a Deep Walnut Brown page, no rim; platinum pressed-paper strips for you and copper for the opponent, ash dots slightly raised, captured boxes a dark felt tint; walnut cards. Burnt orange (gold at night) for the main action | Jost |
| 2. Neon | dark, light | Glass and emitted light only. Dark Neon: an Obsidian Glass board with a crisp specular streak and faint light streaks, Cyber Cyan nodes glowing under the glass, Neon Magenta laser lines for you and electric lime for the opponent with a sharp reflection on the glass, Electric Violet glass tiles, in a near-black room lit by magenta and cyan, frosted cards. White Neon: a Frosted Opal Glass board, milky and evenly lit, Hot Coral nodes, Deep Electric Blue light-pipe lines for you and deep teal for the opponent, Vivid Lime glass tiles with a deeper lime edge, in a cool grey-blue room. Gold (indigo by day) for the main action | Unbounded, Manrope |
| 3. Cozy Paper | cream paper, cocoa cardstock | By day a sheet of real-looking paper on a kraft desk: cloudy formation, fibres and tooth you can see; lines and dots printed and pressed into it; hatched boxes; coral for you, indigo for the opponent. At night warm and tactile: a Deep Cocoa Brown sheet of heavyweight cardstock (fine tooth, micro-fibres, flecks) on a Dark Coffee Brown desk; ivory paper dots and warm beige die-cut strips for you (denim blue for the opponent), each with a flat drop shadow; captured boxes a parchment wash. Paper-tab buttons; indigo (gold at night) for the main action | Kalam (names, scores, headings), Atkinson Hyperlegible (everything else) |

A theme changes tokens, its materials (backgrounds, the board surface, SVG effects for lines, dots and boxes) and a few component variants, never `rules.ts` or the board's input logic.

## Theme picker

Not in the mockups (the spec lists it as an enhancement); added at the owner's request on 2026-10-12.

- `data-skin` on the root element (`table`, `neon`, `paper`) beside today's `data-theme` (`light`, `dark`); every token set is `[data-skin="…"]` plus `[data-skin="…"][data-theme="dark"]`.
- Saved in `dnb:settings` as an extra field, `skin`, so old saved settings still load; new players start on Minimalist Premium.
- A theme button in the top bar (44 px, beside the level chip, so the bar keeps its height) opens a small theme sheet: the three themes with a preview swatch each, and light or dark. Settings has the same choice.
- An inline script in `index.html` sets `data-skin` and `data-theme` from `dnb:settings` before the first paint, so a reload never flashes the wrong theme.

## Colors

The front matter holds every token (names prefixed by theme and mode). The palettes are the owner's. Tabletop and Paper by day (2026-10-12): Paper uses orange #FF8C32, teal #00B58C, indigo #4657CE, cyan #21BDCA and coral #FC4422; Tabletop uses burnt orange #D77027, pale mint #C4DFC9, pastel yellow #F7CD70 and golden yellow #F4AF3D. Tabletop at night, Paper at night and both Neon modes (2026-10-15, superseding the Deep Plum night palette of 2026-10-13): warm browns for the two paper themes (Tabletop: page #4F3B32 Deep Walnut Brown, board #5A4538 Dark Walnut Brown, dots #D6D3CE, platinum lines #E5E4E2; Paper: page #492E1F Dark Coffee Brown, board #513626 Deep Cocoa Brown, dots #F3EAD7, beige lines #E8D5B5), and glass and light for Neon (Dark Neon: board #0B0F19 Obsidian Glass, dots #00F0FF Cyber Cyan, lines #FF007F Neon Magenta, tiles #7B2CBF Electric Violet; White Neon: board #EBF1F5 Frosted Opal Glass, dots #FF4500 Hot Coral, lines #0047FF Deep Electric Blue, tiles #39FF14 Vivid Lime). **Violet appears only in Dark Neon's captured tiles.** Each of these four modes sets every colour token in its own block (`[data-skin="..."][data-theme="..."]`), so none can fall back to another theme's colours; Neon's shared block holds only type and shapes. Deeper or lighter shades appear only where text, a line, a ring or a glow needs the contrast.

**Buttons have their own colour**, used by no player, board or surface (owner, 2026-10-13): gold #F2B84B with dark labels at night in every theme; by day the existing action colours (burnt orange in Tabletop, indigo in Neon and Paper). Every button has depth: a sheen over its fill (lighter at the top, the plain fill across the middle where the label sits, a darker foot shaded in the theme's own hue), a bright top edge and a shadow below; switches are a recessed track with a raised knob. Hover deepens the main action by day (its white label gains contrast) and brightens it at night (its dark label gains contrast).

**Each player has their own line colour in every theme** (owner, 2026-10-13), Tabletop included: burnt orange #BF4E1E and dark golden #7C5E08 engraved in the pale felt by day. In the 2026-10-15 modes the brief gives one line colour per theme, which is player 1's; player 2's was chosen to stand apart in hue and for every colour vision type (CIE dE 37 or more under protanopia and deuteranopia): copper #E0A070 beside Tabletop's platinum, denim blue #8FB8D6 beside Paper's beige, electric lime #C6FF00 beside Dark Neon's magenta, deep teal #007F73 beside White Neon's blue (blue and teal light mix to azure where their glows cross; blue with a pink-red would mix to violet). The brief also gives one style for captured boxes per theme: both players' tiles share it, and the rim colour, the stripes or dots and the initial in each player's colour tell them apart.

Rules: text at least 4.5:1, large text and icons at least 3:1, each player's lines (and box edges) at least 3:1 against the board, never colour alone (boxes carry stripes or dots and an initial, the turn pill names the player). Limits handled:
- Tabletop by day: burnt orange carries white labels only at 19 px bold (3.4:1); the pale felt makes box fills too light against it, so each player's boxes get a rim (4.2:1 and 3.6:1). The two line colours differ in hue and lightness so they can be told apart at a glance.
- Tabletop and Paper at night: no light pool, vignette or other visible gradient on the board or the page (the owner's paper rules), so contrast is the same everywhere: platinum 7.1:1 and copper 4.0:1, beige 7.7:1 and denim 5.3:1, ash dots 6.1:1, ivory dots 9.4:1 (measured from pixels).
- White Neon: Hot Coral dots sit at 3.02:1 on the opal board, so they have no lighter highlight, no transparency and no glow round them (the glass only ever lightens the board, which raises their contrast); the light-pipe core inside each line keeps 85% of the line's colour, so the lightest part of a line stays at 3:1 or more (blue 4.3:1, teal 3.3:1).
- Dark Neon: magenta lines measure 5.1:1 at their darkest edge and 6.3:1 typically; lime lines 16:1, cyan dots 14:1; the initials on the violet tiles 6.9:1 and 8.5:1.
- Neon by day: coral reaches 3.5:1 on white, so it draws lines and large numbers, never small text.
- Small text straight on a textured page (not on a card) uses full ink on Tabletop's wood and Paper's desk by day: muted text fell below 4.5:1 over the sharper grain, knife marks and fibres.
- In every 2026-10-15 mode the two players' line colours differ in hue and in lightness or saturation, for players who see no colour.

## Materials

The tiles are seamless and a page loads only its theme's tiles (`src/assets/textures/`); every mode stays within 50 KB of texture. Day tiles are drawn at twice their CSS size (paper at 1.5x).
- **Tabletop by day:** planks of maple with waved grain, latewood lines, pores, knife marks and a few deeper gouges, a seam every 256 px, light from above and darker edges; the board is felt (crisp short fibres in a soft-light tile) under a lamp, inside a 10 px rim drawn with inset shadows plus a wood-grain ring, so the board's size (and `boardFit.ts`) is unchanged; lines and dots get an engrave effect.
- **Tabletop at night:** one neutral tile, `grain.webp` (20 KB): a fine dusty grain with very soft micro-shadows (a faint relief lit from the top left) and sparse dust, in soft-light over both the walnut page and the felt-paper board, even all over; the board has no rim, just a slim darker edge, a faint lit top edge and a very soft shadow; lines and dots get the lift effect (`fx-lift`: a soft drop shadow in three steps, no blur, under a faint lit edge), and dots are almost flat, matte discs.
- **Neon:** glass and light only, faked with cheap static layers: no backdrop-filter, no blur and no texture on the board. Dark Neon's obsidian board has a top sheen, faint light streaks and a crisp specular streak drawn over the nodes and lines, so they read as lit under the glass; White Neon's opal board has a milky sheen and a soft inner glow that only ever lighten it. Glow is built from plain strokes: four wider, fainter copies under each line (`.halos`, drawn under the tiles, so the glow never tints a captured tile), a lighter core inside each line, Dark Neon's sharp reflection of each line a little below it on the glass (`.reflect`) and its glow round each node (`.dot-halos`). Captured tiles get a glass base and a crisp highlight across their top left corner. The room is an aurora of soft radial-gradient lights that step four times a second and hold still during a drag and with Animations off (magenta and cyan in a neutral near-black room at night: magenta light on navy, or crossing cyan light, turned violet; coral, blue and lime in a cool grey-blue room by day). Glow follows a hierarchy: the main action most, then the selected option and the turn pill, then hover.
- **Paper by day:** a paper tile with cloudy formation, short curved fibres and tooth that multiplies onto the cream sheet and the kraft desk; lines and dots get an emboss effect (pressed into the paper) and dots are printed beads.
- **Paper at night:** one neutral tile, `cardstock.webp` (37 KB): heavyweight cardstock with fine embossed tooth, short micro-fibres and small organic flecks, in soft-light over the coffee desk and the cocoa sheet, even all over; lines and dots get a flat drop shadow (`fx-flat`, like a separate layer of paper, crisp edges) and dots are near-flat ivory discs.
- The effects live once in the board's SVG `<defs>` (`fx-engrave`, `fx-emboss`, `fx-lift`, `fx-flat`, `dot-bead`, `tile-gloss`), sized from the dot spacing, and each theme picks them through tokens (`--ln-filter`, `--dot-filter`, `--bx-filter`, `--cores`, `--halos`, `--reflect`, `--dot-halos`, `--gloss`). Moves still paint by the next frame on 12x12 boards and on slowed phones.

## Typography

As specified per theme, self-hosted (woff2, Latin and Latin Extended subsets, `font-display: swap`), replacing the Google Fonts link. Each theme loads at most 2 families: the browser fetches only the active theme's files.

**Ghanaian letters:** Jost, Manrope, Kalam and Atkinson Hyperlegible lack Ɛ ɛ Ɔ ɔ Ɖ ɖ Ƒ Ɣ ɣ Ʋ ʋ Ʒ ʒ (Kalam and Atkinson also Ŋ ŋ) and the cedi sign. Tiny subsets of Montserrat (for Jost), Inter (for Manrope) and Noto Sans (for Kalam and Atkinson) join each family for just those characters and load only when such a name is on screen. Unbounded has them all.

## Layout

The same single column in every theme: top bar (brand, level chip), two player cards, the turn pill, chips, the board, then Quit and Restart. Cozy Paper spreads into two pages on desktop. Breakpoints from the spec: phones under 640 px never scroll and the board is the viewport width minus 32 px; tablets use the phone layout up to 600 px wide; desktops one column at most 680 px. `available()` in `src/lib/boardFit.ts` must match each theme's chrome, or measure the board container.

## Components

The spec's component tables (per theme, with states) are the reference: player cards with avatars, the sliding turn pill with the extra-turn cue, chips, the board skin, Quit and Restart, a themed confirm dialog in place of `confirm()`, Setup, the avatar builder and the results dialog.

**Playing the board.** Drag from a dot towards a neighbouring dot: a thin elastic band stretches from the picked-up dot (which gets a ring) to the pointer, bowing when swung and settling straight at rest, while a broken ring turns round each dot it can land on (its neighbours across a free line). Once the pointer is past halfway the band springs onto that dot with a small bounce, at the line's full width inside the keyboard cursor's ring, which takes over from that dot's turning ring; letting go draws the line, letting go anywhere else springs the band back to its dot. With Animations off the band follows the pointer exactly and nothing turns or bounces. Tapping or clicking a line still draws it, and a press on a line can be dragged to adjust before letting go. A tap right on a dot draws nothing when more than one free line meets there. Arrows and Enter play from the keyboard. With Sound on, picking up a dot ticks, a snap clicks, the drawn line plays its usual note and a cancelled drag falls away. The hover preview and the drag line use the mover's line colour (at least 3:1 on every board); a dot under the mouse shows a grab cursor.

## Accessibility

From the spec's shared section: the contrast rules above; a visible 2-3 px focus ring in the theme's focus colour; the board stays a keyboard widget (`role="application"`, arrows and Enter), and its keyboard cursor is a translucent band inside a 3 px ring in the focus colour (gold in every theme at night), at least 3:1 on every board; touch targets at least 44 px and a dot gap of at least 40 px; the Animations setting and `prefers-reduced-motion` remove motion; dialogs with `role="dialog"`, `aria-modal`, a labelled title, a focus trap and Play again focused; the live-region announcement keeps every move and adds "extra turn". Avatars are decoration; the name carries identity.

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-10-15 | Tabletop and Cozy Paper at night become warm browns, matte and tactile; Dark Neon and White Neon become glass and emitted light; violet only in Dark Neon's captured tiles | The owner's brief: dark Tabletop and Paper "render violet. Tables and paper aren't violet; these themes should be warm browns". The violet was the 2026-10-13 night palette itself (Deep Plum pages, plum cards, a mauve sheet, set in each theme's night block), not a leak, a CSS order problem or a cached build (the game has no service worker). Each of the four modes now sets every colour token itself. Exact colours and materials are the owner's; Neon's page backgrounds, player 2's colours and the cards are chosen here and listed above. Tabletop and Paper by day are untouched (pixel-identical to the previous build). |
| 2026-10-15 | Neon's glow from layered strokes; no backdrop-filter and no blur filter on the board | The owner's rules ("no per-element blur... no animated blur", 60 fps on the largest board); the old glow blurred whole groups again on every frame of a growing line. |
| 2026-10-15 | Player 2 colours: copper, denim blue, electric lime, deep teal | The brief names one line colour per theme; the second is picked for contrast on the board (4.0 to 16:1) and to stay apart from player 1, the dots and the tiles for every colour vision type. White Neon first tried raspberry: its glow mixed with the blue into violet at every junction. |
| 2026-10-13 | The owner's four dark colours in every theme's dark mode: Tabletop's felt Deep Teal, Neon's glass board Deep Indigo, Paper's sheet a mauve, each page Deep Plum; lighter tints where lines, rings, glow or text need them | The owner's palette for the dark modes. They chose the felt and board colours, a Paper sheet that differs from Neon's board (mauve, picked from screenshots of the options) and lighter tints where needed. Tabletop's lamp on the felt is softer at night, so the light lines keep 3:1. |
| 2026-10-13 | Buttons have their own colour (gold at night in every theme), and every button has depth in all six modes | The owner: "the color of the button should also be different from the board or the players or any other thing, every button or element should have a depth feel… the buttons should have a modern look". They picked gold over pearl and orchid from screenshots, and asked for the depth style by day too. |
| 2026-10-13 | Each player has their own line colour in every theme, Tabletop included | The owner asked for it, so Tabletop's single engraved ink is gone. By day its two engraved colours are a brighter burnt orange and a dark golden, far enough apart in hue and lightness to tell at a glance (the first deep orange and deep golden were too close). |
| 2026-10-13 | Sharper materials: knife-marked wood, crisp felt, paper you can see | The owner: the paper texture was "not that sharp or clear", and the tabletop's should be "sharp and clear… even add knife marks". The tiles are drawn at twice their size. Small muted text straight on the wood or the paper desk by day now uses full ink to keep 4.5:1 over them. |
| 2026-10-13 | Neon: the aurora is back in both modes, with a glass board and glass cards | The owner missed "the gradient background we were using… the background looks somewhat plain" and couldn't see a glass look; the board now shows the aurora behind it in deeper colour, with a sheen and a lit edge. The benchmark found the first build's blurs kept the GPU busy and dropped frames during drags on big boards: the lights became soft gradients that step four times a second and pause for drags, and the board lost its blur (invisible over the soft aurora) but kept the colour boost. |
| 2026-10-12 | New palettes and real materials in all three themes | Owner's redesign plan: the themes looked flat and didn't use their colours. Layouts stay; tokens, backgrounds, the board surface and SVG effects change. |
| 2026-10-13 | Lines are drawn by dragging from one dot to the next, with pick-up, snap and cancel sounds; taps on lines and the keyboard still work; a tap right on a dot draws nothing | The owner's request. The snapped line reuses the keyboard cursor's ring so both selections look alike and reach 3:1; an ambiguous tap where several lines meet used to draw an arbitrary one. |
| 2026-10-13 | The drag is an elastic band with landing rings: the end stays under the pointer, the middle swings behind and settles, it bounces onto the snapped dot and springs home when let go; broken rings turn round the dots it can land on | The owner: the drag felt "too rigid and sharp" and should feel "like a rubber band", and asked for "broken rings rotating around the possible dots". The end never lags the finger (direct control); the springs are tuned so a snap bounces about a fifth of the jump and settles in about a quarter of a second. The rings use the mover's line colour (3:1 or more, as the band); the spec's preview rings on the line's dots inspired them. Animations off removes all motion. |
| 2026-10-13 | Sounds start in the player's first click, tap or key, peak around -6 dBFS through a limiter, and switching Sound on plays a short chime | The owner heard nothing on Windows: the audio engine was created as the page loaded, which browsers start paused (the first sound came about 0.8 s late), and the sounds peaked at -22 to -30 dBFS for 40-70 ms, too quiet for PC speakers. The chime lets a player hear at once that Sound works. |
| 2026-10-13 | The hover preview and the drag line use the mover's line colour instead of the player colour at 75% | QA: the old preview reached only 1.9-3:1 in four modes; the line colours reach 3:1 on every board. Since each player has their own line colour (2026-10-13), Tabletop's preview is the mover's colour too. |
| 2026-10-13 | Every control answers hover and press, and the dark modes declare a dark colour scheme | Design review: only buttons reacted to the pointer, so options, theme cards, chips, Back, switches and steppers now get a hover tint (a faint ring in Neon, a lift on Tabletop's chips) and a small press, as the plan's controls-and-states step asks; dark scrollbars at night and selected text in the accent. |
| 2026-10-12 | The keyboard cursor gets a 3 px focus ring round the line (brass in Tabletop at night; gold in every theme at night since 2026-10-13) | QA measured the old 35% accent band at 1.4-1.9:1 against the new boards; the spec's shared rule asks for a focus ring, and the felt under the light is too pale for turquoise. Measured 4-7.4:1 from pixels. |
| 2026-10-12 | Tabletop lines stay one colour for both players, engraved; boxes get a rim (lines superseded on 2026-10-13: each player's own colour) | On a game board the lines are part of the board; ownership shows in the boxes, whose fills are too light against the pale felt without a rim. |
| 2026-10-12 | Paper at night: coral for player 1 | Orange and cyan have the same lightness, so players who see no colour couldn't tell the lines apart; coral against cyan differs in hue and lightness. |
| 2026-10-12 | Neon glow follows a hierarchy | Main action, then the selected option and the turn pill, then hover only, so the screen stays readable. |
| 2026-10-12 | Ghanaian letters: per-theme fallback subsets | The owner chose the recommended option over the phone's font or another face. |
| 2026-10-12 | The theme is its own saved setting (`skin`) beside light and dark; Tabletop is the default; fonts are self-hosted, split by unicode-range | Old saved settings keep working; the first paint uses the right theme; no third-party font request. |
| 2026-10-12 | Paper ticks the chosen option; level up is a chip in Tabletop and Neon; primary buttons darken towards their lip on hover (by day; at night the gold ones brighten, since 2026-10-13) | Found in the design review of the first theme PR: a non-colour cue where Paper has no ring, readable level-up text, and hover that keeps label contrast. |
| 2026-10-12 | The owner's UI themes spec and its mockups are the locked design | The spec replaces the overhaul brief's candidate-directions step; PR 00 records it here and the following PRs build it. The spec stays outside version control because it includes tool-specific handoff notes; the mockups and these tokens are committed. |
| 2026-10-12 | Build all three themes and let players switch between them; Minimalist Premium is the default | Owner's decision. The spec recommends Minimalist Premium as the main look; its theme picker enhancement is now in scope. |
| 2026-10-12 | Theme picker: a top-bar theme button opening a theme sheet, plus a Theme setting | Not covered by the mockups; designed to keep the top bar's height and each theme's own controls. |
| 2026-10-12 | Fonts ship as specified; the missing Ghanaian letters are an open question | Locked spec: changes it doesn't cover wait for the owner. |
| 2026-10-11 | Earlier consultation candidates (six material directions, then three glass finishes) set aside | Superseded by the owner's spec. |
