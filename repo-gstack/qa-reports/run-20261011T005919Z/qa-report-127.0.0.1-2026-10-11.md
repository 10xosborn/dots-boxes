# QA Report: Grid Rivals (Dots & Boxes), online presence

| Field | Value |
|-------|-------|
| **Date** | 2026-10-11 |
| **Branch / commits** | fix/r1b-online-presence: d1c172e (emulator mode), 54f5110 (presence); base main 39e5edc |
| **PR** | not opened yet |
| **Tier / mode** | Standard; browser Full (diff-aware), functional Full |
| **Surfaces** | Browser: online play between two browsers (emulator build at http://127.0.0.1:4175/ against local Firebase emulators, demo project `demo-dnb`) and local games (production build at http://127.0.0.1:4173/, Firebase blocked). Functional: `npm run test:rules` |
| **Isolation** | Local emulators only (Auth 9099, Realtime Database 9000, Firestore 8080). Every browser context aborts live Firebase hosts and the run checks that none was attempted: 0 attempts. Emulator database read and rules switched through its local admin REST API |
| **Driver** | gstack's own headless Chromium through gstack's bundled playwright-core (Aside is macOS-only; two isolated contexts, touch, request blocking and connection control need Playwright). Host: desktop 1280x800, mouse. Guest: phone 390x844, touch |
| **Budget / guarded command time** | Browser 900 s (gstack-qa-deadline): 223.5 s over 5 probes, none timed out. Functional: 1 capture, 14.3 s |
| **Charters** | [charters.md](charters.md): C1-C6 browser, F1 functional |
| **Framework** | Svelte 5 SPA (Vite), Firebase 12 |

## Browser

### Health Score: 100/100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors in every probe, both players, both rule sets) |
| Links | not scored (single-page app, no links) |
| Visual | 100 (status line takes no space until needed; screenshots below) |
| Functional | 100 (79 of 79 checks) |
| UX | 100 (no alarm for blips: nothing in the first seconds, a calm note after ~10 s, an exit offer after 2 min) |
| Performance | not scored (separate /benchmark) |
| Content | 100 ("Player stepped away. Your move will be waiting.", "Reconnecting…") |
| Accessibility | 100 provisional (notes in a polite `role="status"` region; "Leave game" is a real button; no screen reader used) |

Provisional: 6 of 8 categories tested.

### Evidence verdict: inconclusive (open: no evidence rows)

gstack's evidence tool reports **inconclusive** for the browser surface, final for that report root: a browser-only surface produces no functional evidence rows. The results are in the probe outputs and checkpoints:

[checkpoint 002](browser/exploration-002.json) · [checkpoint 003](browser/exploration-003.json) · [checkpoint 004](browser/exploration-004.json) · [checkpoint 005](browser/exploration-005.json)

### Contracts

| # | Contract | Probe | Result |
|---|---|---|---|
| C6 (orientation) | Home on the production build at desktop and phone, the Continue card, no console errors | 001 ([output](browser/probe-001.txt)) | 6/6 pass |
| C1 | New rules: both players appear in `presence/{code}/{uid}` (one child each) and in the old `rooms/{code}/online` flag; a move reaches the other player | 002 ([output](browser/probe-002.txt)) | pass |
| C2 | The guest drops the connection on their turn: "Reconnecting…" about 2 s later, the guest can still draw; the host sees nothing at first, then "Player stepped away." (no promise about the host's move); on reconnect the offline move arrives once, presence returns, both notes clear; database, host and guest agree ([14,19]) | 002 | pass |
| C3 | On the host's turn: "Player stepped away. Your move will be waiting."; the host's move is saved while the guest is away; the guest sees it when back | 002 | pass (C1-C3: 20/20) |
| C4 | Rules published today (no `presence/`): presence is refused, the old flag marks both players and comes back after a reconnect; C2 and C3 hold; no console errors or permission warnings | 003 ([output](browser/probe-003.txt)) | 18/18 pass |
| C5 | After 2 minutes away the host is offered "Leave game"; note and offer go away when the guest returns | 004 ([output](browser/probe-004.txt)) | 4/4 pass |
| C6 | Local games unaffected: reload and restart resume, Continue and Discard, Quit and Restart, pass-and-play on a touch phone, resumed scoring | 005 ([output](browser/probe-005.txt)) | 31/31 pass |

### Top 3 Things to Fix

None found. 0 issues.

### Console Health

| Error | Count | First seen |
|-------|-------|------------|
| none | 0 | |

### Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

### Screenshots (browser/screenshots/)

`N-host.png`, `N-guest.png` (after recovery, new rules), `O-host.png`, `O-guest.png` (published rules), `L-host-2min.png` (the 2-minute offer), plus the local-game set from probes 001 and 005 (`initial-desktop.jpg`, `initial-phone.jpg`, `continue-card-phone.jpg`, `r1a-A-after-reload.png`, `r1a-B-continue-card.png`, `r1a-D-phone-pvp-after-reload.png`, `r1a-E-resumed-win.png`).

## Functional

| Field | Value |
|---|---|
| Date / branch / revision | 2026-10-11 / fix/r1b-online-presence / 54f5110, clean tree |
| Caller / authority / depth | /qa; writes limited to the report folder and emulator data; Full |
| Surfaces / scope | CLI: the repository's rules test command; changed `firebase/database.rules.json` and adjacent room rules |
| Runtime / native tools | Node 24.21, Vitest 5.0.3, @firebase/rules-unit-testing 5.0.1, firebase-tools 15.33.0 (npx), Realtime Database emulator v4.11.2, Java 26 |
| Fixture ownership / destinations | Emulator namespace `demo-dnb-default-rtdb`, cleared before each test; no downstream targets |
| Probe budget / guarded command time / stop reason | 300 s per capture / 14.3 s / complete: one command covers every functional contract |

### Contract outcomes

| Contract and source | Exact probe / evidence | Expected → observed | Outcome |
|---|---|---|---|
| F1 Realtime Database rules (brief 7R R1; charters.md) | `npm run test:rules`, capture `functional/.qa-evidence/001` (sha256 ccabb85e…) | exit 0, 18/18 tests → exit 0, "Tests 18 passed (18)" | pass |

Evidence verdict for the functional surface: **pass** (final for that report root; no report links: functional captures publish no checkpoints).

### Findings

None.

### Discoveries and permanent tests

| Hypothesis / discovery | Native test | Red evidence before repair | Green evidence | Disposition |
|---|---|---|---|---|
| New `presence/` rules must keep strangers out and let only the owner write | `tests/rules/database.rules.test.ts` (committed in 54f5110) | n/a (new contract, written with the rules) | 18/18 on the emulator | permanent test, run with `npm run test:rules` |

## Coverage limits and cleanup

- Connection loss was simulated with the Firebase SDK's `goOffline()`/`goOnline()`, which closes the socket cleanly. A phone that loses signal abruptly or freezes a background tab can take the live server much longer to notice, so the away note may appear later than 10 s there.
- Online flows ran on the local emulators under a demo project, not the live project. The new rules must be published by the owner; this build works with the old ones (C4).
- Older cached versions of the game were not run against the new rules in a browser (they only talk to the live project); their write paths are covered by the rules tests.
- Reading the room again when the tab returns was smoke-tested by dispatching `visibilitychange` on a visible tab; a real frozen tab was not reproduced.
- Touch was emulated; the R1 acceptance tests on a real Android phone and iPhone remain for the owner. No screen reader was used.
- Cleanup: the emulators (background task) and the two preview servers (4173, 4175) are still running for the design review and benchmark; the emulators' Java processes can outlive their task on Windows and are ended by port after use.

## Fixes Applied

None needed.

## Ship Readiness

| Metric | Value |
|--------|-------|
| Browser health score | 100 (provisional) |
| Browser issues found / fixed / deferred | 0 / 0 / 0 |
| Functional contracts | 1 pass, 0 fail, 0 blocked |

**PR Summary:** "QA found 0 issues, fixed 0, health score 100 (provisional; browser evidence verdict inconclusive, browser-only) and the rules contract passes (18/18 on the emulator)."
