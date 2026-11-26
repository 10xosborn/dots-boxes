# Design review: the elastic drag and the landing rings (feat/springy-drag)

| Field | Value |
|---|---|
| Date | 2026-10-13 |
| Branch / commits | feat/springy-drag, reviewed at 3be28e4 (docs 7a8a446); fixes a4fc0f4, 973177e |
| Target | Production build at http://127.0.0.1:4173/, Firebase blocked |
| Mode | Diff-aware: the game board during a drag (no other screen changed); classifier OPERATE (app UI) |
| Driver | gstack's headless Chromium through playwright-core: 390x844 phone with CDP touch, 1280x800 desktop with a mouse, Animations on (Aside is macOS-only) |
| Detector | impeccable 0.1.3, DOM mode on the phone game page held snapped in all six modes; static scan of the rendered DOM; cross-origin CSS not resolved |
| Outside voices | Codex not installed (`outside_status: unavailable`); the subagent voice not started (agents run only when the owner asks) |
| Evidence | `screenshots/spring/spring-review-sheet.png` (before), `screenshots/spring-after/spring-review-sheet.png` (after), one file per mode and state beside each; `detect-085312-43134.json`, `detect-085312-43134-after.json` |

**Design score A → A. AI slop score A → A.** Two findings, both fixed and verified.

## What I looked at

The owner asked for a drag that feels "like a rubber band" and for "broken rings rotating around the possible dots". In every mode, phone and desktop:

- **Swinging:** a thin band in the mover's line colour from the picked-up dot to the finger, bowing behind a sideways swing and settling straight. It reads as elastic, not as a ruler.
- **Snapping:** the band jumps to the line's full width, overshoots the target dot slightly and settles inside the keyboard cursor's ring. The bounce is short (about a quarter of a second) and lands on a clear final state.
- **Letting go with no line:** the band snaps home in about 150 ms.
- **Landing rings:** dashed rings in the mover's line colour turn slowly (one turn in 2.4 s) round each dot the drag can land on, skipping lines already drawn. They read as "you can go here" without competing with the band. With Animations off nothing moves (verified by QA).
- Nothing new is ornamental: every motion answers the finger. No glow, gradient or decoration was added.

## Findings

### FINDING-002 (Medium, Color & Contrast): the landing rings were too thin to hold up where the line colour sits near 3:1. Fixed, verified

- **What:** the rings were 2.2 px wide on a phone's 4x4 board. Measured from pixels against the board under each ring (`ring-contrast.mjs`, median and 10th percentile):

  | Mode | Median | 10th percentile |
  |---|---|---|
  | Tabletop by day | 9.66:1 | 7.59:1 |
  | Tabletop at night | 3.06:1 | 2.37:1 |
  | Neon at night | 4.60:1 | 3.90:1 |
  | Neon by day | 3.37:1 | 2.74:1 |
  | Paper by day | 3.11:1 | 3.03:1 |
  | Paper at night | 2.98:1 | 2.89:1 |

  Thin dashes at those ratios were faint, worst in Tabletop at night on the lit felt. `screenshots/spring/table-dark-phone-3-snapped.png`.
- **Fix (a4fc0f4, `src/components/Board.svelte`):** the stroke is now about half a line wide (`max(3.5, 0.045 of a gap)`), 3.3 px on that board.
- **After:** `screenshots/spring-after/*` in all six modes, visibly clearer. The ratios are unchanged: they are the players' line colours, the same as the drawn lines.
- **Deferred:** the colours themselves go to the next PR, which applies the owner's new dark palettes and gives each player their own line colour in every theme. Re-measure the rings there.

### FINDING-001 (Polish, Visual hierarchy): the snapped dot carried two outlines in two colours. Fixed, verified

- **What:** once snapped, the target dot had its landing ring, made whole, and also the end of the line's ring (the keyboard cursor's ring) round it: two outlines in two colours on one dot. Neon at night showed it most, a coral circle round the cyan ring's end. `screenshots/spring/neon-dark-phone-3-snapped.png`.
- **Fix (973177e, `Board.svelte`, `app.css`, `DESIGN.md`):** the snapped dot gives its ring up to the line's ring. The other dots keep their turning rings, and unsnapping brings the ring back.
- **After:** `screenshots/spring-after/*-phone-3-snapped.png`: one outline. The spring suite was updated to the new design and passes 75/75.

## Detector

38 rows on the six snapped game pages: 26 counted (7 low-contrast on the decorative avatar initials and Paper's large score digits, 13 dark-glow on Neon's intended glow, 6 cramped-padding on the sliding turn track) plus 12 polish rows. Row for row this is identical to the earlier drag review's scan of the same six pages; the band and rings add none. **Detector: 38 → 38** after the fixes.

## Litmus (app UI)

| Check | Answer |
|---|---|
| Does the motion improve hierarchy or atmosphere? | Yes: the rings answer "where can I go", the band answers "what am I holding", and the bounce confirms the snap |
| Is any element decoration only? | No |
| Would it feel premium with the decorative shadows removed? | Yes: no shadow or glow was added |

## Summary

| Finding | Impact | Status | Commit |
|---|---|---|---|
| FINDING-002 | Medium | verified (colours deferred to the palette PR) | a4fc0f4 |
| FINDING-001 | Polish | verified | 973177e |

**PR summary:** Design review found 2 issues, fixed 2. Design score A → A, AI slop score A → A.
