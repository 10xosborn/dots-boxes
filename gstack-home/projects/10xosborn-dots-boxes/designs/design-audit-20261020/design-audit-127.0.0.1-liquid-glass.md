# Design review: design/08-liquid-glass (Neon's clear liquid glass; lines a fifth thinner)

- Branch `design/08-liquid-glass`, commit `c421b05`, stacked on `fix/owner-2026-10-20` (`da25977`, PR #22). Production builds `dist-glass-A` (branch) and `dist-marks-on-22` (base), served locally, Firebase blocked.
- Driver: gstack's headless Chromium through its bundled Playwright (no Aside on Windows). Scope (diff-aware): the game board in all six modes (thinner lines), Neon's board in both modes (glass) and the Home demo.
- How the glass was chosen: /design-shotgun built three variants in the running game (A clear crystal, B liquid frost, C liquid slab), measured each for contrast and GPU cost, and the owner picked A (`designs/neon-liquid-glass-20261020/approved.json`). The built CSS matches the prototype pixel for pixel (329 differing pixels of 1.3 million on one screen, anti-aliasing).
- Screenshots: `screenshots/glass/pairs-desk.png` (each mode before and after), the variant boards in `designs/neon-liquid-glass-20261020/`.

## First impression

The Neon board finally reads as glass: you see the room's wine and cyan light through it at night, and its edge catches the light, with a thin cyan fringe where light enters and magenta-red where it leaves. By day it is a bright pane with a white rim and faint blue and coral fringes. Everywhere else the lines are slimmer and the boards look less heavy, without losing any line. One word: lighter.

## Checks

| Check | Result |
| --- | --- |
| Lines at 3:1 (line-contrast2, all modes) | 6/6: Paper by day coral 3.28, White Neon teal worst 3.46, Dark Neon magenta-red worst 3.94 |
| Dots and initials (board-contrast) | White Neon coral dots 3.07:1 (were 3.02 on the base); every other dot and initial far above |
| Keyboard cursor ring (on its outline) | 3.35-6.47:1 in all six modes |
| Last-move ring centre on the glass | the centre's solid colour matches the rendered glass closely in both modes; no visible disc |
| Thin lines at 1:1 | Tabletop's engraving and Paper's pencil wobble stay legible (zoom checked) |
| Detector (impeccable 0.1.3, rendered DOM, 12 pages per build; cross-origin CSS not resolved) | base 66 → branch 66, the same 5 rules on every page (dark-glow 24, low-contrast 18, repeating-stripes-gradient 12, cramped-padding 6, layout-transition 6), all present before this branch |

## Findings

None. (Probe fixes, not product changes: `spring-test.mjs` and `marks-test2.mjs` expected the old line widths; `materials-probe.mjs` sampled beside the keyboard ring since the cursor became the thin preview, and now samples the ring's outline. The corrected reading also corrects PR #22's reports: 3.29-6.31:1, not 5.07-10.7:1.)

## Scores
- Design score: A → A. AI slop score: A → A (Neon's near-black, glowing look is the owner's own theme, blessed in DESIGN.md).

## Spec differences (for the PR)
- The spec describes Dark Neon's board as an opaque "Obsidian Glass" with a specular streak and White Neon's as "Frosted Opal Glass"; both are now the owner's clear liquid glass (spec and DESIGN.md updated). Line widths: the spec's 0.085 of a gap is now 0.068 (owner).

## Outside voices
Not run: Codex isn't installed; no subagent started (agents only when the owner asks).

> Design review found 0 issues. Design score A → A, AI slop score A → A. Detector 66 → 66.
