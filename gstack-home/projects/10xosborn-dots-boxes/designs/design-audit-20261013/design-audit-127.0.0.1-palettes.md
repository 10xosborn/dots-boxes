# Design Audit: Grid Rivals, the dark palettes PR (design/03-dark-palettes)

| Field | Value |
|-------|-------|
| **Date** | 2026-10-13 |
| **Target** | http://127.0.0.1:4173/ (production build, Firebase blocked), code at aaf519c, fixes bd699d7 and b013542 |
| **Scope** | All six theme modes at phone 390x844 (touch) and desktop 1280x800: Home, the game, the theme sheet, Settings, Setup (Custom); the results dialog and Continue card from the QA run's captures |
| **Calibration** | DESIGN.md (`spec` format, 150 tokens) and the locked spec `docs/design/ui-themes-spec.md`; the owner's 2026-10-13 requests and choices |
| **Driver** | gstack's playwright-core with headless Chromium (Aside is macOS-only) |
| **Detector** | impeccable 0.1.3, DOM mode: 12 rendered pages (phone Home and game, six modes); static scan of the rendered DOM; cross-origin CSS not resolved |
| **Outside voices** | Codex not installed (`outside_status: unavailable`); the subagent voice not started (agents run only when the owner asks) |
| **Classifier** | OPERATE (a game app): App UI rules |

## Headline scores

**Design Score: A → A** · **AI Slop Score: A → A**

| Category | Grade | Notes |
|---|---|---|
| Visual hierarchy | A | One gold (or, by day, burnt orange / indigo) main action per screen; title, hero board, Play read in that order |
| Typography | A | Unchanged faces (Jost, Unbounded + Manrope, Kalam + Atkinson); text from pixels at or above its bar everywhere (QA C5) |
| Spacing & layout | A | Unchanged layout; no sideways scroll at any size (QA C4, C9) |
| Color & contrast | A | The owner's four dark colours carried through every night mode; gold reserved for actions, focus, selection and progress; lines per player in every theme |
| Interaction states | A | Every button lit from above in all six modes, hover fills that raise label contrast, recessed switches with raised knobs (QA C2) |
| Responsive | A | Phone and desktop both checked; Setup with Custom scrolls on phones (pre-existing; the spec's step 4) |
| Content | A | Unchanged copy |
| AI slop | A | See below |
| Motion | A | The aurora drifts over 34-46 s and stops for Animations off and reduced motion (QA C1, C10) |
| Performance feel | A | Not measured here (separate /benchmark) |

## First impression (Tabletop at night, desktop, a new visitor's default)

The site communicates **a board game set out on a plum-stained table at night**: warm, tactile, ready to play.
I notice **the gold Play button**: the brightest object on the page, raised off the table with a lip, so the next step is never in doubt. The wood shows its grain and knife marks without fighting the text.
The first 3 things my eye goes to are: **the "Grid Rivals" title**, **the little hero board (two red boxes, one indigo, coral and lavender lines on pearl pegs)**, **the gold Play button**. That is the intended order.
If I had to describe this in one word: **inviting**.

Page areas: brand and theme/level chips (top bar), the hero, the profile card, the actions. Each is nameable at a glance.

## AI slop check

- **Purple to indigo gradient backgrounds** (legacy blacklist): Neon at night's aurora runs from Deep Plum to Deep Indigo. These are the owner's four colours and the owner asked for the aurora back ("the background looks somewhat plain"). It reads as a room lit by brick, teal and indigo light rather than a template gradient. Owner's brief, not a finding.
- **Gradient buttons as the main call to action** (judgment tell): the owner asked for depth on every button. Each is one colour the palette owns (gold at night) with a light-and-shade sheen, not a two-hue gradient. Owner's brief.
- **Frosted glass as the default surface** (judgment tell): only Neon uses glass (the board by day and night, the cards at night), which is the spec's Neon identity ("dark glass panels") and the owner's request ("I don't see the glassy look"). Tabletop and Paper are solid materials.
- What keeps it from the generic: real materials (knife-marked wood, felt, paper with visible fibres), a per-theme type pairing, per-player line colours, and a gold that no player or surface shares.

## Detector (impeccable, DOM mode)

64 → 63 hits over 12 pages (target set: phone Home and game in six modes; it differs from the last baseline's six game pages, so no delta against it).

| Rule | Count | Verdict |
|---|---|---|
| low-contrast | 5 | Avatar initials (white on burnt orange or coral, Paper's sticker initials, Neon at night's white on teal now 3.5:1, up from 2.3:1 on main). Decorative (`aria-hidden`); the name carries identity. Deferred to the spec's step 3 (HUD and avatars), as in PR #11 |
| dark-glow | 21 → 20 | Neon's glow hierarchy (its CSS rules sit in every page's inlined stylesheet; spec and owner: "visible glow on the board, dots, lines and important buttons"). The one real hit, Tabletop at night's brown cast shadow on the plum table, is FINDING-002, fixed |
| cramped-padding | 6 | The turn pill's track (the spec's sliding pill, 4 px inset). Pre-existing |
| nested-cards | 2 | Neon's game: the turn pill inside its track. By the spec |
| repeating-stripes-gradient | 12 | The wood's plank seams and the stripe pattern on player 1's boxes (polish tell, by design) |
| codex-grid-background | 12 | Neon's faint board grid (the spec: "glass with a faint grid"; polish tell) |
| layout-transition | 6 | The XP bar's width transition on Home (pre-existing; polish) |

## Findings

### FINDING-001 (polish, color): the buttons' darker foot turned cream grey by day. Fixed, verified

- **What:** the sheen's foot was plain black, so the cream buttons of Tabletop and Paper shaded towards grey at the bottom.
- **Fix:** the foot takes each theme's own shadow hue: warm brown in Tabletop and Paper, indigo in Neon by day (`--sheen-foot`). Night unchanged.
- **Commit:** bd699d7 · **Files:** `src/app.css`
- **Before / after:** `screenshots/finding-001-before-palettes.png`, `screenshots/finding-001-after-palettes.png`, pair `screenshots/finding-001-pair.png`

### FINDING-002 (polish, color): Tabletop's board cast the day's brown shadow at night. Fixed, verified

- **What:** the board's shadow on the table was rgba(40,20,0,.6) in both modes, a brown on the plum-stained table (detector `dark-glow`, `#281400` on dark).
- **Fix:** the shadow colour is a token (`--cast`), plum-black at night. The detector's hit is gone.
- **Commit:** b013542 · **Files:** `src/app.css`
- **Before / after:** `screenshots/finding-002-before-palettes.png` (an empty crop, kept as taken), `screenshots/finding-002-pair.png` (the before shot shows the offline banner, so the board sits lower in it)

### From QA (not graded here): Neon at night's landing rings near 3:1

QA's ISSUE-001 (low): 3.26:1 median on the glass board (main 4.57). Deferred there, with options.

## Quick wins (none open)

Both quick wins (FINDING-001, FINDING-002) are done.

## Summary

| | |
|---|---|
| Findings | 2 (both polish) |
| Fixes | verified 2, best-effort 0, reverted 0 |
| Deferred | 0 from this review; avatar initials stay with the spec's step 3 |
| Design score | A → A |
| AI slop score | A → A |
| Detector | 64 → 63 |

**PR Summary:** Design review found 2 issues, fixed 2. Design score A → A, AI slop score A → A.
