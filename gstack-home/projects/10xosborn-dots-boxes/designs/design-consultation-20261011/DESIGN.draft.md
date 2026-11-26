---
# gstack: design-md-format=spec
# PROVISIONAL (2026-10-11): six candidate directions stay open until /design-shotgun (Step 2).
# After the owner picks one, its tokens lose their prefix and the other five sets are removed.
name: Grid Rivals
description: A two-player game of lines and boxes whose finished board is a keepsake; calm while you play, one earned moment at the end.
colors:
  # A. Loom
  loom-light-page: "#ECEBE7"
  loom-light-surface: "#F7F6F2"
  loom-light-board: "#E2DED5"
  loom-light-text: "#23201C"
  loom-light-text-muted: "#5C564E"
  loom-light-player-1: "#B23F0C"
  loom-light-player-2: "#2B4F86"
  loom-light-dot: "#4A443C"
  loom-light-accent: "#D9A21B"
  loom-light-focus: "#23201C"
  loom-light-label: "#F4F1EA"
  loom-light-primary: "#23201C"
  loom-light-on-primary: "#F7F6F2"
  loom-dark-page: "#1A1917"
  loom-dark-surface: "#24221F"
  loom-dark-board: "#25231F"
  loom-dark-text: "#EEEAE2"
  loom-dark-text-muted: "#AAA397"
  loom-dark-player-1: "#F07A45"
  loom-dark-player-2: "#7EAAE3"
  loom-dark-dot: "#CFC8BC"
  loom-dark-accent: "#E8B739"
  loom-dark-focus: "#EEEAE2"
  loom-dark-label: "#2F2C27"
  loom-dark-primary: "#EEEAE2"
  loom-dark-on-primary: "#1A1917"
  # B. Pegboard
  pegboard-light-page: "#E4EAF0"
  pegboard-light-surface: "#FFFFFF"
  pegboard-light-board: "#F6F8FA"
  pegboard-light-text: "#17202A"
  pegboard-light-text-muted: "#4B5662"
  pegboard-light-player-1: "#D9480F"
  pegboard-light-player-2: "#1C64D6"
  pegboard-light-tile-1: "#F2762E"
  pegboard-light-tile-1-edge: "#B33C0A"
  pegboard-light-on-tile-1: "#1A1208"
  pegboard-light-tile-2: "#1C64D6"
  pegboard-light-tile-2-edge: "#123F8C"
  pegboard-light-on-tile-2: "#FFFFFF"
  pegboard-light-dot: "#66727F"
  pegboard-light-accent: "#FFC627"
  pegboard-light-focus: "#17202A"
  pegboard-light-primary: "#FFC627"
  pegboard-light-on-primary: "#17202A"
  pegboard-light-primary-edge: "#C99400"
  pegboard-dark-page: "#0F1318"
  pegboard-dark-surface: "#1A2028"
  pegboard-dark-board: "#171C23"
  pegboard-dark-text: "#F2F5F8"
  pegboard-dark-text-muted: "#A9B3BE"
  pegboard-dark-player-1: "#FF8A3D"
  pegboard-dark-player-2: "#5AA5FF"
  pegboard-dark-tile-1: "#FF8A3D"
  pegboard-dark-tile-1-edge: "#B85A1C"
  pegboard-dark-on-tile-1: "#1A1208"
  pegboard-dark-tile-2: "#5AA5FF"
  pegboard-dark-tile-2-edge: "#2B6FC0"
  pegboard-dark-on-tile-2: "#0B1A2E"
  pegboard-dark-dot: "#C9D1DA"
  pegboard-dark-accent: "#FFD24D"
  pegboard-dark-focus: "#F2F5F8"
  pegboard-dark-primary: "#FFD24D"
  pegboard-dark-on-primary: "#17202A"
  pegboard-dark-primary-edge: "#B38F1F"
  # C. Glasswork
  glass-light-page: "#ECEEEC"
  glass-light-surface: "#F8F9F8"
  glass-light-board: "#DDE5E4"
  glass-light-text: "#1B1F24"
  glass-light-text-muted: "#4D555F"
  glass-light-player-1: "#A85A0A"
  glass-light-player-1-light: "#F2B264"
  glass-light-player-2: "#2A55B5"
  glass-light-player-2-light: "#8FB0F5"
  glass-light-line: "#353A40"
  glass-light-dot: "#4C535C"
  glass-light-accent: "#A3213F"
  glass-light-focus: "#1B1F24"
  glass-light-label: "#EEF2F1"
  glass-light-primary: "#2C3138"
  glass-light-on-primary: "#F8F9F8"
  glass-dark-page: "#111317"
  glass-dark-surface: "#1B1E23"
  glass-dark-board: "#1C2026"
  glass-dark-text: "#ECEEF1"
  glass-dark-text-muted: "#A3AAB4"
  glass-dark-player-1: "#F3A638"
  glass-dark-player-1-light: "#FFD58F"
  glass-dark-player-2: "#6D98F2"
  glass-dark-player-2-light: "#B7CCFA"
  glass-dark-line: "#9AA1AA"
  glass-dark-dot: "#B9C0C8"
  glass-dark-accent: "#E0577A"
  glass-dark-focus: "#ECEEF1"
  glass-dark-label: "#262B32"
  glass-dark-primary: "#D5DADF"
  glass-dark-on-primary: "#111317"
  # D. Zen Garden
  zen-light-page: "#E6E3DC"
  zen-light-surface: "#F5F3EE"
  zen-light-board: "#D7D1C4"
  zen-light-text: "#1E2321"
  zen-light-text-muted: "#4F5652"
  zen-light-player-1: "#A8481A"
  zen-light-player-2: "#2E4C7C"
  zen-light-line: "#6A6255"
  zen-light-groove-lip: "#EDE9E0"
  zen-light-dot: "#5F665F"
  zen-light-accent: "#2D7A68"
  zen-light-focus: "#1E2321"
  zen-light-label: "#EFEBE3"
  zen-light-primary: "#2D7A68"
  zen-light-on-primary: "#F5F3EE"
  zen-dark-page: "#141719"
  zen-dark-surface: "#1E2225"
  zen-dark-board: "#22272A"
  zen-dark-text: "#E7E5E0"
  zen-dark-text-muted: "#A3A8A5"
  zen-dark-player-1: "#F08D4E"
  zen-dark-player-2: "#86AADD"
  zen-dark-line: "#9AA2A6"
  zen-dark-groove-lip: "#15191B"
  zen-dark-dot: "#B8BDB9"
  zen-dark-accent: "#5DBEA6"
  zen-dark-focus: "#E7E5E0"
  zen-dark-label: "#2B3034"
  zen-dark-primary: "#5DBEA6"
  zen-dark-on-primary: "#101314"
  # E. Retro Pixel
  pixel-light-page: "#EFEEE8"
  pixel-light-surface: "#FFFFFF"
  pixel-light-board: "#FFFFFF"
  pixel-light-text: "#121212"
  pixel-light-text-muted: "#474747"
  pixel-light-player-1: "#C44D00"
  pixel-light-player-2: "#0A5FC4"
  pixel-light-dot: "#121212"
  pixel-light-accent: "#FFD400"
  pixel-light-focus: "#121212"
  pixel-light-frame: "#121212"
  pixel-light-bevel-light: "#FFFFFF"
  pixel-light-bevel-dark: "#9B9B95"
  pixel-light-primary: "#FFD400"
  pixel-light-on-primary: "#121212"
  pixel-dark-page: "#0D0E12"
  pixel-dark-surface: "#191B23"
  pixel-dark-board: "#171922"
  pixel-dark-text: "#F1F1F1"
  pixel-dark-text-muted: "#A9ACB8"
  pixel-dark-player-1: "#FF9A1F"
  pixel-dark-player-2: "#3AA9FF"
  pixel-dark-dot: "#E8E8E8"
  pixel-dark-accent: "#FFE047"
  pixel-dark-focus: "#F1F1F1"
  pixel-dark-frame: "#2B2F3D"
  pixel-dark-bevel-light: "#4A5068"
  pixel-dark-bevel-dark: "#05060A"
  pixel-dark-primary: "#FFE047"
  pixel-dark-on-primary: "#121212"
  # F. Proof (proposed by the outside voice, added by the owner)
  proof-light-page: "#F1F3F4"
  proof-light-surface: "#F1F3F4"
  proof-light-board: "#F1F3F4"
  proof-light-text: "#1E2228"
  proof-light-text-muted: "#545A60"
  proof-light-player-1: "#B84300"
  proof-light-player-2: "#1F56B8"
  proof-light-line: "#1E2228"
  proof-light-dot: "#1E2228"
  proof-light-focus: "#1E2228"
  proof-light-primary: "#1E2228"
  proof-light-on-primary: "#F1F3F4"
  proof-dark-page: "#191C21"
  proof-dark-surface: "#191C21"
  proof-dark-board: "#191C21"
  proof-dark-text: "#ECEEEF"
  proof-dark-text-muted: "#A7ADB4"
  proof-dark-player-1: "#F2711C"
  proof-dark-player-2: "#8FC1FF"
  proof-dark-line: "#ECEEEF"
  proof-dark-dot: "#ECEEEF"
  proof-dark-focus: "#ECEEEF"
  proof-dark-primary: "#ECEEEF"
  proof-dark-on-primary: "#191C21"
typography:
  loom-display:
    fontFamily: Bricolage Grotesque
    fontWeight: 800
    fontSize: clamp(2.4rem, 7vw, 3.6rem)
    letterSpacing: -0.02em
  loom-body:
    fontFamily: Andika
    fontSize: 1rem
    lineHeight: 1.5
    fontFeature: tnum
  pegboard-display:
    fontFamily: Fredoka
    fontWeight: 700
    fontSize: clamp(2.4rem, 7vw, 3.6rem)
    letterSpacing: -0.02em
  pegboard-body:
    fontFamily: M PLUS Rounded 1c
    fontSize: 1rem
    lineHeight: 1.5
  glass-display:
    fontFamily: Marcellus
    fontWeight: 400
    fontSize: clamp(2.4rem, 7vw, 3.6rem)
    letterSpacing: 0.01em
  glass-body:
    fontFamily: Fira Sans
    fontSize: 1rem
    lineHeight: 1.5
    fontFeature: tnum
  zen-display:
    fontFamily: Zen Maru Gothic
    fontWeight: 700
    fontSize: clamp(2.4rem, 7vw, 3.6rem)
    letterSpacing: -0.01em
  zen-body:
    fontFamily: Onest
    fontSize: 1rem
    lineHeight: 1.5
  pixel-display:
    fontFamily: Pixelify Sans
    fontWeight: 700
    fontSize: clamp(2.4rem, 7vw, 3.6rem)
    letterSpacing: 0em
  pixel-body:
    fontFamily: Overpass
    fontSize: 1rem
    lineHeight: 1.5
    fontFeature: tnum
  proof-display:
    fontFamily: League Gothic
    fontWeight: 400
    fontSize: clamp(3.4rem, 10vw, 5rem)
    letterSpacing: 0.005em
  proof-body:
    fontFamily: Noto Sans
    fontSize: 1rem
    lineHeight: 1.5
rounded:
  loom-sm: 4px
  loom-md: 6px
  loom-lg: 10px
  pegboard-sm: 10px
  pegboard-md: 14px
  pegboard-lg: 20px
  pegboard-board: 28px
  glass-sm: 2px
  glass-md: 3px
  glass-lg: 4px
  zen-sm: 8px
  zen-md: 12px
  zen-lg: 18px
  pixel-sm: 0px
  pixel-md: 0px
  pixel-lg: 0px
  proof-sm: 0px
  proof-md: 0px
  proof-lg: 0px
  proof-tag-round: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
---

# Grid Rivals

**Status: PROVISIONAL.** This is Step 1 of the overhaul (the owner's brief, section 2). Six candidate directions stay open until the owner chooses one in `/design-shotgun` (Step 2). Then the chosen tokens become final, the other directions are removed, PROVISIONAL is dropped, and the decision is logged below.

## Overview

**Creative North Star:** every match leaves a beautiful artifact of who claimed what. The board is a material, never interface strokes, and the finished board is worth keeping.

**Product context:** Grid Rivals: Dots & Boxes, a free web game (Svelte 5, GitHub Pages). 1-5 minute matches against three AI rivals (Rookie, Tactician, Maestro), pass-and-play, online friend games by invite link, XP and levels, fastest-win leaderboards on 3x3 to 6x6, custom boards up to 12x12. Players are mostly students and younger players (some 10-17) in Ghana and elsewhere, on mid-range Android phones on mobile data, in short daytime breaks and in the evening; laptops second.

**Mode per surface:**
- Game board: Experience. Calm focus while playing.
- Home, Setup, Settings, Stats, Leaderboard, Online lobby: Operate. Clear and quick.
- Results: Experience. The one authored moment, led by the finished board.
- How to play: Read.

**Reference sites** (research on 2026-10-11, read-only):
- Dots & Boxes: Reimagined and similar apps (https://apps.apple.com/us/app/dots-boxes-reimagined/id592828165): the category default is graph paper and pencil, or a flat grid, with icons in claimed boxes.
- Weaving Tides (https://store.steampowered.com/app/1075170/Weaving_Tides/): cloth reads instantly even small.
- Glass Masquerade (https://store.steampowered.com/app/511470/Glass_Masquerade/): jewel panes in dark lead.
- Geoboard by The Math Learning Center (https://www.mathlearningcenter.org/apps/geoboard): pegs and thick translucent bands.
- Dinosaur Polo Club, Mini Metro (https://dinopoloclub.com/): thick coloured lines with rounded joins; stations coded by shape as well as colour.

**Key characteristics (the first five seconds):**
- The board looks like something made of a real material, not a worksheet.
- Two players are told apart at a glance by colour, pattern and initials.
- Nothing glows, floats or bounces; the screen is calm until a box is closed.
- The finished board is the hero of the results.

**What we replace** (today's look reads as AI-made): the purple-indigo gradient, aurora blobs, frosted glass, the gradient button, neon glow on lines and cards, one large radius on everything, the grid-paper board, bounce easing, the centred hero, Unbounded and Manrope.

## Candidate directions (all six open until Step 2)

Each direction keeps its own font pair, palette, shapes, motion and sound, so Step 2 compares whole systems. Token values for every direction are in the front matter (prefixes `loom-`, `pegboard-`, `glass-`, `zen-`, `pixel-`, `proof-`); after the owner picks, the chosen set loses its prefix and the other five are removed.

### A. Loom (the owner's default)

**Thesis:** a hand loom at rest: dyed threads pulled taut across matte cotton. Every box you close is woven in your own weave, and the finished board is a swatch of cloth you keep.

- **Dots:** warp pins, small and dark, with a soft highlight.
- **Lines:** dyed threads in the mover's colour, with a light twist pattern along the thread (a dashed highlight), round ends.
- **Boxes:** woven patches: player 1 in a 2/2 twill (stepped diagonals), player 2 in a basket weave (pairs of threads crossing). Original structures only: no Kente patterns or Adinkra symbols.
- **Initials:** on a small stitched label in the middle of the patch (ink on undyed cotton, 4.5:1 or better).
- **Last move:** a short running stitch beside the newest thread.
- **Chain feedback:** each box in a chain weaves in from left to right, 90 ms after the one before, and the mallet climbs the scale.
- **Ground:** matte cotton with a faint plain-weave texture (an SVG pattern at about 7% opacity).
- **Type:** Bricolage Grotesque for display (its ink traps read like cut thread ends at large sizes); Andika for everything else (made by SIL for new readers and for African languages: every Ghanaian letter, tabular digits).
- **Shapes and depth:** fabric corners (4-10 px); soft fabric shadows; primary buttons carry an inset stitch line.
- **Motion:** threads pull taut in 140 ms (ease-out, no bounce); boxes weave in over 240 ms.
- **Sound:** wooden mallets (marimba-like), C major pentatonic.
- **Authored moment:** Results lifts the cloth off the loom with a fringed edge and the date on its label.

### B. Pegboard

**Thesis:** a classroom geoboard on a sunny desk: chunky moulded pegs, rubber bands that snap taut, and tiles that click into place with a solid offset shadow.

- **Dots:** moulded pegs with a highlight and a hard shadow below.
- **Lines:** thick rubber bands in the mover's colour, with a thin highlight.
- **Boxes:** plastic tiles: player 1 ribbed (diagonal ridges), player 2 dimpled (a grid of dimples); each tile has a darker edge below it (3:1 or better against the board).
- **Initials:** embossed on the tile (dark on the orange tile, white on the blue one, 4.5:1 or better).
- **Last move:** rings around the two pegs the newest band joins.
- **Chain feedback:** tiles drop in 60 ms apart with rising clacks.
- **Ground:** a moulded plastic slab with a thick lower edge.
- **Type:** Fredoka for display (round, chunky, like moulded letters); M PLUS Rounded 1c for everything else (soft and friendly; tabular digits; every Ghanaian letter).
- **Shapes and depth:** generous moulded corners (14-28 px); hard offset shadows with no blur; buttons press down 3 px.
- **Motion:** bands stretch and snap in 160 ms (ease-out, no overshoot); tiles drop in 150 ms.
- **Sound:** a rubber-band twang for lines and a wooden clack for tiles, G major pentatonic.
- **Authored moment:** the tiles pop off the board as one sticker-like mosaic card.

### C. Glasswork

**Thesis:** a leaded window at dusk: lead cames trace every line, and each box you close fills with coloured light. The finished board is a window you made together.

- **Dots:** solder joints.
- **Lines:** lead cames, the same neutral lead for both players, with a thin highlight down the middle. Who drew a line never affects the score, so lines stay neutral; ownership lives in the panes.
- **Boxes:** glass panes lit from inside (a radial gradient, never an outer glow): player 1 amber with streaks, player 2 cobalt with seed bubbles.
- **Initials:** etched into a clear disc in the pane.
- **Last move:** a ruby core inside the newest came.
- **Chain feedback:** panes fill with light 110 ms apart; chimes climb.
- **Ground:** clear cathedral glass with a faint ripple, framed in lead.
- **Type:** Marcellus for display (flared capitals in the tradition of lettering set into windows; display sizes only, one weight); Fira Sans for everything else (clear humanist face; tabular digits; every Ghanaian letter).
- **Shapes and depth:** near-square corners (2-4 px) like cut glass; depth comes from light, not shadow.
- **Motion:** cames set in 120 ms; panes fill over 340 ms.
- **Sound:** soft glass chimes with long tails, D major pentatonic.
- **Authored moment:** light sweeps across the finished window from one side.

### D. Zen Garden

**Thesis:** a raked garden in the early morning: lines are grooves pressed into grey sand, closed boxes settle into raked patterns, and the finished board is a garden you shaped together.

- **Dots:** small smooth stones with soft shadows.
- **Lines:** raked grooves: a dark core with a light lip, the same for both players (neutral, as in Glasswork).
- **Boxes:** the sand settles into the owner's pattern with a quiet bloom: player 1 concentric ripples, player 2 straight rakes, both tinted.
- **Initials:** on a flat stone in the middle of the box.
- **Last move:** a small ripple ring at the middle of the newest groove.
- **Chain feedback:** boxes bloom 150 ms apart; piano notes climb.
- **Ground:** grey sand (not cream) with a generated grain tile and faint raking; paper-like cards with soft shadows. Materials, not religious symbols.
- **Type:** Zen Maru Gothic for display (rounded strokes like water-worn stone); Onest for everything else (calm and even; tabular digits; every Ghanaian letter).
- **Shapes and depth:** smooth-stone corners (8-18 px); soft paper shadows.
- **Motion:** grooves drawn in 260 ms; boxes bloom over 520 ms; everything eases in and out.
- **Sound:** soft piano at very low volume, A major pentatonic; music is a slow ambient bed.
- **Authored moment:** the garden seen from above, with the winner's initials on a stone.

### E. Retro Pixel

**Thesis:** an arcade cabinet in a corner shop: a chunky 8-bit board with bevelled borders, dithered ownership and stepped animation. Sharp and readable, never flickering.

- **Dots:** square pixels.
- **Lines:** pixel bars in the mover's colour with a one-pixel highlight; square ends; crisp edges.
- **Boxes:** dither patterns: player 1 a checkerboard, player 2 horizontal stripes.
- **Initials:** on a small plate in the body face (names and initials are never set in the pixel face).
- **Last move:** a steady outline around the newest bar (never blinking).
- **Chain feedback:** boxes dither in 80 ms apart in 6 steps; chip notes climb.
- **Ground:** the board inside a bevelled cabinet frame (light top-left, dark bottom-right).
- **Type:** Pixelify Sans for headings only (24 px and up, never body text); Overpass for everything else (a road-sign grotesque; tabular digits; every Ghanaian letter).
- **Shapes and depth:** square corners everywhere; 3-4 px bevels; hard 6 px offset shadows.
- **Motion:** lines fill in 8 steps over 240 ms; no CRT flicker, flashes or screen shake.
- **Sound:** low-tempo chiptune (square and triangle waves) at low volume, A minor pentatonic.
- **Authored moment:** an arcade high-score screen where the winner's three initials go up, steady, not blinking.

### F. Proof (proposed by the outside voice; added by the owner on 2026-10-11)

**Thesis:** a print studio: each player is one ink, every move cuts the stencil, and the finished board is a numbered two-ink print. Paper, but never a notebook: no grid, no ruled lines, no pencil, no handwriting.

- **Dots:** small key-ink dots; the four corner dots are registration marks (a circle with a cross).
- **Lines:** key-ink strokes, the same for both players. A line between two boxes of the same owner sinks into the ink, so each territory reads as one shape.
- **Boxes:** print solid in the owner's ink, with a ribbon cut out so the paper shows through. The ribbon runs from the side that gave the box its third line to the side that closed it, so a chain prints as one unbroken river in capture order and a single box as a short hook. Player 1: one band with round bends. Player 2: a double track with square bends. Shape alone tells them apart in greyscale.
- **Initials:** knocked out of the ink in paper colour, in the corner the ribbon leaves free, in every box (the outside voice suggested big boxes only; declined, because initials in every box is an accessibility invariant).
- **Misregistration:** each ink plate sits up to 1.5 px out of register, seeded per match, so no two prints match. Never applied to text.
- **Last move:** two short correction ticks across the newest line.
- **Keyboard cursor:** a registration target with a paper-coloured halo.
- **Chain feedback:** boxes print 60 ms apart along the ribbon; paper pats climb the scale.
- **Operate screens:** key ink on paper, left-aligned, no cards, panels or shadows; square solid-ink buttons; player tags coded by shape (player 1 one rounded corner, player 2 one cut corner); the active tag prints solid and the waiting one is an outline, with the turn also in words.
- **Colour:** colour only ever means a player. The interface itself uses key ink and paper only.
- **Type:** League Gothic for display (the classic wood-type poster gothic, condensed; display sizes only, one weight); Noto Sans for everything else (plain and steady; tabular digits; every Ghanaian letter).
- **Shapes and depth:** square corners; no shadows; depth is ink on paper.
- **Motion:** lines draw like a squeegee pass in 120 ms (ease-out, no bounce); boxes print over 160 ms.
- **Sound:** a squeegee shh for each line, a soft paper pat for each box (chains patter up F major pentatonic), one press clunk when the match ends.
- **Authored moment:** the sheet lifts, the inks land one at a time with the winner's last, the longest ribbon traces box by box, and the margin prints "Proof No. 47 · 4×4 · AM 9–7 MA · 3:12". A personal best gets one extra mark, an "Artist's proof" stamp; a loss gets a "Printer's note" with one tip.

## Colors

**Strategy:** every direction is Committed: one material owns the ground and its neutrals, and the two player colours carry all the meaning.

**Light or dark:** light first, with dark as a full equal. Short breaks happen in daylight, often bright, where a light screen stays readable; many mid-range phones have LCD screens, where dark saves no battery; evenings get the dark theme. By default the app follows the phone's own setting (`prefers-color-scheme`), and the Settings toggle overrides it. Dark surfaces keep their hierarchy through the material's own dark tones (walnut wool, black geoboard, smoky glass, basalt sand, the cabinet, night stock), not by inverting lightness.

**Players:** player 1 is always an orange family and player 2 a blue family, so the pair survives protan, deutan and tritan colour vision (checked by simulation: the two colours stay far apart in every direction). Each player colour is at least 3:1 against its board. Colour is never the only cue: every claimed box also has the owner's pattern and initials.

**Colour that looks like a player always means that player** (adopted from the outside voice). Interface chrome never borrows the player colours; accents (weld yellow, sunshine yellow, ruby, jade, coin yellow) are outside both player families, and Proof uses no accent at all.

**Measured contrast** (WCAG 2.x, computed from the tokens above):

| Direction | Text on page | Muted text | Player 1 on board | Player 2 on board | Initials | Focus |
|---|---|---|---|---|---|---|
| A Loom, light / dark | 13.6 / 14.6 | 6.1 / 7.0 | 4.3 / 5.7 | 6.1 / 6.5 | 14.4 / 11.6 | 13.6 / 14.6 |
| B Pegboard, light / dark | 13.6 / 17.0 | 6.2 / 8.8 | 4.0 / 7.3 | 5.1 / 6.7 | 6.5 and 5.5 / 7.9 and 6.9 | 13.6 / 17.0 |
| C Glasswork, light / dark | 14.2 / 16.0 | 6.5 / 7.9 | 4.0 / 8.0 | 5.4 / 5.8 | 14.7 / 12.3 | 14.2 / 16.0 |
| D Zen Garden, light / dark | 12.4 / 14.3 | 5.9 / 7.5 | 3.8 / 6.2 | 5.7 / 6.3 | 13.4 / 10.6 | 12.4 / 14.3 |
| E Retro Pixel, light / dark | 16.1 / 17.1 | 8.0 / 8.5 | 4.8 / 8.3 | 6.1 / 6.9 | 18.7 / 13.5 | 16.1 / 17.1 |
| F Proof, light / dark | 14.4 / 14.7 | 6.3 / 7.6 | 4.9 / 5.8 | 6.1 / 9.1 | 4.9 and 6.1 / 5.8 and 9.1 | 14.4 / 14.7 |

Neutral board lines (Glasswork, Zen Garden, Proof) and dots are at least 3:1 against the board in both themes.

## Typography

Two self-hosted families per direction: a display face for headings and fixed copy, and a body face for everything else.

**Names rule:** user-entered text (player names, initials, room codes typed by players) is always set in the body face, and every body face has the letters of Ghanaian languages: Ɛ ɛ Ɔ ɔ Ŋ ŋ Ɖ ɖ Ɣ ɣ Ʋ ʋ Ƒ ƒ Ʒ ʒ and the tone marks (Twi/Akan, Ewe, Ga, Dagbani). This was checked in the full font files: none of the first ten candidates had Ɛ or Ɔ, so the body faces were changed. Display faces may lack them because they only set fixed copy.

| Direction | Display (headings, fixed copy) | Body (UI, names, scores) | Self-hosted subset |
|---|---|---|---|
| A Loom | Bricolage Grotesque, variable (opsz, wght 400-800) | Andika 400 and 700 | about 83-115 KB, 3 files |
| B Pegboard | Fredoka, variable (wght 400-700) | M PLUS Rounded 1c 400 and 800 | about 77 KB, 3 files |
| C Glasswork | Marcellus 400 (display sizes only) | Fira Sans 400 and 600 | about 65 KB, 3 files |
| D Zen Garden | Zen Maru Gothic 500 and 700 | Onest, variable (wght 400-800) | about 59 KB, 3 files |
| E Retro Pixel | Pixelify Sans, variable (headings 24 px and up, never names) | Overpass, variable (wght 400-800) | about 55 KB, 2 files |
| F Proof | League Gothic 400 (display sizes only) | Noto Sans, variable (wght 400-800) | about 53 KB, 2 files |

All faces are on Google Fonts under the SIL Open Font License (checked 2026-10-11). Sizes were measured from Google Fonts subsets holding Basic Latin, Latin-1, common punctuation, the cedi sign (₵) and the Ghanaian letters; the budget is 2 families, 4 files and 150 KB.

**Loading (PR 01):** self-hosted woff2 subsets with exactly that character set; preload the display face; `font-display: swap`; reserve space so the swap never moves the layout; remove the Google Fonts links.

**Scale:** display `clamp(2.4rem, 7vw, 3.6rem)` (Proof `clamp(3.4rem, 10vw, 5rem)`, because League Gothic is condensed); section heading 1.5rem (Proof 2.2rem); body 1rem at 1.5 line height; label 0.82rem at weight 700; scores 1.7-2.6rem in the body face with `font-variant-numeric: tabular-nums`, so digits never shift. Headings and body differ by more than a weight. No letter-spaced capitals, no italic display, no tiny tracked labels.

## Layout

- Board-first, one column. The app stays 640 px wide (680 px from a 900 px viewport), the board at most 620 px wide, with 330 px of vertical chrome reserved above and below it. These numbers are coupled to `src/lib/boardFit.ts` and `Board.svelte`; any change follows the layout procedure (Accessibility invariants, last item).
- HUD above the board (player cards and the turn in words), meta chips, the board, actions below. Left-aligned text; nothing centred by default except the board itself.
- Spacing: a 4 px base and the scale in the front matter (4, 8, 12, 16, 24, 32, 48). Comfortable density; controls 44 px or taller; 16 px side gutters plus the safe-area insets.
- Designed first at 360x640 and 390x844, then 768x1024, 1280x800 and 1920x1080.

## Elevation & Depth

Depth always has an offset; there is never a zero-offset coloured halo.
- Loom: soft fabric shadows (small offset, soft blur) and inset stitch lines.
- Pegboard: hard offset shadows with no blur (moulded plastic); buttons press down 3 px.
- Glasswork: depth comes from light inside the panes (a radial gradient), not from shadows.
- Zen Garden: soft paper shadows under cards and stones.
- Retro Pixel: 3-4 px bevels (light top-left, dark bottom-right) and hard 6 px offsets.
- Proof: none. Ink on paper.

## Shapes

Each material has its own corner language (values in the front matter); a nested element's radius is the outer radius minus the gap.
- Loom 4-10 px (fabric tags), Pegboard 10-28 px (moulded), Glasswork 2-4 px (cut glass), Zen Garden 8-18 px (smooth stone), Retro Pixel 0 (pixels), Proof 0 with one 16 px corner on player 1's tag.
- Chips are never full pills by default.

## Components

Every control follows the Interaction states section below; directions change only the look.
- **Buttons:** one primary per screen in the direction's solid primary colour (never a gradient): Loom ink with an inset stitch, Pegboard sunshine yellow with a hard edge, Glasswork lead, Zen Garden jade, Retro Pixel coin yellow with bevels, Proof solid key ink. Secondary: the surface colour with a border. Text buttons: underlined.
- **Player cards (HUD):** avatar with the initial, name, score in tabular digits. The player to move gets a non-colour cue (a heavier border, or in Proof a solid print) and the turn is also written in words. In Proof, player tags are coded by shape: player 1 has one rounded corner, player 2 one cut corner.
- **Chips, segmented controls, toggles, steppers, inputs:** as specified in Interaction states; the selected segment has a check mark as well as colour.
- **Results dialog:** leads with the finished board, then the outcome, the score line, one honest note (a tip after a loss), and the actions (Play again, Change rival, Save image). Focus goes to Play again; nothing auto-starts.
- **Banners and notes:** text with a border or a tinted background, never a coloured side stripe.
- **Empty, loading and error states** are designed for every list and the board (for example the leaderboard's empty state and the offline banner).

## Game board

The board is SVG. Its input logic (`Board.svelte`: pointer handling, hit-testing, the keyboard cursor) is unchanged; only how it looks changes.

| Part | A Loom | B Pegboard | C Glasswork | D Zen Garden | E Retro Pixel | F Proof |
|---|---|---|---|---|---|---|
| Dots | warp pins | moulded pegs | solder joints | stones | square pixels | key dots; corners are registration marks |
| Lines | dyed thread, mover's colour | rubber band, mover's colour | lead came, neutral | raked groove, neutral | pixel bar, mover's colour | key ink, neutral; sinks inside a territory |
| Line preview (hover) | dashed thread | dashed band | dashed came | dashed groove | dashed bar | dashed key line |
| Pressed line | solid, slightly thicker | solid, slightly thicker | solid | solid | solid | solid |
| Keyboard cursor (keyboard mode only) | dashed outline in the focus colour, 3:1 or better | same | square outline | rounded outline | square outline | registration target with a paper halo |
| Box fill | woven patch | plastic tile with a darker edge | glass pane lit from inside | settled sand, tinted | dithered block | solid ink |
| Ownership pattern | twill vs basket weave | ribbed vs dimpled | streaky vs seedy glass | ripples vs straight rakes | checker vs stripe dither | ribbon: round band vs square double track, following the capture path |
| Initials | stitched label | embossed on the tile | etched disc | on a flat stone | plate in the body face | knocked out in paper colour |
| Last-move marker | running stitch beside the line | rings round both pegs | ruby core in the came | ripple ring | steady outline | two correction ticks |
| Chain feedback | weaves in, 90 ms apart | tiles drop, 60 ms apart | panes light, 110 ms apart | blooms, 150 ms apart | dithers in, 80 ms apart | prints along the ribbon, 60 ms apart |

Rules for every direction: no `filter` on lines or boxes (the current per-line drop-shadow glow goes); patterns are SVG `<pattern>` tiles; a line is drawn by scaling from its starting dot (transform only); the board keeps the dot gap of at least 40 px; the last move is always visible without colour.

## Sound

From the brief (10.2 and 10.3): one AudioContext with master, music, sfx and ui buses and a compressor on master, in its own chunk loaded on the first gesture when sound is on; nothing plays before the player chooses sound, and never in the splash. One musical key for everything (a pentatonic scale), in the direction's instrument family:
- line: a short pluck (80-140 ms) whose pitch comes from the line's position, so the board plays a scale;
- box: a two-note chord; chain: each further box steps up the scale; double-deal: a short three-note motif;
- turn change: a very soft tick (optional); win: a 4-note resolving cadence; loss: a gentle 3-note descent, never a buzzer; draw: a suspended chord;
- ui: a subtle click on primary buttons only, never on hover. The opponent's moves play softer. Peak gain at most 0.35.

| Direction | Instruments | Key | Music (generative, 60-76 BPM, sparse) |
|---|---|---|---|
| A Loom | wooden mallets (marimba-like) | C major pentatonic | soft mallet pad |
| B Pegboard | rubber-band twang, wooden clack | G major pentatonic | light plucked bed |
| C Glasswork | soft glass chimes, long tails | D major pentatonic | airy chime pad |
| D Zen Garden | soft piano | A major pentatonic | slow ambient bed at very low volume |
| E Retro Pixel | square and triangle chip voices | A minor pentatonic | low-tempo chiptune |
| F Proof | squeegee shh, paper pats, a press clunk at the end | F major pentatonic (pats) | a quiet press rhythm |

## Brand moments

- **Splash** (brief 10.1, every cold open, once per session): inline in `index.html`, at most 4 KB, no external requests. The mark animates (four dots appear 60 ms apart, a line travels round the square, the box fills in the owner's pattern), then the wordmark "Grid Rivals" with "Dots and Boxes", in each direction's material: a thread pulled round and a twill patch (Loom), a band snapped round and a tile (Pegboard), a came set and a pane lit (Glasswork), a groove raked and a ripple (Zen Garden), pixel bars and a checker (Retro Pixel), a key line and a printed box with its ribbon (Proof). Core animation 1,000 ms or less, exit 300 ms or less; skippable after 300 ms; static with a 150 ms fade when motion is off; `role="status"` with hidden text "Loading Grid Rivals: Dots and Boxes"; no audio.
- **Match intro** (optional): the two player cards slide in from their sides (200 ms), no countdown.
- **Results reveal, the one authored moment:** the finished board leads. Loom: the cloth comes off the loom with a fringed edge and the date on its label. Pegboard: the tiles pop off as one mosaic card. Glasswork: light sweeps across the window. Zen Garden: the garden seen from above with the winner's initials on a stone. Retro Pixel: a high-score screen with the winner's initials, steady. Proof: the inks land one at a time, the longest ribbon traces box by box, the margin prints the proof number, score and time.
- **Level-up:** one short, calm acknowledgment in the results ("Level 8"), with the direction's material (a new thread colour, a gold tile, a lit pane, a smooth stone, a pixel star, an "Artist's proof" stamp). No confetti storms; confetti, where kept, is off with motion off.
- **Home** (idea from the outside voice, for PR 08): Home's hero shows the player's most recent finished board; a first-time player sees a demo clearly labelled as two AI rivals.

## Interaction states and micro-interactions

Every control is specified in Saffer's four parts. These apply in every direction; the direction only changes how a state looks.

| Control | Trigger | Rules | Feedback | Loops and modes |
|---|---|---|---|---|
| Buttons (`.btn`, all variants) | Pointer press, Enter or Space | Hover only under `@media (hover: hover) and (pointer: fine)`; async buttons (Start game while saving a name, Create game, Join, Save name, Reset stats) set `aria-busy="true"` and ignore further presses | Hover: visible change within 120 ms. Pressed: within 50 ms (`translateY(1px)` or `scale(.98)` plus a darker tone; Pegboard presses down 3 px, Retro Pixel inverts its bevel). Busy: a small spinner and the label kept | Disabled: clearly inactive, `cursor: not-allowed`, no hover or press, still readable |
| Brand (home) button, back buttons, level chip | Press | Same as buttons; 44 x 44 px minimum | Same as buttons | None |
| Segmented controls (board size, rival, leaderboard tabs) | Press, arrow keys inside the group | `aria-pressed`; one selected | Selected gets a non-colour cue too (weight plus a check mark, or an indicator) | None |
| Toggles (sound, animations, theme) | Press | `role="switch"`, `aria-checked` | The knob moves (150 ms, transform only) and the track fills; the label never changes meaning | Settings persist |
| Size steppers | Press, hold does not auto-repeat | Labelled, with a live output; disabled at the fit limit | Value changes at once | Offered sizes always respect `MIN_TAP_PX` |
| Text inputs | Focus, typing | 48 px tall; label above | Focus: the border takes the focus colour plus the focus ring | Errors in `role="alert"` under the field |
| Results actions | Press | The primary action gets focus when the dialog opens | Same as buttons | Never auto-starts the next match |
| Board lines | Pointer move or press, arrow keys and Enter or Space | Input logic in `Board.svelte` is unchanged (approval gate) | Hover preview: a dashed version of the line in the mover's colour (neutral in Glasswork and Zen Garden); pressed: solid and slightly thicker while the pointer is down; keyboard cursor (keyboard mode only): an outline at 3:1 or better | Drawn lines have no hover |

Focus-visible everywhere: a 2-3 px ring offset 2-3 px, at least 3:1 against both the control and its background, never clipped (check `.tabs` and the results dialog) and never under sticky elements (WCAG 2.4.11). No ring for mouse or touch focus (`:focus:not(:focus-visible)`), as the board does today. Replace the default tap highlight with the designed pressed state (`-webkit-tap-highlight-color: transparent`). Controls stay at 44 x 44 px or larger and never below 24 x 24 px (WCAG 2.5.8).

## Accessibility invariants (never regress)

Copied from the overhaul brief, section 8.

- The board is a focusable SVG with `role="application"` and an `aria-label`; arrow keys move a cursor between free lines; Enter or Space draws; the cursor shows only in keyboard mode.
- Every move is announced in an `aria-live="polite"` region ("X drew a line and closed N boxes. Score A to B.").
- Box ownership is shown by colour plus pattern plus initials.
- `:focus-visible` outlines on all controls; no focus ring after a mouse click or tap on the board.
- `prefers-reduced-motion` turns animations off by default; the Settings "Animations" toggle and the `.no-anim` class disable all motion globally.
- Sound stays off until the player chooses it.
- Controls at 44 px or larger; the board only offers sizes whose dot gap is at least 40 px (`MIN_TAP_PX`); `MAX_SIDE` stays 12.
- Light and dark themes, with the `theme-color` meta updated.
- Semantics: sections labelled by headings; the results dialog (`role="dialog"`, `aria-modal`, focus to the primary button); segmented controls with `aria-pressed`; toggles with `role="switch"` and `aria-checked`; steppers with labels and a live output; progress bars with `role="progressbar"`; errors in `role="alert"`, status in `role="status"`.
- Safe-area insets; no horizontal scroll.
- Targets: WCAG 2.2 AA, plus 2.3.3 (animation from interactions) through the Animations setting. Audio Control (1.4.2): no audio before a user choice and a visible mute on every screen. No flashing more than 3 times per second.
- Reduced motion: replace motion with opacity fades of 150 ms or less, or nothing. Confetti off. Splash static.
- Layout coupling (brief 8.4): `available()` in `src/lib/boardFit.ts`, the inline width on `.board-wrap` in `Board.svelte`, and `.board-wrap` and `.app` in `app.css` must agree. Any change to chrome above or below the board follows the measure, update, verify and document procedure in the brief.

## Engagement ethics

Copied from the overhaul brief, section 7.0. Check every PR against it.

Principles: feedback over fireworks, acknowledgment over endless streaks, agency over hooks.

Always:
- Rewards come from skill and play, and are explained (keep the XP formula on Stats).
- Offer natural stopping points; celebrate a good session, not time spent.
- Let players hide the weekly rhythm and turn off chatter, sound, music, vibration and animations.
- End losses kindly, with one useful tip.
- Show only real progress.

Never:
- Energy, lives or timers that gate play.
- Loot boxes, surprise chests or other random rewards with value, currencies, purchases, ads or rewards for watching them, pay-to-skip or paid streak repair.
- Loss-framed streaks: no alerts about a broken streak, no red "lost" states, no countdowns.
- Time-limited exclusives that never return.
- Fake players, fake activity, or bots presented as people.
- Auto-starting the next match or endless queues.

## Performance budgets

From the overhaul brief, section 9 (baseline on main at the time of the brief: index JS 42 KB gzip, CSS 4.3 KB gzip).

- Index JS at most 57 KB gzip; CSS at most 12 KB gzip; the inline splash at most 4 KB; no new chunk on the startup path.
- Audio code in its own chunk, loaded on the first user gesture when sound is on; a music file, if ever added, at most 1.5 MB and fetched only after music is turned on.
- Fonts: at most 2 families, at most 4 woff2 files, 150 KB total (each direction's pair below is measured).
- No `filter` or `backdrop-filter` on per-line or per-box elements; animate transform and opacity only. Textures are SVG patterns or tiny tiles.
- 60 fps on a mid-range Android during chain captures on 6x6 (no long tasks over 50 ms, even at 6x CPU throttling); CLS 0 on the game screen; the AI thinking delay unchanged.
- /benchmark shows no LCP or TBT regression beyond noise.

## Do's and Don'ts

- Do let the board's material carry the identity: lines, boxes, sound and the results all come from it.
- Do show ownership three ways in every box: colour, pattern, initials.
- Do keep one primary button per screen, in one solid colour the palette owns.
- Do set names and initials in the body face, and test a name with Ɛ, Ɔ and Ŋ on every screen that shows names.
- Do design the empty, loading, error and offline states with the same care as the happy path.
- Don't bring back purple gradients, aurora blobs, frosted glass, gradient buttons, neon or zero-offset glows, grid paper, or bounce easing.
- Don't put a `filter` or `backdrop-filter` on lines or boxes, or animate anything but transform and opacity.
- Don't use a player colour for interface chrome, or a red "lost" state anywhere.
- Don't give every element the same radius, or wrap everything in cards (and never a card inside a card).
- Don't centre everything, add a label above every heading, or use emoji as decoration.
- Don't use pencil, ruled lines or handwriting (the rejected notebook look), even in Proof.

## Motion

- **Approach:** intentional. Motion explains what just happened (a line drawn, a box claimed, a chain), and the screen is still otherwise.
- **Easing:** enter ease-out, exit ease-in, move ease-in-out; never overshoot or bounce. Retro Pixel uses `steps()` instead.
- **Duration:** micro 50-100 ms (presses), short 120-260 ms (lines, toggles), medium 150-520 ms (box fills, per direction), long 400-700 ms (the results reveal).
- **Per direction:** Loom threads pull taut in 140 ms and boxes weave in over 240 ms; Pegboard bands snap in 160 ms and tiles drop in 150 ms; Glasswork cames set in 120 ms and panes light over 340 ms; Zen Garden grooves take 260 ms and boxes bloom over 520 ms; Retro Pixel lines fill in 8 steps over 240 ms and boxes dither in 6 steps; Proof lines draw in 120 ms and boxes print over 160 ms.
- **Reduced motion and the Animations toggle:** everything becomes an opacity fade of 150 ms or less, or nothing; the splash is static; no confetti.
- **The one authored moment:** the results reveal of the finished board (see Brand moments).

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-10-11 | Initial design system created, PROVISIONAL, with six candidate directions | Created by /design-consultation from the owner's brief (Step 1), research on five reference sites, and one outside voice. Final tokens wait for the owner's choice in /design-shotgun. |
| 2026-10-11 | Directions A-E as specified in the owner's brief; F Proof added | Proof was proposed by an independent outside voice (a Claude helper given the same brief); the owner chose to add it as a sixth candidate. Adapted: initials in every box, its own fonts, a darker orange so paper-coloured initials reach 4.5:1. |
| 2026-10-11 | Light first, dark a full equal; the default follows the phone's setting | Use scene: daytime breaks in bright light, evenings at home; many mid-range phones are LCD, where dark saves no battery. Today's app always starts dark. |
| 2026-10-11 | Body faces must cover Ghanaian letters (Ɛ ɛ Ɔ ɔ Ŋ ŋ Ɖ ɖ Ɣ ɣ Ʋ ʋ Ƒ ƒ Ʒ ʒ, tone marks); names and initials always use the body face | Raised by the outside voice and confirmed in the full font files: none of the first ten candidate fonts had Ɛ or Ɔ. Body faces changed to Andika, M PLUS Rounded 1c, Fira Sans, Onest, Overpass and Noto Sans. |
| 2026-10-11 | Orange family against blue family for the two players, in every direction | Colour-vision safe (checked by simulation), each at least 3:1 against its board. |
| 2026-10-11 | Colour that looks like a player always means that player | Adopted from the outside voice; interface accents stay outside both player families. |
| 2026-10-11 | Results lead with the finished board; the score comes second | The owner's memorable thing: every match leaves a beautiful artifact of who claimed what. |
| 2026-10-11 | Glasswork, Zen Garden and Proof draw lines in a neutral colour | Who drew a line never affects the score; ownership lives in the boxes, and a last-move marker shows the newest line. |
| 2026-10-11 | Initials in every claimed box, at every board size | Accessibility invariant (colour plus pattern plus initials); the outside voice's "big boxes only" was declined. |
| 2026-10-11 | Fonts self-hosted, two families per direction, measured at 53-115 KB | Budget: 2 families, 4 files, 150 KB. All OFL, checked on Google Fonts. |
