---
# gstack: design-md-format=spec
# The UI design is locked to docs/design/ui-themes-spec.md and docs/design/mockups/.
# These tokens copy the spec's tables (palettes updated by the owner on 2026-10-12, the dark modes on 2026-10-13, Tabletop at night,
# Paper at night and both Neon modes on 2026-10-15, and Sienna Brown and Dark Neon's player colours on 2026-10-19); where they
# differ, the spec wins.
name: Grid Rivals
description: A two-player game of lines and boxes with three themes players can switch between; Minimalist Premium, a board game on a table, is the default.
colors:
  # 1. Tabletop: maple table (light) and the same wood stained Sienna (dark). By day: burnt orange, pale mint, pastel and golden yellow.
  #    At night (owner, 2026-10-19: the day's textures in Sienna Brown): the day's maple planks stained Sienna, the day's felt in its
  #    rim in deeper Sienna, platinum lines for you and copper for the other player, ash dots, a dark felt tint for boxes, gold buttons.
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
  table-light-last-dot: "#2B7BB9"   # the last-move pip: the mockup's blue, 3.18:1 on the mint felt
  table-dark-table: "#A0592B"   # the wood's average: the day's maple tile multiplied onto #B77D5F
  table-dark-felt: "#6A3A1C"
  table-dark-frame: "#4A2410"
  table-dark-line-1: "#E5E4E2"
  table-dark-line-2: "#E0A070"
  table-dark-dot: "#D6D3CE"
  table-dark-last-dot: "#4D9BD9"   # the last-move pip, lighter for 3.14:1 on the Sienna felt
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
  table-dark-head-ink: "#FFFFFF"   # text straight on the table
  table-dark-pill: "#6B3A1E"
  table-dark-control: "#653519"
  table-dark-select-tint: "#7A4628"
  table-dark-sel-ring: "#F2B84B"
  table-dark-focus: "#F2B84B"
  table-dark-gold: "#FFD08A"
  # 2. Neon, dark and light (owner, 2026-10-15): glass and emitted light only. Dark Neon: a clear liquid-glass board (2026-10-20) over the room, Cyber Cyan
  #    nodes, Bright Magenta-Red lines for you and Golden Orange for the other player (2026-10-19), Electric Violet glass tiles (the
  #    only violet in any theme), a room fading from Dark Wine to near-black. White Neon: the same clear glass, lighter, Hot Coral nodes, Deep Electric Blue lines for you
  #    and deep teal for the other player, Vivid Lime glass tiles with a deeper lime edge, a cool grey-blue room.
  neon-dark-page: "#350014"   # Dark Wine: the top of the room and the browser bar
  neon-dark-aurora: "linear-gradient(160deg, #350014, #14030A 30%, #07080B 60%, #050608), lights #BD0249, #00F0FF at 20%"
  neon-dark-board: "#0B0F19"   # Obsidian: under the tiles and the last-move ring's centre
  neon-dark-glass: "rgba(8,10,20,.36)"   # the board itself: a clear pane the room shows through (2026-10-20)
  neon-dark-text: "#F1F5FF"
  neon-dark-muted: "#AEB8CC"
  neon-dark-p1: "#BD0249"
  neon-dark-p1-deep: "#E8195C"
  neon-dark-p1-soft: "#4E011F"   # Deep Burgundy, under "Your turn"
  neon-dark-p2: "#E28C19"
  neon-dark-p2-deep: "#E28C19"
  neon-dark-line-1: "#C3064F"   # a hair lighter than #BD0249, for 3:1 on the glass
  neon-dark-line-2: "#E28C19"
  neon-dark-box: "#7B2CBF"   # at 78%, both players
  neon-dark-box-rim: "#A970F0"
  neon-dark-initial-1: "#FFFFFF"
  neon-dark-initial-2: "#FFD89A"
  neon-dark-dot: "#00F0FF"
  neon-dark-last-fill: "#0B0F19"   # the last-move ring's centre: the board
  neon-dark-accent: "#F2B84B"
  neon-dark-on-accent: "#241005"
  neon-dark-sel-ring: "#F2B84B"
  neon-dark-panel: "rgba(17,18,22,.7)"
  neon-dark-panel-strong: "rgba(30,32,38,.78)"
  neon-dark-focus: "#F2B84B"
  neon-dark-gold: "#FFD08A"
  neon-light-page: "#D5DEE7"
  neon-light-aurora: "linear-gradient(160deg, #DFE6EE, #D5DEE7 55%, #D8E4EB), lights #FF4500, #0047FF, #39FF14 at 12%"
  neon-light-board: "#EBF1F5"   # Opal: under the tiles and the last-move ring's centre
  neon-light-glass: "rgba(248,251,253,.74)"   # the board itself, light enough that the coral dots keep 3:1 (2026-10-20)
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
  neon-light-last-fill: "#EBF1F5"   # the last-move ring's centre: the board
  # 3. Cozy Paper: a cream sheet on a kraft desk (light). By day orange, teal, indigo, cyan and coral. At night (owner, 2026-10-19:
  #    the day's texture in Sienna Brown): the day's paper on a Sienna desk and a deeper Sienna sheet, ivory paper dots, warm beige
  #    die-cut strips for you and denim blue for the other player, a parchment wash for boxes, gold buttons.
  paper-light-desk: "#E6DCC7"
  paper-light-page: "#FCF8EF"
  paper-light-graphite: "#2E2B27"
  paper-light-graphite-2: "#625A50"
  paper-light-p1: "#FC4422"
  paper-light-p1-wash: "#FFE1D8"
  paper-light-line1: "#EF4120"   # your lines: the coral 5% deeper, for 3:1 on the textured sheet (owner, 2026-10-20)
  paper-light-p2: "#4657CE"
  paper-light-p2-wash: "#E2E5FA"
  paper-light-accent: "#4657CE"
  paper-light-select-tint: "#D3F2EA"
  paper-light-sel-ring: "#007F62"
  paper-light-ring: "#00936F"
  paper-light-gold: "#B04E07"
  paper-dark-desk: "#A0592B"   # the desk's average: the day's paper tile multiplied onto #A75E2F
  paper-dark-page: "#6A3A1C"   # the sheet's average: the paper tile twice over, onto #734121
  paper-dark-graphite: "#F6EEDF"
  paper-dark-graphite-2: "#DCCBB3"
  paper-dark-head-ink: "#FFFFFF"   # text straight on the desk
  paper-dark-p1: "#E8D5B5"
  paper-dark-p1-deep: "#F0E2C6"
  paper-dark-line1: "#C9B085"   # your lines: Deep Sand Beige (owner, 2026-10-20)
  paper-dark-p2: "#8FB8D6"
  paper-dark-p2-deep: "#A5C6E0"
  paper-dark-wash: "#F3EAD7"   # at 20%, both players
  paper-dark-initial-1: "#FFF6E4"
  paper-dark-initial-2: "#C9E0F2"
  paper-dark-dot: "#F3EAD7"
  paper-dark-accent: "#F2B84B"
  paper-dark-on-accent: "#241005"
  paper-dark-panel: "#6B3A1E"
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
| 1. Tabletop (Minimalist Premium; the default) | maple table, Sienna table | By day a board game on a table with knife marks in its grain: a pale mint felt mat in a wood-grain rim casting a shadow; lines and dots engraved in the felt, a printed guide under every line, solid box fills with a rim; cream cards; burnt orange for you, golden yellow for the opponent, each with their own line colour. At night the same table after dark (2026-10-19): the maple planks stained Sienna Brown, the felt mat in its rim in deeper Sienna; platinum pressed-paper strips for you and copper for the opponent, ash dots slightly raised, captured boxes a dark felt tint; deep Sienna cards. Burnt orange (gold at night) for the main action | Jost |
| 2. Neon | dark, light | Glass and emitted light only. Dark Neon: a clear liquid-glass board ("Clear crystal": a lit rim, a lit band inside it, prism fringes), Cyber Cyan nodes glowing under the glass, Bright Magenta-Red laser lines for you and Golden Orange for the opponent with a sharp reflection on the glass, Electric Violet glass tiles, in a room fading from Dark Wine to near-black, lit by magenta-red and cyan, frosted cards. White Neon: the same clear glass, lighter, with blue and coral fringes, Hot Coral nodes, Deep Electric Blue light-pipe lines for you and deep teal for the opponent, Vivid Lime glass tiles with a deeper lime edge, in a cool grey-blue room. Gold (indigo by day) for the main action | Unbounded, Manrope |
| 3. Cozy Paper | cream paper, Sienna paper | By day a sheet of real-looking paper on a kraft desk: cloudy formation, fibres and tooth you can see; lines and dots printed and pressed into it; hatched boxes; coral for you, indigo for the opponent. At night the same paper after dark (2026-10-19): a deeper Sienna sheet on a Sienna Brown desk, both with the day's formation, fibres and tooth; ivory paper dots and warm beige die-cut strips for you (denim blue for the opponent), each with a flat drop shadow; captured boxes a parchment wash. Paper-tab buttons; indigo (gold at night) for the main action | Kalam (names, scores, headings), Atkinson Hyperlegible (everything else) |

A theme changes tokens, its materials (backgrounds, the board surface, SVG effects for lines, dots and boxes) and a few component variants, never `rules.ts` or the board's input logic.

## Theme picker

Not in the mockups (the spec lists it as an enhancement); added at the owner's request on 2026-10-12.

- `data-skin` on the root element (`table`, `neon`, `paper`) beside today's `data-theme` (`light`, `dark`); every token set is `[data-skin="…"]` plus `[data-skin="…"][data-theme="dark"]`.
- Saved in `dnb:settings` as an extra field, `skin`, so old saved settings still load; new players start on Minimalist Premium.
- A theme button in the top bar (44 px, beside the level chip, so the bar keeps its height) opens a small theme sheet: the three themes with a preview swatch each, and light or dark. Settings has the same choice.
- An inline script in `index.html` sets `data-skin` and `data-theme` from `dnb:settings` before the first paint, so a reload never flashes the wrong theme.

## Colors

The front matter holds every token (names prefixed by theme and mode). The palettes are the owner's. Tabletop and Paper by day (2026-10-12): Paper uses orange #FF8C32, teal #00B58C, indigo #4657CE, cyan #21BDCA and coral #FC4422; Tabletop uses burnt orange #D77027, pale mint #C4DFC9, pastel yellow #F7CD70 and golden yellow #F4AF3D. Tabletop at night, Paper at night and both Neon modes (2026-10-15, superseding the Deep Plum night palette of 2026-10-13; updated 2026-10-19): the two paper themes take their day textures in Sienna Brown #A0592B (Tabletop: the maple planks stained Sienna, the felt #6A3A1C in a #4A2410 rim, dots #D6D3CE, platinum lines #E5E4E2; Paper: a Sienna desk and a #6A3A1C sheet in the day's paper, dots #F3EAD7, Deep Sand Beige lines #C9B085 since 2026-10-20; cards #6B3A1E in both), and glass and light for Neon (Dark Neon: board #0B0F19 Obsidian Glass, dots #00F0FF Cyber Cyan, Bright Magenta-Red #BD0249 for you with Deep Burgundy #4E011F under your turn and Dark Wine #350014 at the top of the room, Golden Orange #E28C19 for the other player, tiles #7B2CBF Electric Violet; White Neon: board #EBF1F5 Frosted Opal Glass, dots #FF4500 Hot Coral, lines #0047FF Deep Electric Blue, tiles #39FF14 Vivid Lime). **Violet appears only in Dark Neon's captured tiles.** Each of these four modes sets every colour token in its own block (`[data-skin="..."][data-theme="..."]`), so none can fall back to another theme's colours; Neon's shared block holds only type and shapes. Deeper or lighter shades appear only where text, a line, a ring or a glow needs the contrast.

**Buttons have their own colour**, used by no player, board or surface (owner, 2026-10-13): gold #F2B84B with dark labels at night in every theme; by day the existing action colours (burnt orange in Tabletop, indigo in Neon and Paper). Every button has depth: a sheen over its fill (lighter at the top, the plain fill across the middle where the label sits, a darker foot shaded in the theme's own hue), a bright top edge and a shadow below; switches are a recessed track with a raised knob. Hover deepens the main action by day (its white label gains contrast) and brightens it at night (its dark label gains contrast).

**Each player has their own line colour in every theme** (owner, 2026-10-13), Tabletop included: burnt orange #BF4E1E and dark golden #7C5E08 engraved in the pale felt by day. In the 2026-10-15 modes the brief gives one line colour per theme, which is player 1's; player 2's was chosen to stand apart in hue and for every colour vision type (CIE dE 37 or more under protanopia and deuteranopia): copper #E0A070 beside Tabletop's platinum, denim blue #8FB8D6 beside Paper's beige, golden orange #E28C19 beside Dark Neon's magenta-red (the owner's own pair since 2026-10-19; it replaced electric lime), deep teal #007F73 beside White Neon's blue (blue and teal light mix to azure where their glows cross; blue with a pink-red would mix to violet). The brief also gives one style for captured boxes per theme: both players' tiles share it, and the rim colour, the stripes or dots and the initial in each player's colour tell them apart.

Rules: text at least 4.5:1, large text and icons at least 3:1, each player's lines (and box edges) at least 3:1 against the board, never colour alone (boxes carry stripes or dots and an initial, the turn pill names the player). Limits handled:
- Tabletop by day: burnt orange carries white labels only at 19 px bold (3.4:1); the pale felt makes box fills too light against it, so each player's boxes get a rim (4.2:1 and 3.6:1). The two line colours differ in hue and lightness so they can be told apart at a glance.
- Tabletop and Paper at night: no light pool, vignette or other visible gradient on the board or the page (the owner's paper rules), so contrast is the same everywhere: platinum 7.5:1 and copper 4.3:1, beige 6.6:1 and denim 4.5:1, ash dots 6.5:1, ivory dots 8.1:1 (measured from pixels). The Sienna table and desk sit between light and dark: text straight on them (not on a card) is white (`--head-text`), which keeps 4.6:1 or more over the lightest grain and fibres; warm off-white fell to 4.0-4.4:1.
- White Neon: Hot Coral dots sit at 3.02:1 on the opal board, so they have no lighter highlight, no transparency and no glow round them (the glass only ever lightens the board, which raises their contrast); the light-pipe core inside each line keeps 85% of the line's colour, so the lightest part of a line stays at 3:1 or more (blue 4.3:1, teal 3.3:1).
- Dark Neon: Bright Magenta-Red #BD0249 is 2.98:1 on the Obsidian Glass, so the board's lines use #C3064F, a hair lighter: on the clear glass (2026-10-20) 3.94:1 at their darkest and 4.2:1 typically (the core keeps 80% of the line's colour, so it never turns pink); orange lines 8:1, cyan dots 14:1; the initials on the violet tiles 9.3:1 (white) and 6.9:1 (pale gold).
- Neon by day: coral reaches 3.5:1 on white, so it draws lines and large numbers, never small text.
- Small text straight on a textured page (not on a card) uses full ink on Tabletop's wood and Paper's desk by day: muted text fell below 4.5:1 over the sharper grain, knife marks and fibres.
- In every 2026-10-15 mode the two players' line colours differ in hue and in lightness or saturation, for players who see no colour.

## Materials

The tiles are seamless and a page loads only its theme's tiles (`src/assets/textures/`). Day tiles are drawn at twice their CSS size (paper at 1.5x). Tabletop and Paper at night reuse their day tiles (2026-10-19), so switching between day and night downloads nothing new; Tabletop's two tiles total 79 KB, over the 50 KB the 2026-10-15 brief allowed its own night textures.
- **Tabletop by day:** planks of maple with waved grain, latewood lines, pores, knife marks and a few deeper gouges, a seam every 256 px, light from above and darker edges; the board is felt (crisp short fibres in a soft-light tile) under a lamp, inside a 10 px rim drawn with inset shadows plus a wood-grain ring, so the board's size (and `boardFit.ts`) is unchanged; lines and dots get an engrave effect.
- **Tabletop at night:** the day's tiles (2026-10-19): the maple planks multiplied onto #B77D5F, so the wood averages Sienna Brown #A0592B, with the plank seams, evenly lit (no light from above or darker edges); the felt tile on the deep Sienna felt, veiled to 45% (its nap reads far stronger on a dark felt than on the day's pale one), inside the day's rim with its wood ring stained darker Sienna; lines and dots get the lift effect (`fx-lift`: a soft drop shadow in three steps, no blur, under a faint lit edge), and dots are almost flat, matte discs.
- **Neon:** liquid glass, "Clear crystal" (the owner's pick from three built variants, 2026-10-20): a clear pane the room's light shows through (`--glass`), its edge thick enough to gather light: a crisp rim, bright where the light hits (top left, bottom right) and faint between, a lit band just inside it, thin colour fringes like a prism (cyan and magenta-red at night, blue and coral by day), light catching the top and left edges and a soft glow in the corner. All static layers: no backdrop-filter, no blur and no texture, so nothing behind the board is redrawn while a line grows or a drag moves. White Neon's pane stays light enough that its coral dots keep 3:1. Under the tiles and in the last-move ring the solid `--board` colour remains. Glow is built from plain strokes: four wider, fainter copies under each line (`.halos`, drawn under the tiles, so the glow never tints a captured tile), a lighter core inside each line, Dark Neon's sharp reflection of each line a little below it on the glass (`.reflect`) and its glow round each node (`.dot-halos`). Captured tiles get a glass base and a crisp highlight across their top left corner. The room is an aurora of soft radial-gradient lights that step four times a second and hold still during a drag and with Animations off (magenta-red and cyan at night, over a gradient from Dark Wine to near-black: magenta light on navy, or crossing cyan light, turned violet; coral, blue and lime in a cool grey-blue room by day). Glow follows a hierarchy: the main action most, then the selected option and the turn pill, then hover.
- **Paper by day:** a paper tile with cloudy formation, short curved fibres and tooth that multiplies onto the cream sheet and the kraft desk; lines are coloured-pencil strokes (0.048 of a gap since 2026-10-20) with a hand's wobble and a faint second stroke on boards up to 6x6 (straight above), pressed into the paper like the dots (an emboss effect), which are printed beads; boxes are hatched, single strokes for player 1 and a cross-hatch for player 2, over a wash.
- **Paper at night:** the day's tile (2026-10-19), multiplied onto #A75E2F so the desk averages Sienna Brown #A0592B, and twice over (offset) onto #734121 for the sheet, which averages #6A3A1C (once is too faint to see on a dark sheet); even all over; lines and dots get a flat drop shadow (`fx-flat`, like a separate layer of paper, crisp edges) and dots are near-flat ivory discs.
- The effects live once in the board's SVG `<defs>` (`fx-engrave`, `fx-emboss`, `fx-lift`, `fx-flat`, `dot-bead`, `tile-gloss`), sized from the dot spacing, and each theme picks them through tokens (`--ln-filter`, `--dot-filter`, `--bx-filter`, `--cores`, `--halos`, `--reflect`, `--dot-halos`, `--gloss`). Moves still paint by the next frame on 12x12 boards and on slowed phones.

## Typography

As specified per theme, self-hosted (woff2, Latin and Latin Extended subsets, `font-display: swap`), replacing the Google Fonts link. Each theme loads at most 2 families: the browser fetches only the active theme's files.

**Ghanaian letters:** Jost, Manrope, Kalam and Atkinson Hyperlegible lack Ɛ ɛ Ɔ ɔ Ɖ ɖ Ƒ Ɣ ɣ Ʋ ʋ Ʒ ʒ (Kalam and Atkinson also Ŋ ŋ) and the cedi sign. Tiny subsets of Montserrat (for Jost), Inter (for Manrope) and Noto Sans (for Kalam and Atkinson) join each family for just those characters and load only when such a name is on screen. Unbounded has them all.

## Layout

The same single column in every theme: top bar (brand, level chip), two player cards, the turn pill, chips, the board, then Quit and Restart. Cozy Paper spreads into two pages on desktop. Breakpoints from the spec: phones under 640 px never scroll and the board is the viewport width minus 32 px; tablets use the phone layout up to 600 px wide; desktops one column at most 680 px. `available()` in `src/lib/boardFit.ts` must match each theme's chrome, or measure the board container.

## Components

The spec's component tables (per theme, with states) are the reference: player cards with avatars, the sliding turn pill with the extra-turn cue, chips, the board skin, Quit and Restart, a themed confirm dialog in place of `confirm()`, Setup, the avatar builder and the results dialog.

**Playing the board.** Drag from a dot towards a neighbouring dot: a thin elastic band stretches from the picked-up dot (which gets a ring) to the pointer, bowing when swung and settling straight at rest, while a broken ring turns round each dot it can land on (its neighbours across a free line). Once the pointer is past halfway the band springs onto that dot with a small bounce, at the line's full width inside the keyboard cursor's ring, which takes over from that dot's turning ring; letting go draws the line, letting go anywhere else springs the band back to its dot. With Animations off the band follows the pointer exactly and nothing turns or bounces. Tapping or clicking a line still draws it, and a press on a line can be dragged to adjust before letting go. A tap right on a dot draws nothing when more than one free line meets there. Arrows and Enter play from the keyboard. With Sound on, picking up a dot ticks, a snap clicks, the line pops as it drops in and a cancelled drag falls away; a tapped, clicked or keyboard line (and the other player's) plays the line's soft tock, and every button gives a dry tick of its own. The hover preview and the drag line use the mover's line colour (at least 3:1 on every board); a dot under the mouse shows a grab cursor. In Neon at night each landing ring carries a bright core, like the lines.

**Board marks (the spec's step 2).** The last move is marked in the board's neutral dot or ink colour, never a player's or the buttons' gold: a pip on its line in Tabletop (edged in the felt's colour, engraved like the dots), with the line itself a shade stronger (darker by day, lighter at night); an indicator ring that glows like the dots in Neon; a hand-drawn pencil ellipse round it in Paper, drawn twice with the second pass faint. Boxes carry their owner's mark: in Tabletop against the AI a person for you and a bot for the AI (white, or dark on golden yellow), initials otherwise; in Neon an initial over stripes or dots; in Paper a bigger handwritten initial, leaning a little, over single or cross hatching. Never colour alone: every mark comes with a pattern, an initial or an icon.

## Accessibility

From the spec's shared section: the contrast rules above; a visible 2-3 px focus ring in the theme's focus colour; the board stays a keyboard widget (`role="application"`, arrows and Enter), and its keyboard cursor previews the line Enter will draw as hovering does (in the mover's line colour) inside a 3 px ring in the focus colour (gold in every theme at night), at least 3:1 on every board, on the player's turn only; touch targets at least 44 px and a dot gap of at least 40 px; the Animations setting and `prefers-reduced-motion` remove motion; dialogs with `role="dialog"`, `aria-modal`, a labelled title, a focus trap and Play again focused; the live-region announcement keeps every move and adds "extra turn". Avatars are decoration; the name carries identity.

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-10-20 | Neon's board is clear liquid glass ("Clear crystal") in both modes | The owner: "the glassy look of the board you have made doesn't look glassy at all. If possible make it liquid glass, just like iphone's IOS 26 UI look". Three variants were built in the game and shown side by side (clear crystal, liquid frost with a saturate backdrop filter, a bevelled slab); the owner picked the clear one. It has no filter at all, so the GPU cost is today's (the frost cost about 2.8 times the GPU work while dragging), and keeps the owner's 15 Oct rule of no per-element blur. The old opaque board hid the room, which is why it never read as glass. |
| 2026-10-20 | Lines a fifth thinner in every theme: 0.068 of a dot gap (at least 4.8 px), Paper's pencil 0.048 (at least 3.2 px) | The owner: "The lines, have thick widths, reduce the size of the widths"; asked which boards, they chose every theme. Everything sized from the line follows (Neon's glow and cores, previews, the drag band, the cursor's ring); the Home demo too. Every line still measures 3:1 or more. |
| 2026-10-20 | The board's line and dot effects cover the whole board (user space), not their group's box | The owner saw a player's first move only after the next one, against the AI, on one device and online. While the lines group held only lines along one row or one column (a game's first line), its box had no height or no width, so a filter region sized from it (Tabletop's engraving and lift, Paper's pressing and flat shadow) was empty and nothing in the group was painted until a line in the other direction arrived; Neon draws its lines without a filter and never had it. Measured from pixels: on main 4 of 36 lines (each game's first) unpainted in Chromium 151 and Brave 155, and 24 of 60 when the first three lines share a row; none with the fix. It also explains two other reports: "Random" seemed to let the owner start every game (the AI's first line was invisible), and a line seemed to draw under a resting mouse (a first click showed only with the AI's reply). |
| 2026-10-20 | Each way of playing has its own sound: a button a dry tick, a tapped, clicked or keyboard line the line's tock, a dragged line a rising pop as it drops in | The owner: "the click sounds of buttons should be different from the click sounds of the drag and droping of lines, the clicking of lines to make a move should also be different." Buttons had no sound, and a dragged line ended on the same note as a tapped one. The tick is filtered noise, with no pitch, so it can't be taken for a line, and a little quieter than the line's note; switching Sound on still plays only its chime, and a click the press didn't start on (the results dialog under a game's last tap) stays silent. The other player's lines keep the tock. |
| 2026-10-20 | The keyboard cursor is the spec's: the hover preview in the mover's line colour inside the 3 px focus ring, on the player's turn only; once its line is drawn it moves to the nearest free line | The owner asked why a line is highlighted in keyboard play (in September they asked for it to show only then). It is the line Enter will draw; the old band, 2.4 lines wide in the button colour at 35%, looked like a stray highlight. The spec's shared rule is "preview in the mover's colour; keyboard cursor adds a focus ring", with no preview while it isn't your turn. It also jumped back to the middle of the board after every line. |
| 2026-10-20 | Paper's own lines: Deep Sand Beige #C9B085 at night, the coral 5% deeper (#EF4120) by day | The owner chose Deep Sand Beige so the night lines read clearer (4.4:1 on the sheet; the other player's denim is about as light, so the two differ in hue, sand against blue, which red-green colour blindness keeps apart). By day the coral lines measured 2.99:1 on the textured sheet; the owner approved a deeper coral for the lines only (3.28:1), so names, rings and the turn pill keep #FC4422. |
| 2026-10-20 | Tabletop's last-move pip in the mockup's blue, tinted per mode (#2B7BB9 by day, #4D9BD9 at night), edged in the felt | The design review found the pip in the dot colour unreadable as a mark: nearly a dot's size and colour, it read as one more dot, worst on big boards. The mockup sets its pip apart by colour (#2F86C6); that blue is 2.76:1 on the mint felt and 2.39:1 on the Sienna one, so it is a shade darker by day and lighter at night for 3:1. A ring in the dot colour or the mover's colour was tried and did not stand out on a 7x7. Easy to change. |
| 2026-10-20 | Step 2's marks on the restyled modes; Paper's pencil lines and hatching by day only | The 2026-10-15 brief made Paper at night die-cut cardstock strips with a flat shadow and captured boxes a parchment wash; the owner's pencil choice (2026-10-14) came first, so the pencil stays with Paper by day. The last-move marks use each mode's own dot colour, and the Neon ring's centre is its board's colour. Easy to change. |
| 2026-10-19 | Tabletop and Cozy Paper at night take their day textures in Sienna Brown; cards, boards and controls in deeper Sienna | The owner asked for "the texture the white theme is using" and Sienna Brown #A0592B. Sienna is the table (Tabletop) and the desk (Paper), the surfaces that are wood and kraft by day; the cards, the felt and the sheet take deeper Sienna shades, which looked more of a piece than the old walnut and cocoa (screenshots of both were kept for the owner). The day tiles are reused, multiplied onto a colour chosen so they average Sienna, so no new texture ships. Text straight on the page turns white: nothing else keeps 4.5:1 over the light grain. |
| 2026-10-19 | Dark Neon: Bright Magenta-Red for you, Golden Orange for the other player | The owner replaced the pink with Bright Magenta-Red #BD0249, Deep Burgundy #4E011F and Dark Wine #350014, and the yellow (electric lime) with Golden Orange #E28C19. Magenta-red draws your lines (a hair lighter, #C3064F, for 3:1 on the glass), rings, pill and the room's light; Deep Burgundy fills your turn pill; Dark Wine is the top of the room and the browser bar. The lines' cores keep 80% of their colour, so they never turn pink. The gold buttons stay their own colour (the owner's 2026-10-13 rule). |
| 2026-10-15 | Tabletop and Cozy Paper at night become warm browns, matte and tactile; Dark Neon and White Neon become glass and emitted light; violet only in Dark Neon's captured tiles | The owner's brief: dark Tabletop and Paper "render violet. Tables and paper aren't violet; these themes should be warm browns". The violet was the 2026-10-13 night palette itself (Deep Plum pages, plum cards, a mauve sheet, set in each theme's night block), not a leak, a CSS order problem or a cached build (the game has no service worker). Each of the four modes now sets every colour token itself. Exact colours and materials are the owner's; Neon's page backgrounds, player 2's colours and the cards are chosen here and listed above. Tabletop and Paper by day are untouched (pixel-identical to the previous build). |
| 2026-10-15 | Neon's glow from layered strokes; no backdrop-filter and no blur filter on the board | The owner's rules ("no per-element blur... no animated blur", 60 fps on the largest board); the old glow blurred whole groups again on every frame of a growing line. |
| 2026-10-15 | Player 2 colours: copper, denim blue, electric lime, deep teal | The brief names one line colour per theme; the second is picked for contrast on the board (4.0 to 16:1) and to stay apart from player 1, the dots and the tiles for every colour vision type. White Neon first tried raspberry: its glow mixed with the blue into violet at every junction. |
| 2026-10-14 | Paper's lines by day are pencil strokes with a wobble and a faint second stroke (the spec), not printed lines | The owner chose "Pencil wobble" over keeping the printed lines of their 12 Oct plan. Straight above 6x6, as the spec says. The mockup's wobble would be under half a pixel on a phone, so it is drawn about twice as strong, and the second stroke starts beside the line so it shows. |
| 2026-10-14 | Last-move marks (the spec's pip, ring and ellipse): Neon's ring and Paper's ellipse in the board's dot or ink colour | The mockups' coral ring comes from palettes the owner has since replaced; gold is reserved for buttons, and the dot or ink colour reads on every board without belonging to either player. Tabletop's pip followed at first, but read as one more dot (2026-10-20 below). |
| 2026-10-14 | Tabletop shows a person and a bot in the boxes against the AI; pass-and-play and online keep initials | The spec's Tabletop ownership mark, with its own rule that the bot becomes an initial when no AI plays. |
| 2026-10-14 | Neon's landing rings get a light core, like their lines | The owner's choice: the rings sat at 3.15:1 on the old night glass. Since the 2026-10-15 restyle both Neon modes draw cores in their lines, so the rings' cores show in both, mixed like the lines' (`--core-mix`), which keeps Dark Neon's magenta-red from turning pink. |
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
