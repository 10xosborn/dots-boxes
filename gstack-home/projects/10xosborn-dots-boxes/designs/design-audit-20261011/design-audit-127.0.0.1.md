# Design audit: Grid Rivals online game screen, branch fix/r1b-online-presence

| Field | Value |
|---|---|
| Date | 2026-10-11 |
| URL | http://127.0.0.1:4175/ (emulator build of the branch, local Firebase emulators, demo project) |
| Commits | d1c172e, 54f5110 (audited) → 117c7df, 62fbec5, 2193c45 (fixes) |
| Mode | Diff-aware. Changed UI: the online game screen's status note under the board ("Reconnecting…", "X stepped away.", "X stepped away. Your move will be waiting.") and a "Leave game" offer after 2 minutes; the old "Waiting for your friend to reconnect" turn text is gone |
| Calibration | No DESIGN.md yet (PR 00). Code tokens in `app.css` `:root`. Track R rule: today's styles and components |
| Driver | gstack's own headless Chromium through gstack's bundled playwright-core, two contexts (host desktop 1280x800 mouse, guest phone 390x844 touch); connection loss simulated with the SDK's goOffline/goOnline (emulator builds only). Real fonts loaded |
| Detector | Not installed (impeccable offer still pending the owner's answer) |
| Outside voices | Unavailable: Codex CLI not installed; the Claude design subagent was not run. Single-model review |

## First impression

- The screen communicates **a game that keeps going**: when my friend drops, the board stays live and a quiet line under it tells me what is happening.
- I notice **the note is the calmest thing on the screen**: muted, one line, no colour alarm, no modal. That matches the brief's "calm status line".
- My eye goes to **the board**, then **the turn pill ("Your turn")**, then **the note under the board**. Right order: the game first, the connection news second.
- One word: **reassuring**.

## Inferred design system (rendered)

The note reuses the app's secondary text token: 16 px Manrope, weight 600, line height 24 px, colour `--muted` (dark #a9a6d0, light rgb(85,90,128)), 8 px above, aligned to the content column like the chips row and the error line. Empty, it measures 0 px tall, so it takes no space until there is something to say; it stays in the page as a polite `role="status"` region so screen readers hear changes. "Leave game" is the existing `.btn.small` (44 px min height).

## Page audit (390x844 and 1280x800, dark and light)

- **Contrast (pixel-sampled behind the text):** dark 7.01-7.44:1; light 4.83-5.17:1 (passes AA 4.5:1; the light theme sits near the floor because `--muted` is the app's existing light token, which PR 01 retunes).
- **Layout:** no sideways scroll; one line for the short notes at 358 px; the long note wraps to two balanced lines on a phone. The board never moves; showing the note pushes only the Leave button down (24-48 px), a deliberate state change.
- **Copy:** "Reconnecting…" uses a real ellipsis; the away notes are plain, calm statements; the promise "Your move will be waiting." appears only on your turn.

## Findings

### FINDING-001: "Player stepped away." when both players are called "Player" (medium, content). Fixed, verified

- **What:** players who never set a name are both "Player" (the default), so the note could read as being about yourself.
- **Fix:** `src/screens/Online.svelte` says "Your friend" when the two names match. Commit `117c7df`.
- **Verified:** "Your friend stepped away." / "Your friend stepped away. Your move will be waiting." in both themes on phone and desktop; the online flow still passes 20/20; no console errors. Before: `screenshots/finding-001-before.png`; after: `screenshots/after-net-away-*.png`.

### FINDING-002: After 2 minutes the offer doesn't say leaving is free (polish, UX and content). Fixed, verified

- **What:** "Leave game" appeared under the same note with nothing to say that leaving costs nothing, so a player could keep waiting out of worry about a forfeit.
- **Fix:** after 2 minutes the note reads "Your friend has been away for 2 minutes. Leaving won't count as a loss." Commit `62fbec5`.
- **Verified:** the 2-minute flow passes 4/4 with the new wording; the note and offer clear when the friend returns. Before: `screenshots/finding-002-before.png`; after: `screenshots/after-L-host-2min.png`.
- **Kept on purpose:** "Leave game" duplicates the always-present Leave button, but it sits right under the note, and on a 1280x800 screen the bottom Leave button is below the fold.

### FINDING-003: A single word alone on the note's second line (polish, typography). Fixed, verified

- **What:** at 390 px the long note wrapped with "waiting." alone on the second line.
- **Fix:** `.net` gets `text-wrap: pretty` (ignored where unsupported). Commit `2193c45`.
- **Verified:** "Your friend stepped away. Your move will / be waiting." in both themes; no console errors. After: `screenshots/after3-net-away-yourmove-phone-light.png`.

### Noted, no change

- The note aligns with the content column (like the chips and the error line) rather than the centred board on desktop: consistent with today's layout; PR 04 redesigns the game screen.
- Pre-existing, not from this branch: the turn pill says "Player's turn" when both players are "Player" (deferred to PR 04); the purple-gradient, glass-card look (PR 01).

## Interaction flows

1. **My friend's phone drops:** nothing happens for a few seconds (a blip would never show), then "Your friend stepped away." appears under the board in quiet text. On my turn it adds "Your move will be waiting." and I can still play. When they're back, it disappears by itself.
2. **My own connection drops:** "Reconnecting…" after about 2 s; I can still draw a line, and it arrives once when I'm back.
3. **My friend is gone for 2 minutes:** "Your friend has been away for 2 minutes. Leaving won't count as a loss." with "Leave game" right under it.

```
Goodwill: 85 ██████████████████████████░░░░
  Start                                          70
  A drop doesn't freeze the game                 70 → 80  (+10 top task stays possible)
  Calm, specific status instead of a block       80 → 85  (+5 upfront about what is happening)
  Ambiguous "Player stepped away" (before fix)   85 → 80  (-5; removed by FINDING-001)
  FINAL (after fixes): 85/100, healthy
```

## Scores

| Category | Before fixes | After fixes |
|---|---|---|
| Visual hierarchy | A | A |
| Typography | A | A |
| Spacing and layout | A | A |
| Colour and contrast | A (light near the AA floor, existing token) | A |
| Interaction states | A | A |
| Responsive | A | A |
| Content | B+ | A |
| AI slop | D (pre-existing look) | D (pre-existing look) |
| Motion | A (nothing added) | A |
| Performance feel | A (notes appear without delay) | A |

**Design score: A− → A. AI slop score: D → D** (the app still wears the purple-gradient uniform; this branch added nothing to it).

Detector: not installed. Previous design baseline (R1a, Home) covers a different page: no regression comparison.

## Summary

- Findings: 3 from this branch (1 medium, 2 polish), all fixed and verified; 2 noted with no change; 2 pre-existing items deferred to PR 01 and PR 04.
- Fixes: verified 3, best-effort 0, reverted 0.

**PR summary:** "Design review found 3 issues in the online notes, fixed 3 ("Your friend" for same-name players, leaving is free after 2 minutes, no lone last word). Design score A− → A, AI slop D → D (pre-existing look, scheduled for PR 01)."
