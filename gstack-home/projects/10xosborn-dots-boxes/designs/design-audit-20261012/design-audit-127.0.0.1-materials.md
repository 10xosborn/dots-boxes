# Design review: Grid Rivals, new palettes, materials and lighting (design/02-materials)

| Field | Value |
|---|---|
| Date | 2026-10-12 (finished 2026-10-13) |
| Branch / commits | design/02-materials; reviewed at dc37f0f (after the /qa fix 9501ba4); fixes 9d5463a and 70ab46e |
| Target | Production build served by `vite preview` at http://127.0.0.1:4173/, Firebase blocked (local adapter, offline banner) |
| Mode | Diff-aware (feature branch) plus regression against the PR #8 baseline (`design-baseline.153918-final.json`) |
| Driver | gstack's own headless Chromium through its bundled playwright-core (Aside is macOS-only); phone 390x844 at 2x with touch, desktop 1280x800 |
| Classifier | OPERATE (a game's app UI) with a small PERSUADE hero on Home |
| Detector | impeccable 0.1.3, DOM mode: static scan of the rendered DOM; cross-origin CSS not resolved |
| Outside voices | Codex: not installed (`outside_status: unavailable`). The skill's Claude subagent voice was not started: agents run only when the owner asks. Native review only |
| Evidence | `run-202855/` beside this file: `screenshots/` (36 captures), `sheets/` (six modes side by side per screen), `screenshots/flows/` (first impression, hover, keyboard cursor, theme sheet), `screenshots/after-001/`, `screenshots/after-002/`, `final/screenshots/` (after both fixes), `detect-202855.json`, `detect-final-001309.json` |

## Headline

**Design score A → A. AI slop score A → A.** Two findings fixed (one Medium, one Polish), two deferred to the steps that rebuild those parts. Detector: 122 → 140 counted rows against PR #8's baseline (same pages, same engine), every new row checked in the rendered page and explained below; no row survives as a defect.

## First impression (a new visitor: Tabletop at night, 1280x800)

Evidence: `screenshots/flows/first-impression-desktop-settled.png`, `first-impression-phone.png`, `sheets/phone-home.png`.

- The site communicates **a board game set out on a dark wooden table at night**: walnut planks, brass pegs, cream type, one butter-yellow button.
- I notice **the hero board playing itself**: a line is drawn, a box fills with "B", on the same felt and brass the real board uses, so the first screen already shows the game.
- The first 3 things my eye goes to are: **the "Grid Rivals" title**, **the Play button**, **the hero board**. That is the intended order: name, action, proof.
- One word: **warm**.

Page areas: top bar (brand, theme, level), offline banner, hero, profile card, menu. Each is nameable in under two seconds. Trunk test: PASS on every screen (brand top left, page title with Back, the options obvious).

## Inferred design system (rendered)

From `run-202855/extract-202855-28684.json` (Home, phone, each mode):

- **Fonts:** Jost (Tabletop); Manrope with Unbounded display (Neon); Atkinson Hyperlegible with Kalam display (Paper). Two faces at most per theme, as DESIGN.md says. ("Times New Roman" counts are `<head>` elements, not rendered text.)
- **Colours:** 9 to 13 distinct values per mode, all from the owner's palettes plus their documented deeper or lighter shades. Warm neutrals in Tabletop and Paper, cool in Neon; no mixing.
- **Headings:** one h1 per screen (39 px), screen titles as h2; `text-wrap: balance` on the h1.
- **Touch targets:** none under 44 px on Home in any mode. Body text 16 px.
- **Browser surfaces:** `color-scheme` was `normal` in the dark modes and `::selection` the browser's default (FINDING-002, fixed).

## What changed in this branch, screen by screen

Sheets: `sheets/phone-{home,game,results,setup,settings}.png`, `sheets/desktop-game.png`, `sheets/other/phone-{leaderboard,stats,online,home-continue,setup-custom}.png`.

- **Tabletop:** the page is wood (maple by day, walnut at night) with plank seams, light from above and darker edges; the board is a felt mat (pale mint, or sage at night) inside a wood rim with a cast shadow; lines and dots are engraved, both players' lines one board colour, boxes solid with a rim. It reads as a physical game surface, which is the plan's acceptance line for this theme.
- **Neon:** coloured light pools from the corners of a near-black room (a soft version by day); the board has a lit edge and a coloured glow; lines glow like tubes with bright cores at night; dots are small lights; the main action glows most, then the chosen option and the turn pill, then hover. Visible, and the hierarchy holds: on every Neon screen the main action is the brightest thing.
- **Paper:** a sheet with formation, fibres and tooth on a kraft desk (charcoal at night); lines and dots printed and pressed into it; hatched boxes; paper-tab buttons. Not just a paper colour: the texture is visible at 1x and 2x, which is the plan's acceptance line.
- **Text over the materials:** every text line on seven screens in six modes measures at or above its bar against the real pixels under it (QA probe C1: tightest 4.51:1, Paper by day's tagline on the desk).
- **Keyboard cursor:** a 3 px ring in the focus colour round the chosen line (fixed in /qa: 4-7.4:1 from pixels; brass in Tabletop at night).

## Findings

### FINDING-001 (Medium, Interaction States): only buttons answered the pointer — FIXED, verified

- **What:** on desktop, segmented options (Setup, Leaderboard, Online), theme cards, the theme button, the level chip, the Back button, switches and the board-size steppers had no hover state and no press state; only `.btn` buttons did. Hovering "Hard" in Setup looked the same as not hovering it (`sheets/flows-setup-hover/setup-hover.png`). Present on main too, but the owner's plan (Priority 3) asks for "hover, focus, active, selected, completed, and disabled states", and this branch gives every control a material.
- **Fix (9d5463a, `src/app.css`, CSS only):** a hover tint on chips, options and steppers (in Neon a faint ring, the hover tier of its glow; Tabletop's chips lift like its buttons), a halo round a switch's knob, and a 0.97 press on every control. Hover rules stay inside `(hover:hover) and (pointer:fine)`; the Animations-off rule still removes their transitions.
- **After:** `dr-hover.mjs` 37/37: each control's computed look changes on hover in all six modes and a held option scales to 0.97 (`screenshots/finding-001-after.png`, crops in `screenshots/after-001/`). Themes suite 37/37 on the final build.

### FINDING-002 (Polish, Colour / browser surfaces): the dark modes kept light browser surfaces — FIXED, verified (computed)

- **What:** no `color-scheme: dark` in the dark modes, so the desktop page scrollbar (Home is 18 px taller than 800 px) and the theme sheet's scrollbar render light on walnut, navy and charcoal; selected text used the browser's blue in every theme.
- **Fix (70ab46e, `src/app.css`):** `[data-theme="dark"]{color-scheme:dark}` and `::selection` tinted with the theme's accent at 32%. Buttons and inputs already inherit colour and set their own backgrounds, so nothing else changes.
- **After:** computed `color-scheme` is `dark` in the three dark modes and `normal` in the light ones; selection is the accent at 32% in all six (`dr-scheme.mjs` 6/6). Headless Chromium draws no scrollbars, so the scrollbar colour itself was not seen; it follows `color-scheme` in Chromium, Brave and Edge.

### FINDING-003 (Polish, deferred to step 3): avatar initials are weak in some modes

- White initials on the players' colours: 2.3:1 on cyan (Neon at night's AI), 3.4:1 on burnt orange, 3.5:1 on coral, 3.8:1 on coral red; Paper's outlined initials 3.2:1. They are `aria-hidden` decoration and the name beside them carries identity (DESIGN.md), so they are not counted against contrast. Step 3 replaces them with avatars and the AI's bot.

### FINDING-004 (Low, deferred to the drag-to-draw PR): the hover preview is faint in four modes

- From /qa (ISSUE-002): the dotted preview in the mover's colour at 75% reaches 1.94-3.01:1 against the board in Tabletop (both modes), Neon by day and Paper by day. The next PR replaces it with the themed drag line and must give that line 3:1.

## Detector: 122 → 140 counted rows (same 36 pages, same engine, DOM mode)

| Rule | PR #8 baseline | This branch | Verdict after checking the rendered pages |
|---|---|---|---|
| low-contrast | 21 | 21 | The decorative avatar initials (FINDING-003), the same elements as before with the new palette's numbers |
| dark-glow | 50 | 71 (+21) | Neon's glow is now on the board edge, the turn pill, the chosen option and the main action, as the owner's plan asks; DESIGN.md's `--cta-glow` and `--sel-glow` tokens bless it. The other themes' single row per page is a CSS-level match for a Neon rule (the dump carries every theme's CSS), plus Tabletop at night's dark-brown board shadow (depth, not glow) |
| cramped-padding | 21 | 36 (+15) | `turnbar` is the sliding turn track (the pill fills its half by design); `board-wrap` now has its own surface in every theme and the SVG fills it, but the dots are drawn inset inside the SVG, which a static scan can't see |
| layout-transition | 12 | 12 | The XP bar's width transition (unchanged, polish) |
| gray-on-color | 12 | 0 (−12) | Gone with the new palettes |
| cream-palette | 6 | 0 (−6) | Paper's new palette no longer reads as the default cream |
| advisory: repeating-stripes-gradient | not recorded | 36 | Tabletop's plank seams (the wood material the plan asks for) |
| advisory: codex-grid-background | not recorded | 36 | Neon's faint board grid (the spec's "glass with a faint grid") |

After both fixes the rescan covered 35 of the 36 pages (one fresh dump was refused by the redaction check, apparently transiently: the same page's first dump passes the same check); on those 35 pages every rule count is unchanged, so the fixes add no detector rows.

## Litmus checks

| Check | Answer |
|---|---|
| Brand unmistakable in the first screen? | Yes: the title and a hero board playing itself |
| One strong visual anchor? | Yes: the hero board on Home, the board in a game |
| Understandable by scanning headlines? | Yes |
| Each section one job? | Yes |
| Cards necessary? | Yes: the player cards are the HUD, the panels group settings |
| Motion improves hierarchy or atmosphere? | Yes: the hero demo and line growth; nothing else moves |
| Premium without decorative shadows? | Tabletop and Paper yes (the materials carry them); Neon's glow is its brief |

Hard rejection criteria: none apply. The three-looks calibration: Neon at night is the "near-black with glowing edges" look and Paper sits near "cream with a red accent", but both are the owner's brief (palettes and materials given exactly), so they pass on that ground, not by accident.

## Where the result differs from the mockups

The mockups predate the owner's redesign plan (2026-10-12); **Plan** marks a difference the plan asks for.

**Every theme**
- **Plan:** colours are the owner's palettes, not the mockups' (the spec's colour tables are updated to match).
- **Plan:** real materials and lighting instead of flat fills: wood, felt and rim (Tabletop), ambient light and glow (Neon), paper texture on a desk (Paper).
- The keyboard cursor is a translucent band inside a 3 px focus ring (the spec asks for "a focus ring"; the mockups show no cursor).
- Hover and press states on every control, and themed text selection (the plan's controls-and-states step; no mockup shows hover).
- Still from PR #8 (later steps): initials instead of avatars and the AI's bot (step 3); no "+1 extra turn" cue (step 3); results keep the player cards behind the scrim instead of the avatar strip, level up inside the XP block (step 5); the browser's confirm for Quit and Restart (step 5); Home and Settings have no mockups.

**Tabletop**
- **Plan:** a felt board (pale mint, sage at night) in a wood rim instead of the white sheet; lines engraved in one board colour for both players instead of charcoal lines with an offset shadow; boxes get a rim.
- No darker last line and no person and bot icons in boxes (step 2). Setup tiles, the avatar with a pencil badge and the avatar builder (step 6).

**Neon**
- **Plan:** lines, dots and boxes glow (the mockup glows only the frame); coloured ambient light in the room; teal (indigo by day) for the main action instead of coral.
- No last-move ring yet (step 2). Level up stays a chip with a ring.

**Paper**
- **Plan:** a textured sheet on a kraft desk instead of the plain notebook page with a margin line; coral and indigo (cyan at night) instead of orange pencil and blue ink.
- Boxed player cards instead of the ruled score sheet with tallies and circled scores; a pill and chips instead of the turn line and clock line (step 3). No pencil wobble (step 2). One centred column on desktop instead of the notebook spread (step 4). The standard results dialog instead of the torn scorecard (step 5). Boxed segments with a tick instead of written choices (step 6).

## Goodwill

70 → 85: the main task (Play, or Continue when a game waits) is the one bright control on every screen (+10); the offline banner says plainly why results stay on the device (+5). No drains found.

## Fixes

| Finding | Status | Commit | Files |
|---|---|---|---|
| FINDING-001 | verified | 9d5463a | `src/app.css` |
| FINDING-002 | verified (computed; scrollbar colour not visible in headless Chromium) | 70ab46e | `src/app.css` |
| FINDING-003 | deferred (step 3) | | |
| FINDING-004 | deferred (drag-to-draw PR) | | |

Design-fix risk: 0% (two CSS-only changes, no reverts). Regression checks: `dr-hover.mjs` 37/37, `dr-scheme.mjs` 6/6, themes suite 37/37, final captures in all six modes with no page errors (`final/`).

## Grades

| Category | Baseline (this branch before fixes) | Final |
|---|---|---|
| Visual hierarchy | A | A |
| Typography | A | A |
| Spacing and layout | A- (phone screens that scroll: pre-existing, step 4) | A- |
| Colour and contrast | A | A |
| Interaction states | A- (FINDING-001) | A |
| Responsive | A- (same pre-existing scroll) | A- |
| Content | A | A |
| AI slop | A | A |
| Motion | A | A |
| Performance feel | A | A |

**PR summary:** Design review found 4 issues, fixed 2 (2 deferred to the steps that rebuild those parts). Design score A → A, AI slop score A → A.
