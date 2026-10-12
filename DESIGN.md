---
# gstack: design-md-format=spec
# The UI design is locked to docs/design/ui-themes-spec.md and docs/design/mockups/.
# These tokens copy the spec's tables; where anything here differs from the spec, the spec wins.
name: Grid Rivals
description: A two-player game of lines and boxes with three themes players can switch between; Minimalist Premium, a board game on a table, is the default.
colors:
  # 1. Minimalist Premium (tabletop), light (table) and dark (night table)
  table-light-table: "#E4D2B2"
  table-light-sheet: "#FCFCFA"
  table-light-lane: "#E6E6EA"
  table-light-line: "#3A3A3D"
  table-light-line-last: "#161618"
  table-light-dot: "#646468"
  table-light-p1: "#2F86C6"
  table-light-p1-deep: "#1F5F8C"
  table-light-p2: "#B92E3B"
  table-light-p2-deep: "#8C1F2A"
  table-light-accent: "#0B7A87"
  table-light-accent-lip: "#075A63"
  table-light-on-accent: "#FFFFFF"
  table-light-ink: "#2B241D"
  table-light-ink-2: "#5A4C3D"
  table-light-pill: "#FFFFFF"
  table-light-control: "#F1EFEA"
  table-light-select-tint: "#E2F2F3"
  table-dark-table: "#241C15"
  table-dark-sheet: "#1C1D20"
  table-dark-lane: "#2A2B30"
  table-dark-line: "#DADADF"
  table-dark-line-last: "#FFFFFF"
  table-dark-dot: "#A9A9B0"
  table-dark-p1: "#2F86C6"
  table-dark-p1-deep: "#8CC4EE"
  table-dark-p2: "#D0414E"
  table-dark-p2-deep: "#F29AA3"
  table-dark-accent: "#0E8E9C"
  table-dark-accent-lip: "#0A6670"
  table-dark-on-accent: "#FFFFFF"
  table-dark-ink: "#F2EBE3"
  table-dark-ink-2: "#B9AA98"
  table-dark-pill: "#2A2420"
  table-dark-control: "#2E2823"
  table-dark-select-tint: "#10363A"
  # 2. Neon (coral), dark and light
  neon-dark-text: "#F6F6F6"
  neon-dark-muted: "#A69EA8"
  neon-dark-accent: "#FB5553"
  neon-dark-p1: "#FB5553"
  neon-dark-p2: "#E1DEE3"
  neon-dark-p2-soft: "#736C7E"
  neon-dark-panel: "#2A2630"
  neon-dark-panel-b: "#463F4F"
  neon-dark-panel-strong: "#352F3D"
  neon-dark-dot: "#F6F6F6"
  neon-dark-board: "#1C1A22"
  neon-dark-gold: "#FFD166"
  neon-dark-focus: "#FB5553"
  neon-light-text: "#2B2731"
  neon-light-muted: "#736C7E"
  neon-light-accent: "#FB5553"
  neon-light-accent-small: "#D63F3D"
  neon-light-p1: "#FB5553"
  neon-light-p2: "#736C7E"
  neon-light-p2-soft: "#736C7E"
  neon-light-panel: "#FFFFFF"
  neon-light-panel-b: "#E1DEE3"
  neon-light-panel-strong: "#F6F6F6"
  neon-light-dot: "#2B2731"
  neon-light-board: "#FFFFFF"
  neon-light-gold: "#B7791F"
  neon-light-focus: "#D63F3D"
  # 3. Cozy Paper and Notebook, light (paper) and dark (chalkboard)
  paper-light-desk: "#E7DFCF"
  paper-light-page: "#FBF7EE"
  paper-light-graphite: "#2E2B27"
  paper-light-graphite-2: "#5E574E"
  paper-light-rule: "#D6E0EA"
  paper-light-margin: "#E9B9B0"
  paper-light-p1: "#D0601E"
  paper-light-p1-wash: "#F6DCCB"
  paper-light-p2: "#1F4FA8"
  paper-light-p2-wash: "#D8E2F3"
  paper-light-highlight: "#FFE58A"
  paper-light-stamp: "#2F6B4F"
  paper-light-button: "#2E2B27"
  paper-dark-desk: "#161B18"
  paper-dark-page: "#1F2522"
  paper-dark-graphite: "#ECEDE6"
  paper-dark-graphite-2: "#A9B0A9"
  paper-dark-rule: "#2F3833"
  paper-dark-margin: "#5A3A35"
  paper-dark-p1: "#F59A5B"
  paper-dark-p1-wash: "#3D2A1E"
  paper-dark-p2: "#8DB8F2"
  paper-dark-p2-wash: "#1E2A3D"
  paper-dark-highlight: "#6B5A1E"
  paper-dark-stamp: "#7FC4A0"
  paper-dark-button: "#ECEDE6"
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

**The design is locked:** the owner's UI themes spec (`docs/design/ui-themes-spec.md`, kept outside version control) is the authority, and `docs/design/mockups/` holds the boards with the exact values. This file collects the tokens and the decisions in one place for the repository. Where it differs from the spec, the spec wins.

## Overview

**Product:** Grid Rivals: Dots & Boxes, a free web game (Svelte 5, GitHub Pages, Firebase). Two players: you against an AI (Rookie, Tactician, Maestro), two people on one device, or a friend online by invite link. Boards 3x3 to 6x6 (ranked) and custom up to 12x12; XP, levels and leaderboards.

**Players:** students from 10 up and adults, mostly on mid-range Android phones; laptops second.

**Three themes, chosen by the player** (owner's decision, 2026-10-12):

| Theme | Modes | Character | Fonts |
|---|---|---|---|
| 1. Minimalist Premium (the default) | light table, night table | A board game on a light-oak table: one white sheet, grey lanes for every possible line, charcoal lines with a soft offset shadow, solid box fills with a person or bot icon, white cards and pills with soft shadows, teal for progress and actions | Jost |
| 2. Neon (coral) | dark, light | Today's layout in coral and slate purple: coral means you or an action, slate purple the opponent; flat panels; one glow on the line group | Unbounded, Manrope |
| 3. Cozy Paper and Notebook | paper, chalkboard | A notebook on a desk: coloured-pencil lines, hatched boxes, a tally-mark score sheet, a highlighter for the extra turn | Kalam (names, scores, headings), Atkinson Hyperlegible (everything else) |

A theme changes tokens and a few component variants, never `rules.ts` or the board's input logic.

## Theme picker

Not in the mockups (the spec lists it as an enhancement); added at the owner's request on 2026-10-12.

- `data-skin` on the root element (`table`, `neon`, `paper`) beside today's `data-theme` (`light`, `dark`); every token set is `[data-skin="…"]` plus `[data-skin="…"][data-theme="dark"]`.
- Saved in `dnb:settings` as an extra field, `skin`, so old saved settings still load; new players start on Minimalist Premium.
- A theme button in the top bar (44 px, beside the level chip, so the bar keeps its height) opens a small theme sheet: the three themes with a preview swatch each, and light or dark. Settings has the same choice.
- An inline script in `index.html` sets `data-skin` and `data-theme` from `dnb:settings` before the first paint, so a reload never flashes the wrong theme.

## Colors

The front matter holds every token from the spec's tables (names prefixed by theme and mode). Rules from the spec: text at least 4.5:1, large text and icons at least 3:1, each player colour at least 3:1 against its board, never colour alone (every box has an icon, initial or hatching, and the turn indicator names the player). The spec lists the computed ratios per theme; notable limits it handles:
- Minimalist night: white on the teal accent is 3.9:1, so night buttons use large bold text.
- Neon: coral #FB5553 is 3.2:1 on white, so it carries lines, large numbers and labels of 19 px and up only; small rings and the focus ring use #D63F3D.

## Typography

As specified per theme, self-hosted (woff2, Latin and Latin Extended subsets, `font-display: swap`), replacing the Google Fonts link. Each theme loads at most 2 families: the browser fetches only the active theme's files.

**Open question for the owner:** Jost, Manrope, Kalam and Atkinson Hyperlegible lack Ɛ ɛ Ɔ ɔ and the Ewe letters (Ɖ ɖ Ɣ ɣ Ʋ ʋ), so a Twi or Ewe name would show those letters in the phone's own font. Unbounded has them all. Until the owner decides (a tiny fallback file, the phone's font, or another face), the spec's fonts ship as written.

## Layout

The same single column in every theme: top bar (brand, level chip), two player cards, the turn pill, chips, the board, then Quit and Restart. Cozy Paper spreads into two pages on desktop. Breakpoints from the spec: phones under 640 px never scroll and the board is the viewport width minus 32 px; tablets use the phone layout up to 600 px wide; desktops one column at most 680 px. `available()` in `src/lib/boardFit.ts` must match each theme's chrome, or measure the board container.

## Components

The spec's component tables (per theme, with states) are the reference: player cards with avatars, the sliding turn pill with the extra-turn cue, chips, the board skin, Quit and Restart, a themed confirm dialog in place of `confirm()`, Setup, the avatar builder and the results dialog.

## Accessibility

From the spec's shared section: the contrast rules above; a visible 2-3 px focus ring in the theme's focus colour; the board stays a keyboard widget (`role="application"`, arrows and Enter); touch targets at least 44 px and a dot gap of at least 40 px; the Animations setting and `prefers-reduced-motion` remove motion; dialogs with `role="dialog"`, `aria-modal`, a labelled title, a focus trap and Play again focused; the live-region announcement keeps every move and adds "extra turn". Avatars are decoration; the name carries identity.

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-10-12 | The owner's UI themes spec and its mockups are the locked design | The spec replaces the overhaul brief's candidate-directions step; PR 00 records it here and the following PRs build it. The spec stays outside version control because it includes tool-specific handoff notes; the mockups and these tokens are committed. |
| 2026-10-12 | Build all three themes and let players switch between them; Minimalist Premium is the default | Owner's decision. The spec recommends Minimalist Premium as the main look; its theme picker enhancement is now in scope. |
| 2026-10-12 | Theme picker: a top-bar theme button opening a theme sheet, plus a Theme setting | Not covered by the mockups; designed to keep the top bar's height and each theme's own controls. |
| 2026-10-12 | Fonts ship as specified; the missing Ghanaian letters are an open question | Locked spec: changes it doesn't cover wait for the owner. |
| 2026-10-11 | Earlier consultation candidates (six material directions, then three glass finishes) set aside | Superseded by the owner's spec. |
