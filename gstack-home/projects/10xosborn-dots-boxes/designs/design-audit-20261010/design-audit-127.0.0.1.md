# Design audit: Grid Rivals, branch fix/r1a-resume-local-games

| Field | Value |
|---|---|
| Date | 2026-10-10 |
| URL | http://127.0.0.1:4173/ (vite preview of the branch build) |
| Commits | 8b5d504 (audited) → e872a0f, 993eb64 (fixes) |
| Mode | Diff-aware. Changed UI: the "Continue your game" card on Home, and the "Resumed games don't set fastest-win times." line in the results dialog |
| Calibration | No DESIGN.md yet (PR 00). Calibrated against the code tokens in `app.css` `:root`. Track R rule: small UI uses today's styles and components |
| Driver | gstack's own headless Chromium through gstack's bundled playwright-core (Aside is macOS-only). Firebase blocked, reduced motion on, animations off |
| Detector | Not installed (impeccable install offer pending; not run) |
| Outside voices | Unavailable: Codex CLI not installed; the Claude design subagent was not run. Single-model review |

## First impression

- The site communicates **a game that remembers you**: the first thing under the top bar is "Continue your game" with the board, the rival and the score.
- I notice **the card reads as part of the app, not a bolt-on**. It is the same glass panel as the profile card below (18 px padding, 22 px radius, same border and shadow).
- The first 3 things my eye goes to are: **the gradient Continue button**, **the big "Grid Rivals" title**, and **the gradient Play button**. Before the fix, the third one competed with the first (FINDING-001).
- One word: **welcoming**.

Page areas on Home with the card: top bar (brand, level chip), your waiting game (card), brand hero (demo board, title, tagline), your profile and progress, the menu. Each is nameable in 2 seconds.

Prior learning applied: self-check-inherits-its-frames-blindspot (confidence 9/10, 2026-09-19). I wrote this card, so the audit leans on raw rendered evidence (pixel-sampled contrast, measured positions, computed styles) rather than my reading of my own source. An independent outside voice was not available.

## Inferred design system (rendered)

- **Fonts:** Unbounded (display, headings) and Manrope (UI). Two families. (`Times New Roman` appears only on non-rendered `head` elements.)
- **Colours on Home:** 9 unique. Tokens: `--bg1 #0c0a24`, `--bg2 #22114a`, `--text #f2f0ff`, `--muted #a9a6d0`, `--accent #b7a4ff`, `--p1 #ff5c7a`, `--p2 #3ed6ea`, panel `#ffffff0f` / border `#ffffff1f`, `--gold #ffd166`.
- **Radius hierarchy:** 22 px panels, 14 px buttons, 10 px small controls.
- **Headings on Home:** h2 "Continue your game" 17.6 px Unbounded 700; h1 "Grid Rivals" 57.6 px Unbounded 800.
- **Spacing:** 18 px panel padding, 10 px gaps in rows and the menu grid, 14 px above the menu.

## Page audit

### Home with a waiting game (360x640, 390x844, 768x1024, 1280x800; dark and light)

- **Trunk test: PASS.** Site ID (brand top-left and the hero title), sections (menu), options at this level and where you are are all clear; there is no search in a game.
- **Layout:** no sideways scroll at any size. The card is 358 px wide on a 390 px phone. At 360x640 the card pushes Play below the fold, which is right: Continue is the action for this state.
- **Contrast (pixel-sampled behind the text):** card title 13.99:1 dark, 16.05:1 light; card text 6.76:1 dark, 6.34:1 light. All pass AA.
- **Targets:** Continue 299x50 px and Discard 301x50 px on desktop; 154x50 px each on a 390 px phone.
- **Keyboard:** Continue is the first control after the top bar (Tab order: brand, level chip, Continue, Discard, Play...). The focus ring is 3 px solid accent with a 3 px offset, visible in both themes.
- **Pointer:** primary buttons shift their gradient on hover (background-position 0% → 100%); pressing scales to 0.97. Discard asks "Discard this game? It won't count."; cancelling keeps the card.
- **Content:** "4×4 against Maestro: 22 of 40 lines drawn, score 3–1." states board, rival, progress and score in one line, with an en dash and a real × sign. The app uses straight apostrophes everywhere (0 curly in `src/`), so the results line is consistent.

### Results dialog after a resumed win (390x844 and 1280x800, dark and light)

The line "Resumed games don't set fastest-win times." is a `p.res-note`, the same element and style the dialog uses for its other notes (16 px, text colour), placed between the XP block and the actions. It fits the dialog at both sizes.

## Findings

### FINDING-001: Two gradient primary buttons compete while a game waits (medium, visual hierarchy). Fixed, verified

- **What:** with a saved game, Home showed two equally loud gradient buttons: Continue (half width, 50 px) in the card and Play (full width, 60 px) lower down. The bigger one was the action a returning player is less likely to want.
- **Fix:** `src/screens/Home.svelte`. While a game is waiting, Play uses the plain button style and keeps its place, label and full width (`class:primary={!saved}`, `grid-column:1/-1`). After Continue or Discard it is the primary button again. Commit `e872a0f`.
- **Verified:** Continue is the only gradient button at 360x640, 390x844 and 1280x800 in both themes; Play stays full width (358 px on a phone, same as "Play a friend online"); after Discard, Play is primary again (60 px, gradient, top 476 px, identical to Home without a saved game); no console errors. The R1a browser tests still pass (37/37).
- **Screenshots:** `screenshots/finding-001-before.jpg` → `screenshots/finding-001-after-390x844-dark.jpg`, `finding-001-after-1280x800-light.jpg`, `finding-001-after-discard-390x844-dark.jpg`.

### FINDING-003: The resumed-game note leaves one word alone on a phone (polish, typography). Fixed, verified

- **What:** with the real fonts at 390 px, "Resumed games don't set fastest-win times." wrapped with "times." alone on the second line.
- **Fix:** `src/app.css`, `.res-note` gets `text-wrap: balance` (ignored by browsers without it). Commit `993eb64`.
- **Verified:** "Resumed games don't / set fastest-win times." at 390x844 in both themes; the dialog still fits at 390x844 and 1280x800; no console errors.

**Real-font re-check (2026-10-11):** the first screenshots were taken with Google Fonts blocked by the Firebase block, so they used the system fallback font. Re-taken with Unbounded and Manrope confirmed loaded (`document.fonts.check`): the card is 358x174 px on a 390 px phone (text on two lines) and 648x150 px at 1280x800 (one line), with no sideways scroll; FINDING-001's verdict is unchanged. PR screenshots: `screenshots/pr-home-{card,nocard}-{390x844,1280x800}-{dark,light}.jpg`, `results-resumed-*.jpg`.

### FINDING-002: The card's h2 comes before the page's h1 (polish, structure). Kept

Screen-reader heading navigation meets "Continue your game" (h2) before "Grid Rivals" (h1). The card is visually and logically first, and moving it later in the DOM would break reading and focus order (WCAG 1.3.2, 2.4.3). No axe rule is violated. No change.

### Pre-existing, not from this branch (deferred)

- **AI-slop look (high, deferred to PR 01):** purple gradient background, gradient buttons with coloured glow, glass panels. The card reuses these by the Track R rule; it adds no new pattern.
- **Top bar brand link is 30 px tall (polish, deferred to PR 02):** below the 44 px target size.
- **Continue and Discard differ by 2 px in width (polish):** the primary button has no border while the plain one has a 1 px border. Invisible at normal viewing.
- **White band at the bottom of full-page screenshots:** a Chromium capture artifact of the fixed body background, already ruled out as a defect in the /qa run (viewport screenshots are correct).

## Interaction flows

1. **Home → Continue → game:** I tap Continue and the board is there in 45-73 ms with "Game resumed. Score 2 to 1. Player to move." announced. No spinner, no hunting.
2. **Home → Discard → cancel:** the browser confirm appears with a plain sentence; cancelling leaves the card. (PR 02 replaces `window.confirm` with an accessible ConfirmDialog for every confirm in the app.)
3. **Resumed game → win → results:** the dialog celebrates the win as usual and adds one calm line about fastest times. No scolding.

```
Goodwill: 85 ██████████████████████████░░░░
  Start                                   70
  Home: waiting game is the first thing   70 → 80  (+10 top task obvious)
  Continue: one tap, straight back in     80 → 85  (+5 saves steps)
  Two gradient buttons (before fix)       85 → 80  (-5 ambiguous choice; removed by FINDING-001)
  FINAL (after fix): 85/100, healthy
```

## Cross-page consistency

The card uses `.panel`, `.btn.primary` and `.btn` exactly like the profile card and menu; the results note uses the dialog's existing `.res-note`. Tone matches the rest of the app's copy.

## Scores

| Category | Before fix | After fix |
|---|---|---|
| Visual hierarchy | B+ | A |
| Typography | A | A |
| Spacing and layout | A | A |
| Colour and contrast | A | A |
| Interaction states | A | A |
| Responsive | A | A |
| Content | A | A |
| AI slop | D (pre-existing look) | D (pre-existing look) |
| Motion | A (nothing added) | A |
| Performance feel | B (pre-existing ~2.5 s to Home, Firebase start-up) | B |

**Design score: B+ → A−. AI slop score: D → D** ("the app still wears the purple-gradient uniform; this branch added nothing to it, and PR 01 takes it off").

Detector: not installed. No previous design baseline (first design audit of this project).

## Quick wins

- Applied: FINDING-001.
- For the redesign, already planned in the brief: PR 01 removes the gradient background, gradient buttons and glass panels; PR 02 adds the ConfirmDialog and the 44 px brand target.

## Summary

- Findings: 3 from this branch (1 medium and 1 polish fixed and verified, 1 polish kept by design), plus 4 pre-existing items deferred to PR 01 and PR 02 or ruled out.
- Fixes: verified 2, best-effort 0, reverted 0.
- Design score B+ → A−; AI slop D → D; detector not run.

**PR summary:** "Design review found 3 issues in this change, fixed 2 (two competing primary buttons on Home; a one-word line in the results note) and kept 1 by design. Design score B+ → A−, AI slop score D → D (pre-existing look, scheduled for PR 01)."
