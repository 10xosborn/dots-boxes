# Design review: design/01-themes (spec step 1: theme tokens and the theme picker)

| Field | Value |
|---|---|
| Date | 2026-10-12 |
| Branch / commits | design/01-themes; audited 9e4d256, fixed through 06d45e5 (base main 3b3de84) |
| Target | production build on http://127.0.0.1:4173/ (Firebase blocked, fonts self-hosted), rebuilt after each round of fixes |
| Mode | diff-aware (every screen: app.css changed globally); all six theme modes at phone 390x844 and desktop 1280x800 |
| Driver | gstack's own headless Chromium through gstack's bundled playwright-core (Aside is macOS-only; the $B daemon can't block Firebase) |
| Reference | `docs/design/ui-themes-spec.md` (local) and the 25 board mockups (rendered statically: their canvas runtime is absent, so mockup boards are blank) |
| Detector | impeccable 0.1.3, installed today at the owner's request (D1); static scan of the rendered DOM; cross-origin CSS not resolved |
| Outside voices | unavailable (Codex not installed); no second-model review |

## First impression (Tabletop night, desktop Home)

- The site communicates **a calm board game on a dark wooden table**: warmer and more deliberate than the old purple glass.
- I notice the wood tile reads as soft horizontal streaks at desktop width; the centred column of solid cards sits on it cleanly.
- The first 3 things my eye goes to are: **the red and blue "B A A" hero tiles**, **the "Grid Rivals" title**, **the teal Play button**. That is the right order: brand, then the one action.
- One word: **warm**.

## Inferred design system (rendered)

| Theme | Fonts in use | Notes |
|---|---|---|
| Tabletop | Jost | 1 face; body 16 px; H1 39 px/800 |
| Neon | Manrope (UI), Unbounded (display) | 2 faces |
| Paper | Atkinson Hyperlegible (UI), Kalam (display) | 2 faces; Atkinson's slashed zero reads "1ØØ" at a glance (by design of the font) |

Colours match the DESIGN.md tokens (PR #7) in all six modes. No touch target under 44 px on any audited page.

## Scores

| | Baseline | Final |
|---|---|---|
| **Design score** | A- (3.53) | **A** (3.88) |
| **AI slop score** | A | **A** |
| Detector (counted findings) | 138 | **122** (low-contrast 37 → 21; every remaining hit reviewed below) |

| Category (weight) | Baseline | Final | Why |
|---|---|---|---|
| Visual hierarchy (15%) | A | A | One focal point per screen; FINDING-007 is polish |
| Typography (15%) | A | A | ≤ 2 faces per theme, 16 px body |
| Spacing & layout (15%) | A- | A- | FINDING-009: three phone screens scroll (pre-existing, main too) |
| Color & contrast (10%) | D | A | FINDING-001, 003, 004, 005, 006 fixed |
| Interaction states (10%) | A- | A | FINDING-002 fixed |
| Responsive (10%) | A- | A- | Paper's desktop notebook spread is spec step 4 |
| Content (10%) | A | A | |
| AI slop (5%) | A | A | The purple gradient and frosted glass are gone; Neon's glow is the owner's spec |
| Motion (5%) | A | A | 0.32 s ease-out entrance; XP bar animates width (pre-existing, polish) |
| Performance feel (5%) | A | A | First paint 52-88 ms warm/cold locally (see the benchmark) |

## Findings

| # | Impact | Finding | Status | Commit |
|---|---|---|---|---|
| 001 | High | Home Play label was 17.6 px; the spec needs 19 px bold where white sits on coral (3.2:1) and night teal (3.9:1) | verified | 01c2c74 |
| 002 | Medium | Primary hover lightened the fill: white label 4.2:1 (Tabletop), 3.4:1 (night), 2.9:1 (Neon) | verified: 6.3 / 5.1 / 4.2 / 4.0:1 | 26b5864 |
| 003 | Medium | Level-up badge text 2.45:1 (light table), 3.37:1 (Neon by day); the spec's Tabletop level up "adds a chip" | verified: chip colours, gold ring | 77e9138 |
| 004 | Medium | Chosen theme card's description 4.3:1 (Neon by day), 3.05:1 (chalkboard) | verified | 14d8ef5 |
| 005 | Medium | The "&" in "Dots & Boxes" 3.41:1 (light table), 4.29:1 (night), 2.98:1 (Neon by day; coral never carries small text) | verified: ≥ 5.4:1 everywhere | 1bd0cdc |
| 006 | Medium | Neon's selected rings used bright coral by day: 2.75:1 on the tint, 2.98:1 on the control; spec: small selected rings use #D63F3D | verified | 202cb10 |
| 007 | Polish | Tick on selected segments isn't in the Tabletop or Neon mockups (ring and tint only) | verified: Paper keeps it | c66b546 |
| 008 | Polish | Paper's orange initial on its peach wash 2.99:1, under the spec's 3:1 for icons | verified: sticker on the page colour with a ring in the player's pencil, 3.65:1 | 06d45e5 |
| 009 | Medium | Phone screens that scroll: Home with the Continue card and offline banner (+179 px), Custom setup (+133), My stats (+514) | deferred to spec step 4 (main: +173 / +146 / +494) | |

All fixes are CSS, plus one colour in `Home.svelte`. Before/after: `screenshots/before-after.png` (crops of each fix; the hover pairs use the old rule injected over the fixed one). After the fixes: check 0/0, build OK, and the QA suites 37 + 108 + 9 + 31 checks all pass on the final build.

### Detector hits kept as by design (with evidence)

- **dark-glow (50):** the active player card's ring and soft glow (`0 0 0 2px <player>, 0 0 22px -4px <glow>`) is copied from the mockups' own values; Neon's board frame glow is in the spec ("add the line-group glow, the board frame").
- **cramped-padding (21):** the turn pill sliding inside its track and the board inside its frame, as in the mockups.
- **codex-grid-background (36, advisory):** Neon's board grid, as in the mockups.
- **cream-palette (6):** Paper's page colour is the spec token #FBF7EE.
- **gray-on-color (12):** the main text colour on the spec's selected tints (night table #10363A, chalkboard highlighter #6B5A1E), 6-11:1.
- **low-contrast (21):** decorative (aria-hidden) initials at the spec's 3:1 icon bar: white on Tabletop blue 3.9:1 ("white icons on the box fills 3.9:1"), white on coral 3.2:1 ("white initials on coral 3.2:1"), Paper orange on the page 3.7:1 ("orange pencil on the page 3.7:1"); and Neon by day's brand text, which the scanner reads against the page colour but which sits at 28-48 px inside the solid slate band (0-66 px): 4.65:1, as the spec computes.
- **layout-transition (12):** the XP bar's width animation, on main too.

## Every place the result differs from its mockup

This PR is spec step 1 (tokens), so most differences belong to later steps. Items marked **new** are not in any mockup.

**Every theme**
- **new:** the palette button in the top bar and its theme sheet (three themes plus Light and Dark), and the Theme panel in Settings: the owner asked for a theme toggle; no mockup covers it.
- Top bar: the mockups show one avatar chip (avatar, name, "Lv 7"); the app shows the theme button, a level ring and the name (avatars: step 3).
- Player cards and top bar: initials instead of avatars and the bot icon (step 3).
- Turn pill: no "+1 extra turn" cue yet (step 3).
- Results: the mockups put the players' avatars and scores in a strip above the dialog; the app keeps the player cards behind the scrim. Level up is a chip-styled badge inside the XP block, not a chip in the chips row (step 5).
- Quit and Restart still use the browser's confirm (themed confirm: step 5).
- Home and Settings have no mockups: they keep today's layouts in each theme's tokens.

**Tabletop (light and night)**
- Board: no grey lanes, flat lines without the offset shadow, no darker last line, initials and stripes in boxes instead of the person and bot icons (step 2).
- Setup: today's segmented controls (ring and tint) instead of the mockup's tiles for mode and AI opponent, teal-filled chips for size and who starts, the avatar with a pencil badge, the summary line and Start game pinned at the bottom (step 6).
- Avatar builder: not built (step 6).

**Neon (dark and light)**
- Board: lines don't glow (only the frame does) and there is no last-move ring (step 2).
- Level up: a chip with a gold ring instead of today's gold badge (this PR, FINDING-003: small text on gold fails contrast by day).
- Setup: matches its mockup (today's layout recoloured) apart from the avatar with a pencil badge beside the name (step 6).

**Paper (light; the chalkboard has no mockup)**
- Players: boxed cards with numbers instead of the ruled score sheet with names in Kalam, tally marks in gates of five, the active score circled and a pencil underline; avatars are ringed initials, not stickers with faces (step 3).
- The turn line ("Your turn. You closed a box, go again!" with the highlighter) and the clock line are chips and a pill here (step 3).
- Board: no pencil wobble; boxes show a hatched wash with initials instead of the mockup's marks (step 2).
- Desktop: one centred column instead of the two-page notebook spread (step 4).
- Results: the standard dialog in Paper's colours instead of the torn scorecard with tallies, a hatched level bar and the XP stamp (step 5).
- Setup: boxed segments with a highlighter fill and a tick instead of choices written on the page, circled in orange, with hand-drawn checkboxes (step 6).

## Deferred suggestions (not covered by the spec, so not changed)

- `color-scheme: dark` for the dark modes (scrollbars and native controls are light today, on main too).
- Themed text selection (`::selection` uses the browser default).
- `text-wrap: balance` on the Home title.

## Interaction flow: choosing a theme

I tap the palette button (top right, labelled with the current theme), a sheet rises with three previews, each name in its own font; my current theme is focused. I tap Paper: the whole app changes at once behind the sheet, the browser bar recolours, and the choice is saved. Light and Dark sit right under the choices. Done, Esc or a tap outside closes it, and focus returns to the button, which now says Paper. A reload paints Paper before the app starts. Goodwill 70 → 85 (+10 the toggle is where the eye goes; +5 instant preview, nothing to confirm).

## Litmus (app UI)

Brand unmistakable in the first screen: yes. One strong visual anchor: yes (hero board). Understandable by scanning: yes. One job per section: yes. Cards necessary: yes (cards are the controls and the player HUD). Motion improves hierarchy: yes (single entrance). Premium without decorative shadows: yes for Tabletop and Paper; Neon's glow is the owner's choice. Hard rejections: none.

**PR summary:** Design review found 9 issues, fixed 8 (1 deferred to the responsive step). Design score A- → A, AI slop score A → A.
