# Design review: the spec's step 2 board marks on the restyled modes (design/07-board-marks)

| Field | Value |
|---|---|
| Date | 2026-10-20 |
| Target | local production build of `7e64ca3` (served on 127.0.0.1:4173), Firebase blocked by hostname |
| Scope | Diff-aware: the game board (Board.svelte) and the Home hero board (HeroBoard.svelte) in all six modes; phone 390x844 (touch), desktop 1280x800, 12x12 at 1920x1080; Animations off for stable frames |
| Driver | gstack's own headless Chromium through its Playwright (Aside is macOS-only); captures by `dr-marks.mjs`, `dr-pip*.mjs` (scratchpad) |
| Spec | docs/design/ui-themes-spec.md (step 2: "Darker line plus pip (Minimalist), ring (Neon), hand-drawn ellipse (Cozy Paper)"; Tabletop's person and bot marks; Paper's pencil) and docs/design/mockups/ |

## First impression

The boards read as the same three materials as before, now with a story of the last move. My eye goes to the captured
boxes first (Tabletop's person and bot tiles are the most characterful mark on any board), then to Neon's hollow ring and
Paper's pencil circle, which say "this happened last" at a glance. On Tabletop I look for the last move and can't find it:
the pip in the middle of the last line is the dots' own colour and nearly their size, so it reads as one more board dot.
One word: **close**.

## Findings

### FINDING-001: Tabletop's last-move pip reads as a board dot (HIGH, color and hierarchy)

- **What:** the pip is a disc in the dot colour (ash at night, near-black by day), radius 0.085 of a gap against the dots'
  0.075, so on Tabletop the last move is not identifiable, worst on 6x6 and bigger boards. The mockup's pip is a smaller
  disc set apart by colour (blue #2F86C6, edged in white or the board colour); the build took the dot colour when the
  owner's palettes replaced the mockup's (2026-10-14, flagged then as easy to change).
- **Evidence:** `screenshots/baselinesheet-close.png` (rows 1-2), `baselinesheet-boards.png`, `baselinesheet-desk.png`;
  candidates in `screenshots/pip/sheet-pip.png` (a ring in the dot colour, a disc in the mover's colour, a ring in the
  mover's colour: none stands out on a full 7x7) and `screenshots/pip2/sheet-pip2.png` (the mockup's blue stands out at
  every size, day and night).
- **Measured:** the mockup's blue against the felt edge it sits in is 2.76:1 on the day's mint (#C4DFC9) and 2.39:1 on the
  night's Sienna felt (#6A3A1C), under the 3:1 board marks are held to.
- **Fix:** the mockup's blue pip, one shade darker by day (#2B7BB9, 3.18:1 on the mint) and lighter at night (#4D9BD9,
  3.14:1 on the Sienna), edged in the felt colour, through a new Tabletop token `--last-dot`.

## Detector

Static scan of the rendered DOM (12 pages: Home and a game per mode); cross-origin CSS not resolved. 64 rows in 5 rules,
none on the board marks (the detector does not read SVG strokes):
- [low-contrast] 18: text over the plain colours under the textures (#B77D5F, #A75E2F) and Paper by day's desk, which
  never show on their own (blend modes); measured from pixels in the 2026-10-19 review, every visible text line passes.
- [dark-glow] 20: Neon's glow (the spec's identity), and the theme sheet's Neon preview present in every mode.
- [cramped-padding] 6 (the turn pill), [nested-cards] 2 (Neon's game panel), [layout-transition] 6 (the XP bar): unchanged
  structures, outside this branch.
The previous review scanned a different page set (154 rows), so there is no delta.

## Fix

| Finding | Status | Commit | Files | Before / after |
|---|---|---|---|---|
| FINDING-001 | verified | `3e7ea88` (folded into the branch's single commit before the PR) | src/app.css (`--last-dot` in Tabletop's day and night blocks; `.last-pip`), src/components/Board.svelte (comment), DESIGN.md (tokens, decisions) | `screenshots/baselinesheet-close.png` → `screenshots/after/sheet-close.png`; `baselinesheet-boards.png` → `after/sheet-boards.png` |

After the fix the pip is unmistakable in every Tabletop close-up (pass-and-play, 4x4, 6x6, 7x7, 12x12, day and night) and
findable on the whole 7x7 board. The other four modes' marks are unchanged: the fix only touches `.last-pip` and Tabletop's
two token blocks, and their contact sheets match by eye (not pixel-diffed). No page errors in either capture.

## Scores

| | Baseline | Final |
|---|---|---|
| Design score | A- (Color and contrast B: FINDING-001) | A |
| AI slop score | A (no slop pattern in the marks; the person and bot are drawn for the board, not stock icons) | A |
| Detector | 64 (12 pages, all outside the marks) | 64 (same pages) |

Outside voices: Codex not installed, so in-host review only (`outside_status: unavailable`).

## Summary

1 finding (high), fixed and verified; 0 deferred. Calls left for the owner (easy to change, listed in the PR): Tabletop's
pip in the mockup's blue (tinted per mode) rather than a colour from their palettes; Paper's pencil lines and hatching
by day only, since the 2026-10-15 brief made Paper at night die-cut cardstock strips.

**PR summary:** "Design review found 1 issue, fixed 1. Design score A- → A, AI slop score A → A."
