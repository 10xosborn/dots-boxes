# Design audit: rejoining online games, branch fix/r1b-online-resume

| Field | Value |
|---|---|
| Date | 2026-10-11 |
| URL | http://127.0.0.1:4175/ (emulator build, local Firebase emulators, demo project) |
| Commits | 4125292 (audited) → c23909c (fix) |
| Mode | Diff-aware. Changed UI: the "Getting back into your game…" panel shown while a saved room is rejoined at start-up; the muted "That game has ended." line in the online lobby |
| Calibration | No DESIGN.md yet; code tokens in `app.css`; Track R rule: today's styles and components |
| Driver | gstack's own headless Chromium through gstack's bundled playwright-core; phone 390x844 touch and desktop 1280x800, dark and light; the network slowed by 1.5 s per request to keep the rejoin panel on screen |
| Detector | Not installed (offer still pending the owner's answer) |
| Outside voices | Unavailable (no Codex CLI; Claude subagent not run). Single-model review |

## First impression

- **Rejoining:** after a reload the app says, in one calm panel at the top, "Getting back into your game…", then the board is back. No lobby flashes past, nothing to read twice.
- **Ended:** "That game has ended." sits under the screen title in quiet text, and the lobby below is the obvious next step. It is news, not an error, so it is not red.
- One word: **honest**.

## Page audit

| State | Phone dark | Phone light | Desktop dark | Desktop light |
|---|---|---|---|---|
| "Getting back into your game…" (16 px, muted, centred in a panel) | 6.78:1 | 6.11:1 | 6.78:1 | 6.34:1 |
| "That game has ended." (16 px, 600, muted, under the title) | 7.78:1 | 4.91:1 | 7.78:1 | 5.52:1 |

Contrast is measured from the rendered pixels behind the text; all pass AA. No sideways scroll at either size; the info line takes no space when empty; no console errors.

## Findings

### FINDING-001: Without a connection, "Getting back into your game…" never ends (medium, interaction states). Fixed, verified

- **What:** with the database unreachable at start-up (a phone with no signal), the panel was still up after 31 s: Firebase's one-time read waits for the server instead of failing, so the only way out was the logo.
- **Fix:** `src/screens/Online.svelte` gives the rejoin 8 s. Then the lobby says "Couldn't reach your game. Check your connection, then try again." with a **Try again** button; the room stays saved, so a later start tries again too. Commit `c23909c`.
- **Verified:** with the database cut, the panel ends after 8.4-8.5 s with the message and the button, and the save is kept; once the connection is back, Try again returns to the game (10/10, both themes, no page errors). The normal rejoin still takes 0.32 s and the full rejoin suite passes 22/22. Screenshots: `screenshots/resume-offline-phone-{dark,light}.png`.
- **Regression test:** a browser script (`resume-offline.mjs`, kept with the session's throwaway scripts); the repository has no browser test framework yet.

## Interaction flows

1. **Reload mid-game:** "Getting back into your game…" for a fraction of a second, then the same board and seat (0.3-0.4 s here).
2. **Room gone:** the lobby with "That game has ended."; nothing else to dismiss.
3. **No signal:** 8 s of "Getting back…", then a plain explanation and Try again; the game is not forgotten.

```
Goodwill: 85 ██████████████████████████░░░░
  Start                                         70
  Reload puts me straight back in my game       70 → 80  (+10 saves steps)
  Ended games say so plainly                    80 → 85  (+5 upfront)
  Endless "Getting back…" offline (before fix)  85 → 75  (-10; removed by FINDING-001)
  FINAL (after fix): 85/100, healthy
```

## Scores

| Category | Before fix | After fix |
|---|---|---|
| Visual hierarchy | A | A |
| Typography | A | A |
| Spacing and layout | A | A |
| Colour and contrast | A | A |
| Interaction states | B+ (endless loading state offline) | A |
| Responsive | A | A |
| Content | A | A |
| AI slop | D (pre-existing look) | D (pre-existing look) |
| Motion | A | A |
| Performance feel | A | A |

**Design score: A− → A. AI slop: D → D** (pre-existing look, PR 01).

## Summary

- Findings: 1 (medium), fixed and verified. Fixes: verified 1, best-effort 0, reverted 0.

**PR summary:** "Design review found 1 issue (the rejoin panel never ended without a connection), fixed 1: 8 s limit, a plain message and Try again. Design score A− → A, AI slop D → D (pre-existing look)."
