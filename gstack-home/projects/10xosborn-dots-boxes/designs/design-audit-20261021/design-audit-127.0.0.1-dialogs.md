# Design review: the spec's step 5, dialogs (design/11-dialogs)

| Field | Value |
|---|---|
| Date | 2026-10-21 |
| Branch | design/11-dialogs, uncommitted working tree on `634f519` (PR #28's fix, whose tree is #26's tested tip); the owner's rule is one commit per task, so fixes stay in the tree |
| Target | production builds served locally: branch `dist-step5`, base `dist-step4` (#26); Firebase blocked by hostname |
| Driver | gstack's bundled Playwright with its headless Chromium 151 (Aside is macOS-only); the gstack preamble hung after `SKILL_START_PROTO: 1` and ran in degraded mode (interactive, no telemetry) |
| Mode | diff-aware: the results dialog (win, loss, draw, level up, pass and play) and the themed confirm, in all six modes, on 320x568, 360x640, 390x844, 412x915, 640x360, 667x375, 844x390, 768x1024, 1280x800, 1440x900 |
| Reference | `docs/design/ui-themes-spec.md` (shared events 6 and 7, accessibility; each theme's results and confirm rows), mockups `Minimal-Results`, `Neon-Results`, `Paper-Results` (their dialog sections rendered on their own for a side-by-side), DESIGN.md (spec format) |
| Detector | impeccable 0.1.3, DOM mode (static scan of the rendered DOM; cross-origin CSS not resolved): results pages both builds have **409 → 414** (+3 Neon's mockup glow ring, +2 a static false positive); branch total 464 → 464 after the fixes |

## First impression (Cozy Paper by day, a 390x844 phone, a win)

The game ends and a scorecard slides up over the board page, torn off a pad: "Scorecard · 5×5 · Medium · vs Tactician", "You win!" in Kalam with a coral pencil swoosh, 15 and 10 with their tally gates under them, ruled chips, "Level 7" over a hatched bar, and the green "+172 XP" stamp lands last, a little crooked. The two score rows stay readable above it under a light scrim. The first three things my eye goes to are **the title**, **the stamp**, **Play again**: the intended order. One word: **earned**.

Tabletop and Neon keep today's dialog, now a real modal: the square sheet with a deeper shadow; Neon's glass with a thin ring and halo in its action colour (gold at night, indigo by day), as its mockup draws in coral.

## Checks (all on the final build)

- **Fit** (`results-shots.mjs`, a saved game one line from the end, the last line tapped): every theme, kind and size above shows the whole dialog with nothing scrolling and nothing off-screen, every label inside its button, the panel centred; Paper's card covers the page from under both score rows to its foot on phones (360x640 included), centred on the board from 640 px wide, two columns on sideways phones. On #26's build the dialog scrolled on every sideways phone (844x390: 358 px of a 460 px sheet showing).
- **Keyboard and screen readers** (`results-a11y.mjs`, `tab-wrap.mjs`): a modal dialog named by its title, Play again focused, Esc twice leaves the results open, Tab and Shift+Tab wrap inside the results, the confirm and the theme sheet (its unchosen options, tabindex -1, are skipped), the level bar is a labelled progressbar, the buttons work (Play again by Enter: a fresh board; Change settings: Setup; Leaderboard). Paper's card re-places itself when the phone turns sideways and back.
- **The themed confirm** (`confirm-check.mjs`, six modes): Quit, Restart and the logo in the game, Discard on Home, Reset my stats in Settings; the safe choice first and focused, Esc and a click outside keep things as they were, focus returns to the button that asked; the logo's line ("It stays saved: Home offers to continue it.") only once a move is made; a question open when the AI's last line ends the game goes away and the results take over; no browser dialogs, no page errors. A click on the card's own padding no longer closes it (found while building: `pad-click.mjs`).
- **Confetti** (`confetti-check.mjs`): drawn inside the dialog, the size of the screen at 1x and 2x, the burst from the middle (x≈195 of 390). On #26's build a 2x screen drew it 780x1688 with the burst at x=386, the right edge.

## Findings

### FINDING-001: Tabletop's and Neon's results a little off their mockups' sizes (polish, Typography) — fixed, verified

At 390 px the title was 31 px (a `8vw` middle value), against 36 px (Tabletop) and 34 px (Neon) in the mockups; the leaderboard notes 16 px against 14.5; Tabletop's Play again 50 px tall at 19 px over 44 px pills, against 56 px at 20 px over 46 px pills 10 px apart; Neon's score 40 px against 38; Paper's title 44.9 px against 46. Now the mockups' sizes from a 390 px phone, scaling down below it; the sideways layout keeps its own tighter sizes.

Screenshots: `sheet-vs-mockups.png` (mockup, then this build, per theme), `after/`.

### FINDING-002: the smallest phones (medium, Responsive) — fixed, verified

On a 320x568 phone (iPhone SE) Tabletop's and Neon's results scrolled by 30-87 px with a level up or a long leaderboard note, and at 320 px wide the two smaller buttons ("Change settings", "Leaderboard") were wider than the space, pushing the panel 5 px off centre and, on Paper, running "Change settings" from edge to edge of its button; Paper's "171 / 400 XP to level 8" left "8" alone on a second line beside the stamp. Now, below 600 px tall (held upright) the trophy steps aside (the title says it) and the spacing tightens, Neon's wide title drops to 24 px so "Tactician wins" keeps one line; up to 340 px wide the smaller buttons' labels and Paper's stamp go a size down. Every kind fits at 320x568 in every mode, labels inside their buttons, panels centred.

Screenshots: `sheet-320.png` (before), `shots-narrow/` and `shots-tiny/` in the scratchpad (after).

### Detector rows, confirmed by hand

- `dark-glow` +3 on White Neon's results: the ring and halo round the dialog (`0 0 0 1px` at 22%, `0 0 50px -14px` at 40% of the action colour), the Neon results mockup's own shadow. Spec-blessed.
- `clipped-overflow-container` +2 ("body clips a positioned child", Paper's level up at 390x844): the two stamps measured inside the card and the screen; a static-scan false positive.
- The confirm pages' rows belong to the game page behind the dialog (the turn pill, Neon's glows and stripes, text straight on the textured page, all known), plus one false positive: "#2E2B27 on #6B3A1E, 1.5:1" on Paper at night reads the sticky note's text against the card colour, because the scan doesn't resolve a background of a gradient over a colour; the note is graphite on the highlighter's yellow, 11.3:1.
- Unchanged on the 39 results pages both builds have: low-contrast 160, cramped-padding 40, repeating-stripes-gradient 39, layout-transition 36.

## Differences from the mockups (for the PR)

- Paper: the scorecard reaches the foot of the page on phones (mockup: it ends about 90 px above, where this game's Quit and Restart would show through the light scrim); Play again is the theme's indigo by day and gold at night (mockup: graphite); the card is the theme's panel colour (#FCF8EF, mockup #FFFDF7); pass and play (no XP) leaves blank paper above the buttons. From 640 px wide it is centred on the board (the spec: "centred on desktop").
- Tabletop: the theme's cream sheet with 4 px corners and burnt orange Play again (the owner's palette; mockup: a white square sheet, teal).
- Neon: the glow ring in the theme's action colour (gold at night, indigo by day; mockup: coral) and, at night, the theme's frosted glass (the owner's glass direction; the spec's "no blur" predates it).
- Sideways phones and the 320 px phone have no mockups: two columns, and a tighter dialog without the trophy.
- The confirm: Tabletop's white card with two pills, Neon's glass and Paper's sticky note follow the spec's words (no mockup draws a confirm); Paper's note is the highlighter's yellow with graphite tabs by day and at night.

## Scores

| Category | Before fixes | After |
|---|---|---|
| Visual hierarchy | A | A |
| Typography | A- (sizes off the mockups) | A |
| Spacing and layout | B+ (320 px: off centre, cramped labels) | A |
| Color and contrast | A | A |
| Interaction states | A | A |
| Responsive | B+ (320x568 scrolled) | A |
| Content | A | A |
| AI slop | A | A |
| Motion | A | A |
| Performance feel | A | A |

**Design score A- → A. AI slop A → A.** Design review found 2 issues, fixed 2. Detector 464 → 464 (results pages 409 → 414 against #26, all confirmed by hand).

## Outside voices

Not run: Codex is not installed on this PC (`outside_status: unavailable`), and the Claude design subagent is skipped under the owner's standing rule (no subagents unless asked). Single-model review.
