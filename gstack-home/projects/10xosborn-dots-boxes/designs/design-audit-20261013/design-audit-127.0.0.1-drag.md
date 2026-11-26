# Design review: drawing lines by dragging from dot to dot (feat/drag-to-draw)

| Field | Value |
|---|---|
| Date | 2026-10-13 |
| Branch / commits | feat/drag-to-draw, reviewed at 6c6176f; fix 7ff79a2 |
| Target | Production build at http://127.0.0.1:4173/, Firebase blocked |
| Mode | Diff-aware: the game board only (no other screen changed) |
| Driver | gstack's headless Chromium through playwright-core: 390x844 phone with CDP touch, 1280x800 desktop with mouse |
| Detector | impeccable 0.1.3, DOM mode on the phone game page held mid-drag in all six modes; static scan of the rendered DOM; cross-origin CSS not resolved |
| Outside voices | Codex not installed (`outside_status: unavailable`); the subagent voice not started (agents run only when the owner asks) |
| Evidence | `screenshots/drag/drag-review-sheet.png` (before the fix), `screenshots/drag-after/drag-review-sheet.png` (after), `detect-045434-37115.json` |

**Design score A → A. AI slop score A → A.** One Polish finding, fixed and verified.

## What I looked at

The drag in every mode on a phone (held before the snap, then snapped), the hover preview on desktop, and the board around them.

- **Before the snap:** a thin line in the mover's line colour runs from the picked-up dot towards the finger, with a ring round the dot in the focus colour (brass in Tabletop at night).
- **Snapped:** the line it will draw, in the mover's line colour, inside the same 3 px ring as the keyboard cursor, so a selection looks the same whether it comes from the keyboard or a drag.
- **Hover preview:** a dotted line in the mover's line colour (Tabletop's engraved ink; coral, cyan or indigo in Neon and Paper), 3.3:1 to 8.7:1 against the board.
- Nothing new competes with the board: no glow on the drag line in Neon (a single straight line can't carry the filter), which reads as a line not yet lit.

## Findings

### FINDING-001 (Polish, Interaction States): on a phone the picked-up dot's ring hid under the finger — FIXED, verified

- **What:** the ring round the picked-up dot was twice the dot's radius (about 11 px on a phone's 4x4 board), so it sat under the fingertip; until the line snapped at 45% of the gap, nothing visible confirmed the dot was picked up (only the tick, with Sound on). `screenshots/drag/*-phone-dragging.png`.
- **Fix (7ff79a2, `src/components/Board.svelte`):** for a touch press the ring reaches 0.42 of a dot gap (about 31 px), wide enough to show round a fingertip; with a mouse or pen it stays twice the dot.
- **After:** `screenshots/drag-after/*-phone-dragging.png` in all six modes; the gesture test still passes 88/88.

## Detector

26 counted rows on the six mid-drag game pages: the decorative avatar initials (low-contrast), Neon's intended glow (dark-glow) and the sliding turn track (cramped-padding), the same rows the previous review explained. The drag elements add no row. Different page set from the previous baseline, so no delta.

## Suggestion for the owner (not a finding)

Nothing on screen says the board can be dragged; taps on lines keep working, so nobody is stuck, and a mouse shows a grab hand over the dots. A one-line hint on a player's first game ("Drag from dot to dot, or tap a line") would teach it on phones; it is new UI, so it waits for the owner.

## Summary

| Finding | Status | Commit |
|---|---|---|
| FINDING-001 | verified | 7ff79a2 |

**PR summary:** Design review found 1 issue, fixed 1. Design score A → A, AI slop score A → A.
