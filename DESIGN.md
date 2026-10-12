---
# gstack: design-md-format=spec
# The UI design is locked to docs/design/ui-themes-spec.md and docs/design/mockups/.
# These tokens copy the spec's tables (palettes updated by the owner on 2026-10-12); where they differ, the spec wins.
name: Grid Rivals
description: A two-player game of lines and boxes with three themes players can switch between; Minimalist Premium, a board game on a table, is the default.
colors:
  # 1. Tabletop: maple table (light) and walnut table (dark). Palettes: burnt orange, pale mint, pastel and golden yellow by day;
  #    coral red, sage, pale butter and turquoise at night. Deeper or lighter shades only where text or thin marks need them.
  table-light-table: "#E3B970"
  table-light-felt: "#C4DFC9"
  table-light-frame: "#B0602A"
  table-light-line: "#23392D"
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
  table-dark-table: "#2A1F18"
  table-dark-felt: "#2F3F39"
  table-dark-frame: "#3B2A1E"
  table-dark-line: "#AEC8BF"
  table-dark-dot: "#E8CF83"
  table-dark-p1: "#E9494B"
  table-dark-p1-deep: "#F06567"
  table-dark-p2: "#63C1C8"
  table-dark-p2-deep: "#7FD1D7"
  table-dark-box-rim-1: "#FF9A9B"
  table-dark-box-rim-2: "#A5E4E8"
  table-dark-accent: "#F4DD97"
  table-dark-accent-lip: "#8C7536"
  table-dark-on-accent: "#2A1F18"
  table-dark-ink: "#F4EBDD"
  table-dark-ink-2: "#C9BBA6"
  table-dark-pill: "#3A2C23"
  table-dark-control: "#46362B"
  table-dark-select-tint: "#4A4126"
  table-dark-sel-ring: "#F4DD97"
  table-dark-focus: "#63C1C8"
  table-dark-gold: "#F4DD97"
  # 2. Neon, dark and light. Palette: orange, teal, indigo, cyan and coral in both modes.
  neon-dark-page: "#070A18"
  neon-dark-board: "#0B0F24"
  neon-dark-text: "#EEF1FF"
  neon-dark-muted: "#A7AECB"
  neon-dark-p1: "#FC4422"
  neon-dark-p2: "#21BDCA"
  neon-dark-accent: "#00B58C"
  neon-dark-on-accent: "#04110D"
  neon-dark-sel-ring: "#7D8BFF"
  neon-dark-panel: "#10142C"
  neon-dark-panel-strong: "#161B3A"
  neon-dark-focus: "#21BDCA"
  neon-dark-gold: "#FF8C32"
  neon-light-page: "#EEF1FA"
  neon-light-board: "#FFFFFF"
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
  # 3. Cozy Paper: cream paper (light) and charcoal paper (dark). The same five colours as Neon.
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
  paper-dark-desk: "#1A1816"
  paper-dark-page: "#27241F"
  paper-dark-graphite: "#EFE8DA"
  paper-dark-graphite-2: "#B3A994"
  paper-dark-p1: "#FC4422"
  paper-dark-p1-wash: "#3E1D17"
  paper-dark-p2: "#21BDCA"
  paper-dark-p2-wash: "#133538"
  paper-dark-accent: "#00B58C"
  paper-dark-on-accent: "#12100E"
  paper-dark-select-tint: "#11362C"
  paper-dark-sel-ring: "#00B58C"
  paper-dark-ring: "#21BDCA"
  paper-dark-gold: "#FF8C32"
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
| 1. Tabletop (Minimalist Premium; the default) | maple table, walnut table | A board game on a table: a felt mat (pale mint, or sage at night) in a wood-grain rim casting a shadow; lines and dots engraved in the felt, a printed guide under every line, solid box fills with a rim; cream cards with soft shadows; burnt orange (coral red at night) for you and the main action | Jost |
| 2. Neon | dark, light | A room lit by its colours: coloured light pooling from the corners, dark (or bright) glass panels, a board with a lit edge, lines that glow like tubes with bright cores, dots like indicator lights; coral for you, cyan (indigo by day) for the opponent, teal (indigo by day) for the main action | Unbounded, Manrope |
| 3. Cozy Paper | cream paper, charcoal paper | A sheet of real-looking paper on a kraft desk: formation, fibres and tooth; lines and dots printed and pressed into it; hatched boxes; paper-tab buttons; coral for you, indigo (cyan at night) for the opponent | Kalam (names, scores, headings), Atkinson Hyperlegible (everything else) |

A theme changes tokens, its materials (backgrounds, the board surface, SVG effects for lines, dots and boxes) and a few component variants, never `rules.ts` or the board's input logic.

## Theme picker

Not in the mockups (the spec lists it as an enhancement); added at the owner's request on 2026-10-12.

- `data-skin` on the root element (`table`, `neon`, `paper`) beside today's `data-theme` (`light`, `dark`); every token set is `[data-skin="…"]` plus `[data-skin="…"][data-theme="dark"]`.
- Saved in `dnb:settings` as an extra field, `skin`, so old saved settings still load; new players start on Minimalist Premium.
- A theme button in the top bar (44 px, beside the level chip, so the bar keeps its height) opens a small theme sheet: the three themes with a preview swatch each, and light or dark. Settings has the same choice.
- An inline script in `index.html` sets `data-skin` and `data-theme` from `dnb:settings` before the first paint, so a reload never flashes the wrong theme.

## Colors

The front matter holds every token (names prefixed by theme and mode). The palettes are the owner's (2026-10-12): Paper and Neon use orange #FF8C32, teal #00B58C, indigo #4657CE, cyan #21BDCA and coral #FC4422 in both modes; Tabletop uses burnt orange #D77027, pale mint #C4DFC9, pastel yellow #F7CD70 and golden yellow #F4AF3D by day, and coral red #E9494B, sage #AEC8BF, pale butter #F4DD97 and turquoise #63C1C8 at night. Deeper or lighter shades of them appear only where text or a thin mark needs the contrast.

Rules: text at least 4.5:1, large text and icons at least 3:1, each player's lines (and box edges) at least 3:1 against the board, never colour alone (boxes carry stripes or dots and an initial, the turn pill names the player). Limits handled:
- Tabletop by day: burnt orange carries white labels only at 19 px bold (3.4:1); the pale felt makes box fills too light against it, so each player's boxes get a rim (4.2:1 and 3.6:1).
- Neon by day: coral reaches 3.5:1 on white, so it draws lines and large numbers, never small text.
- Paper at night: player 1 is coral, not orange, because orange and cyan have the same lightness and would look identical to players who see no colour.

## Materials

- **Tabletop:** a wood tile with plank seams, light from above and darker edges; the board is felt (a soft-light grain tile) inside a 10 px rim drawn with inset shadows plus a wood-grain ring, so the board's size (and `boardFit.ts`) is unchanged; lines and dots get an engrave effect (a light edge below, a dark one above).
- **Neon:** layered radial gradients for ambient light; the board has a lit inner edge and coloured outer glow; lines, dots and boxes get a two-blur glow in their own colours (a softer single glow by day), and at night each line has a bright core. Glow follows a hierarchy: the main action most, then the selected option and the turn pill, then hover.
- **Paper:** a paper tile (cloudy formation, short fibres in every direction, tooth) that multiplies onto the cream sheet and the kraft desk by day and blends in soft-light at night; lines and dots get an emboss effect (pressed into the paper) and dots are printed beads.
- The effects live once in the board's SVG `<defs>` (`fx-engrave`, `fx-emboss`, `fx-glow`, `fx-glow-soft`, `dot-bead`), sized from the dot spacing, and each theme picks them through tokens (`--ln-filter`, `--dot-filter`, `--bx-filter`, `--cores`). Moves still paint by the next frame on 12x12 boards and on slowed phones.

## Typography

As specified per theme, self-hosted (woff2, Latin and Latin Extended subsets, `font-display: swap`), replacing the Google Fonts link. Each theme loads at most 2 families: the browser fetches only the active theme's files.

**Ghanaian letters:** Jost, Manrope, Kalam and Atkinson Hyperlegible lack Ɛ ɛ Ɔ ɔ Ɖ ɖ Ƒ Ɣ ɣ Ʋ ʋ Ʒ ʒ (Kalam and Atkinson also Ŋ ŋ) and the cedi sign. Tiny subsets of Montserrat (for Jost), Inter (for Manrope) and Noto Sans (for Kalam and Atkinson) join each family for just those characters and load only when such a name is on screen. Unbounded has them all.

## Layout

The same single column in every theme: top bar (brand, level chip), two player cards, the turn pill, chips, the board, then Quit and Restart. Cozy Paper spreads into two pages on desktop. Breakpoints from the spec: phones under 640 px never scroll and the board is the viewport width minus 32 px; tablets use the phone layout up to 600 px wide; desktops one column at most 680 px. `available()` in `src/lib/boardFit.ts` must match each theme's chrome, or measure the board container.

## Components

The spec's component tables (per theme, with states) are the reference: player cards with avatars, the sliding turn pill with the extra-turn cue, chips, the board skin, Quit and Restart, a themed confirm dialog in place of `confirm()`, Setup, the avatar builder and the results dialog.

## Accessibility

From the spec's shared section: the contrast rules above; a visible 2-3 px focus ring in the theme's focus colour; the board stays a keyboard widget (`role="application"`, arrows and Enter), and its keyboard cursor is a translucent band inside a 3 px ring in the focus colour (brass in Tabletop at night, where turquoise is only 2.5:1 on the lit felt), at least 3:1 on every board; touch targets at least 44 px and a dot gap of at least 40 px; the Animations setting and `prefers-reduced-motion` remove motion; dialogs with `role="dialog"`, `aria-modal`, a labelled title, a focus trap and Play again focused; the live-region announcement keeps every move and adds "extra turn". Avatars are decoration; the name carries identity.

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-10-12 | New palettes and real materials in all three themes | Owner's redesign plan: the themes looked flat and didn't use their colours. Layouts stay; tokens, backgrounds, the board surface and SVG effects change. |
| 2026-10-12 | The keyboard cursor gets a 3 px focus ring round the line (brass in Tabletop at night) | QA measured the old 35% accent band at 1.4-1.9:1 against the new boards; the spec's shared rule asks for a focus ring, and the felt under the light is too pale for turquoise. Measured 4-7.4:1 from pixels. |
| 2026-10-12 | Tabletop lines stay one colour for both players, engraved; boxes get a rim | On a game board the lines are part of the board; ownership shows in the boxes, whose fills are too light against the pale felt without a rim. |
| 2026-10-12 | Paper at night: coral for player 1 | Orange and cyan have the same lightness, so players who see no colour couldn't tell the lines apart; coral against cyan differs in hue and lightness. |
| 2026-10-12 | Neon glow follows a hierarchy | Main action, then the selected option and the turn pill, then hover only, so the screen stays readable. |
| 2026-10-12 | Ghanaian letters: per-theme fallback subsets | The owner chose the recommended option over the phone's font or another face. |
| 2026-10-12 | The theme is its own saved setting (`skin`) beside light and dark; Tabletop is the default; fonts are self-hosted, split by unicode-range | Old saved settings keep working; the first paint uses the right theme; no third-party font request. |
| 2026-10-12 | Paper ticks the chosen option; level up is a chip in Tabletop and Neon; primary buttons darken towards their lip on hover | Found in the design review of the first theme PR: a non-colour cue where Paper has no ring, readable level-up text, and hover that keeps label contrast. |
| 2026-10-12 | The owner's UI themes spec and its mockups are the locked design | The spec replaces the overhaul brief's candidate-directions step; PR 00 records it here and the following PRs build it. The spec stays outside version control because it includes tool-specific handoff notes; the mockups and these tokens are committed. |
| 2026-10-12 | Build all three themes and let players switch between them; Minimalist Premium is the default | Owner's decision. The spec recommends Minimalist Premium as the main look; its theme picker enhancement is now in scope. |
| 2026-10-12 | Theme picker: a top-bar theme button opening a theme sheet, plus a Theme setting | Not covered by the mockups; designed to keep the top bar's height and each theme's own controls. |
| 2026-10-12 | Fonts ship as specified; the missing Ghanaian letters are an open question | Locked spec: changes it doesn't cover wait for the owner. |
| 2026-10-11 | Earlier consultation candidates (six material directions, then three glass finishes) set aside | Superseded by the owner's spec. |
