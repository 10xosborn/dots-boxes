---
# gstack: design-md-format=spec
# The UI design is locked to docs/design/ui-themes-spec.md and docs/design/mockups/.
# These tokens copy the spec's tables (palettes updated by the owner on 2026-10-12, the dark modes on 2026-10-13); where they differ, the spec wins.
name: Grid Rivals
description: A two-player game of lines and boxes with three themes players can switch between; Minimalist Premium, a board game on a table, is the default.
colors:
  # 1. Tabletop: maple table (light) and plum-stained table (dark). By day: burnt orange, pale mint, pastel and golden yellow.
  #    At night the owner's dark colours (2026-10-13): Deep Plum #200B32, Brick Red #BE3926, Deep Teal #0C4E41, Deep Indigo #2D2F79,
  #    with lighter tints where a line, ring or text needs them, and gold buttons. Each player has their own line colour.
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
  table-dark-table: "#200B32"
  table-dark-felt: "#0C4E41"
  table-dark-frame: "#4A2342"
  table-dark-frame-dark: "#1C0A1C"
  table-dark-line-1: "#F59A86"
  table-dark-line-2: "#B3B8F7"
  table-dark-dot: "#E9E1F0"
  table-dark-p1: "#E2553F"
  table-dark-p1-deep: "#F07A64"
  table-dark-p2: "#9DA3F2"
  table-dark-p2-deep: "#B3B8F7"
  table-dark-box-1: "#BE3926"
  table-dark-box-2: "#4B4FC2"
  table-dark-box-rim-1: "#F59A86"
  table-dark-box-rim-2: "#B3B8F7"
  table-dark-accent: "#F2B84B"
  table-dark-accent-lip: "#A87418"
  table-dark-on-accent: "#241005"
  table-dark-ink: "#F3EDF7"
  table-dark-ink-2: "#C5B9D3"
  table-dark-pill: "#2E1A40"
  table-dark-control: "#3A2250"
  table-dark-select-tint: "#4A2E5E"
  table-dark-sel-ring: "#F2B84B"
  table-dark-focus: "#F2B84B"
  table-dark-gold: "#FFC9A0"
  # 2. Neon, dark and light: a room lit by a drifting aurora, with a frosted glass board and glass cards.
  #    By day orange, teal, indigo, cyan and coral; at night the owner's dark colours, lit (lightened) for the tubes, and gold buttons.
  neon-dark-page: "#200B32"
  neon-dark-aurora: "linear-gradient(160deg, #200B32, #2A1650 45%, #2D2F79), lights #BE3926, #17A386, #5A5EE0 at 46%"
  neon-dark-board: "rgba(45,47,121,.42)"
  neon-dark-text: "#F3EDF7"
  neon-dark-muted: "#C6BEE2"
  neon-dark-p1: "#FF5B3F"
  neon-dark-p2: "#3FE0C0"
  neon-dark-line-1: "#FF6A4D"
  neon-dark-line-2: "#3FE0C0"
  neon-dark-box-1: "#BE3926"
  neon-dark-box-2: "#0E9C80"
  neon-dark-dot: "#E4DEFF"
  neon-dark-accent: "#F2B84B"
  neon-dark-on-accent: "#241005"
  neon-dark-sel-ring: "#F2B84B"
  neon-dark-panel: "rgba(40,24,76,.6)"
  neon-dark-panel-strong: "rgba(62,40,110,.68)"
  neon-dark-focus: "#F2B84B"
  neon-dark-gold: "#FFC9A0"
  neon-light-page: "#EEF1FA"
  neon-light-aurora: "linear-gradient(160deg, #F4F1FF, #EEF1FA 50%, #DDF3F8), lights #FC4422, #21BDCA, #4657CE at 17%"
  neon-light-board: "rgba(255,255,255,.62)"
  neon-light-text: "#141832"
  neon-light-muted: "#4F5577"
  neon-light-p1: "#FC4422"
  neon-light-p2: "#4657CE"
  neon-light-accent: "#4657CE"
  neon-light-on-accent: "#FFFFFF"
  neon-light-sel-ring: "#4657CE"
  neon-light-panel: "#FFFFFF"
  neon-light-focus: "#4657CE"
  neon-light-gold: "#B5560C"
  # 3. Cozy Paper: a cream sheet on a kraft desk (light), a mauve sheet on a Deep Plum desk (dark). By day the same five colours
  #    as Neon; at night brick and teal inks, lightened for the mauve sheet, and gold buttons.
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
  paper-dark-desk: "#200B32"
  paper-dark-page: "#4A2C63"
  paper-dark-graphite: "#F3EDF7"
  paper-dark-graphite-2: "#C5B9D3"
  paper-dark-p1: "#F07A64"
  paper-dark-p1-line: "#F28C76"
  paper-dark-p1-wash: "#4A1A24"
  paper-dark-p2: "#6EDCC4"
  paper-dark-p2-line: "#7FE0C8"
  paper-dark-p2-wash: "#0F3A35"
  paper-dark-accent: "#F2B84B"
  paper-dark-on-accent: "#241005"
  paper-dark-panel: "#2E1A40"
  paper-dark-sel-ring: "#F2B84B"
  paper-dark-ring: "#F2B84B"
  paper-dark-gold: "#FFC9A0"
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
| 1. Tabletop (Minimalist Premium; the default) | maple table, plum-stained table | A board game on a table with knife marks in its grain: a felt mat (pale mint, or Deep Teal at night) in a wood-grain rim casting a shadow; lines and dots engraved in the felt, a printed guide under every line, solid box fills with a rim; cream (plum at night) cards with soft shadows; burnt orange (brick red at night) for you and golden yellow (light indigo at night) for the opponent, each with their own line colour; burnt orange (gold at night) for the main action | Jost |
| 2. Neon | dark, light | A room lit by a slowly drifting aurora: a frosted glass board (Deep Indigo at night, white by day) that shows the light behind it blurred, with a sheen and a lit edge; glass cards; lines that glow like tubes with bright cores, dots like indicator lights; brick red (coral by day) for you, teal (indigo by day) for the opponent, gold (indigo by day) for the main action | Unbounded, Manrope |
| 3. Cozy Paper | cream paper, mauve paper | A sheet of real-looking paper on a kraft (Deep Plum at night) desk: cloudy formation, fibres and tooth you can see; lines and dots printed and pressed into it; hatched boxes; paper-tab buttons; coral (brick at night) for you, indigo (teal at night) for the opponent, indigo (gold at night) for the main action | Kalam (names, scores, headings), Atkinson Hyperlegible (everything else) |

A theme changes tokens, its materials (backgrounds, the board surface, SVG effects for lines, dots and boxes) and a few component variants, never `rules.ts` or the board's input logic.

## Theme picker

Not in the mockups (the spec lists it as an enhancement); added at the owner's request on 2026-10-12.

- `data-skin` on the root element (`table`, `neon`, `paper`) beside today's `data-theme` (`light`, `dark`); every token set is `[data-skin="…"]` plus `[data-skin="…"][data-theme="dark"]`.
- Saved in `dnb:settings` as an extra field, `skin`, so old saved settings still load; new players start on Minimalist Premium.
- A theme button in the top bar (44 px, beside the level chip, so the bar keeps its height) opens a small theme sheet: the three themes with a preview swatch each, and light or dark. Settings has the same choice.
- An inline script in `index.html` sets `data-skin` and `data-theme` from `dnb:settings` before the first paint, so a reload never flashes the wrong theme.

## Colors

The front matter holds every token (names prefixed by theme and mode). The palettes are the owner's. By day (2026-10-12): Paper and Neon use orange #FF8C32, teal #00B58C, indigo #4657CE, cyan #21BDCA and coral #FC4422; Tabletop uses burnt orange #D77027, pale mint #C4DFC9, pastel yellow #F7CD70 and golden yellow #F4AF3D. At night, in all three themes (2026-10-13): Deep Plum #200B32, Brick Red #BE3926, Deep Teal #0C4E41 and Deep Indigo #2D2F79. Tabletop's felt is the Deep Teal, Neon's glass board the Deep Indigo and Paper's sheet a mauve (#4A2C63, a lighter plum, so it never matches Neon's board); the page behind each is the Deep Plum. Deeper or lighter shades appear only where text, a line, a ring or a glow needs the contrast.

**Buttons have their own colour**, used by no player, board or surface (owner, 2026-10-13): gold #F2B84B with dark labels at night in every theme; by day the existing action colours (burnt orange in Tabletop, indigo in Neon and Paper). Every button has depth: a sheen over its fill (lighter at the top, the plain fill across the middle where the label sits, a darker foot), a bright top edge and a shadow below; switches are a recessed track with a raised knob. Hover deepens the main action by day (its white label gains contrast) and brightens it at night (its dark label gains contrast).

**Each player has their own line colour in every theme** (owner, 2026-10-13), Tabletop included: burnt orange #BF4E1E and dark golden #7C5E08 engraved in the pale felt by day, light brick #F59A86 and light indigo #B3B8F7 on the Deep Teal felt at night.

Rules: text at least 4.5:1, large text and icons at least 3:1, each player's lines (and box edges) at least 3:1 against the board, never colour alone (boxes carry stripes or dots and an initial, the turn pill names the player). Limits handled:
- Tabletop by day: burnt orange carries white labels only at 19 px bold (3.4:1); the pale felt makes box fills too light against it, so each player's boxes get a rim (4.2:1 and 3.6:1). The two line colours differ in hue and lightness so they can be told apart at a glance.
- Tabletop at night: the lamp's light on the felt is soft (6% white, 22% by day), because a brighter pool washed the light lines down to about 2.2:1.
- Neon by day: coral reaches 3.5:1 on white, so it draws lines and large numbers, never small text.
- Small text straight on a textured page (not on a card) uses full ink on Tabletop's wood and Paper's desk by day: muted text fell below 4.5:1 over the sharper grain, knife marks and fibres.
- Paper and Tabletop at night: the two players' inks differ in lightness as well as hue, for players who see no colour.

## Materials

The tiles are drawn at twice their CSS size (paper at 1.5x), so they stay sharp on phones, and wrap seamlessly (`src/assets/textures/`, about 210 KB in all; a page loads only its theme's tiles).
- **Tabletop:** planks of maple (plum-stained at night) with waved grain, latewood lines, pores, knife marks (a light cut face with a dark edge, most on a slant, some cross-hatched in clusters) and a few deeper gouges, a seam every 256 px, light from above and darker edges; the board is felt (crisp short fibres in a soft-light tile) under a lamp, inside a 10 px rim drawn with inset shadows plus a wood-grain ring, so the board's size (and `boardFit.ts`) is unchanged; lines and dots get an engrave effect (a light edge below, a dark one above).
- **Neon:** an aurora (a gradient room with three soft lights drifting over 34-46 s, still when Animations is off) behind a frosted glass board: the room shows through it blurred and more saturated (`backdrop-filter`), a sheen crosses it, its top edge catches the light, and a soft glow spills round it; at night the cards are frosted glass too. Lines, dots and boxes get a two-blur glow in their own colours (a softer single glow by day), and at night each line has a bright core. Glow follows a hierarchy: the main action most, then the selected option and the turn pill, then hover.
- **Paper:** a paper tile with cloudy formation, short curved fibres in every direction and tooth, strong enough to see at arm's length, that multiplies onto the cream sheet and the kraft desk by day and blends in soft-light on the mauve sheet and the plum desk at night; lines and dots get an emboss effect (pressed into the paper) and dots are printed beads.
- The effects live once in the board's SVG `<defs>` (`fx-engrave`, `fx-emboss`, `fx-glow`, `fx-glow-soft`, `dot-bead`), sized from the dot spacing, and each theme picks them through tokens (`--ln-filter`, `--dot-filter`, `--bx-filter`, `--cores`). Moves still paint by the next frame on 12x12 boards and on slowed phones.

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
| 2026-10-13 | The owner's four dark colours in every theme's dark mode: Tabletop's felt Deep Teal, Neon's glass board Deep Indigo, Paper's sheet a mauve, each page Deep Plum; lighter tints where lines, rings, glow or text need them | The owner's palette for the dark modes. They chose the felt and board colours, a Paper sheet that differs from Neon's board (mauve, picked from screenshots of the options) and lighter tints where needed. Tabletop's lamp on the felt is softer at night, so the light lines keep 3:1. |
| 2026-10-13 | Buttons have their own colour (gold at night in every theme), and every button has depth in all six modes | The owner: "the color of the button should also be different from the board or the players or any other thing, every button or element should have a depth feel… the buttons should have a modern look". They picked gold over pearl and orchid from screenshots, and asked for the depth style by day too. |
| 2026-10-13 | Each player has their own line colour in every theme, Tabletop included | The owner asked for it, so Tabletop's single engraved ink is gone. By day its two engraved colours are a brighter burnt orange and a dark golden, far enough apart in hue and lightness to tell at a glance (the first deep orange and deep golden were too close). |
| 2026-10-13 | Sharper materials: knife-marked wood, crisp felt, paper you can see | The owner: the paper texture was "not that sharp or clear", and the tabletop's should be "sharp and clear… even add knife marks". The tiles are drawn at twice their size. Small muted text straight on the wood or the paper desk by day now uses full ink to keep 4.5:1 over them. |
| 2026-10-13 | Neon: the aurora is back in both modes, with a frosted glass board and glass cards | The owner missed "the gradient background we were using… the background looks somewhat plain" and couldn't see a glass look; the board now shows the aurora behind it blurred, with a sheen and a lit edge. |
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
