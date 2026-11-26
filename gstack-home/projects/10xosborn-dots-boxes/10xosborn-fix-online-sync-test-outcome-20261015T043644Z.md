# QA Report: Grid Rivals, online play fix (moves that reach the other phone, dead connections, the end-of-game tap)

| Field | Value |
|-------|-------|
| **Date** | 2026-10-15 |
| **URL** | http://127.0.0.1:4175/ (emulator build of aaea14d), :4176/:4177 for the mixed-version game, :4173 for the production build (AI-game suites) |
| **Branch** | fix/online-sync |
| **Commit** | aaea14d, base main 2f770e0 |
| **PR** | not opened yet |
| **Tier** | Standard; browser Full, diff-aware |
| **Scope** | `src/lib/online/room.ts` (single-slot move writes, the link check), `src/screens/Online.svelte` (link checks while waiting and on wake, "Sending…", the ?debug=net hooks), `src/lib/online/netdebug.ts` (new, loaded only with ?debug=net), `src/lib/online/types.ts`, `src/components/ResultsModal.svelte` (the end-of-game tap guard) |
| **Probe budget / guarded command time** | 900 s / about 690 s over 11 probes, none timed out; stopped with about 200 s left, all contracts tested |
| **Pages visited** | Home, the online lobby, waiting room, online games (3x3, 4x4, 5x5), results dialog, rejoin flows; AI games, results, reload and restart on the production build |
| **Screenshots** | 2 in `screenshots/` (the ?debug=net panel on both screens) plus the suites' own |
| **Framework** | Svelte 5 SPA (Vite), Firebase Realtime Database (local emulators, demo project) |
| **Driver** | gstack's playwright-core with its headless Chromium (Aside is macOS-only): host 1280x800 with a mouse, guest 390x844 with touch, two contexts; a local TCP proxy for network delay and dead connections |
| **Charters** | [charters.md](charters.md): C1-C11 |

## Health Score: 100/100 (provisional), main 95

| Category | Score | main (same suites) |
|----------|-------|------|
| Console | 100 (0 page errors in every probe) | 100 |
| Links | not scored | not scored |
| Visual | 100 | 100 |
| Functional | 100 | 77 (a dead connection never recovers: high; the end-of-game tap presses Leave or Rematch: medium) |
| UX | 100 | 100 |
| Performance | 100 (move to other screen: 39 ms local, 254-283 ms over a 4G-like round trip) | 100 |
| Content | 100 | 100 |
| Accessibility | 100 | 100 |

Provisional: no real phones or mobile networks (two headless browsers on one PC, local emulators, a simulated round trip). Main's score uses the two defects reproduced on main's build with the same suites before this run.

## Evidence verdict: inconclusive (open: no evidence rows)

Final for this report root: a browser-only run produces no evidence rows. Results are in the probe outputs and checkpoints:

[checkpoint 002](exploration-002.json) · [checkpoint 003](exploration-003.json) · [checkpoint 004](exploration-004.json) · [checkpoint 005](exploration-005.json) · [checkpoint 006](exploration-006.json) · [checkpoint 007](exploration-007.json) · [checkpoint 008](exploration-008.json) · [checkpoint 009](exploration-009.json) · [checkpoint 010](exploration-010.json) · [checkpoint 011](exploration-011.json)

## Contracts

| # | Contract | Probe and result |
|---|---|---|
| C1 | Every move reaches the other screen with nobody touching it; no request to the page host while playing | 001 ([output](probe-001.txt), [full](probe-001-full.txt)): 60/60 moves on 5x5; own screen median 28 ms (worst 61), other screen median 39 ms (worst 77); none missed; both boards and the room agree; 0 requests while playing |
| C2 | The same over a 4G-like round trip (90 ms each way + jitter) | 002 ([output](probe-002.txt)): 4x4 other screen median 254 ms (worst 313), 5x5 median 258 ms (worst 308), none missed. (Runner slip: the summary step failed on a path; the measurement lines are complete) |
| C3 | Recovery when a connection dies silently | 003 ([output](probe-003.txt), [full](probe-003-full.txt)): waiting phone 7.6 s, moving phone 5.1 s (shows "Sending…" meanwhile; own screen 13 ms), waking phone 3.3 s. Main, same suite before this run: not within 45 s in all three |
| C4 | The tap that ends a game doesn't press the results dialog | 004 ([output](probe-004.txt), [full](probe-004-full.txt)): 6/6 (the phone's last tap ran under Leave; game 1 kept all 24 moves, the phone kept the board and the dialog, a real tap on Rematch then started game 2). Main, same suite: the phone left the game |
| C5 | Presence, Reconnecting…, offline moves, away notes, no lost or doubled moves | 005 ([output](probe-005.txt)): 20/20 |
| C6 | Rejoin after reload or restart, ended rooms, the 8 s limit | 006 ([output](probe-006.txt)): 23/23 |
| C7 | Old and new versions play each other | 007 ([output](probe-007.txt), [full](probe-007-full.txt)): main host + branch guest 40/40 (other screen 40 ms median), branch host + main guest 40/40 (62 ms) |
| C8 | ?debug=net panel | 008 ([output](probe-008.txt), [full](probe-008-full.txt)): panel on both screens, websocket, 0 reconnects, clock fix 92 ms; its median 274 ms vs the harness's same-clock 283 ms. Screenshots: `screenshots/debug-panel-guest.png`, `debug-panel-host.png` |
| C9 | AI games and their results dialog unchanged | 009 ([output](probe-009.txt)): 35/35 |
| C10 | Local resume unchanged | 010 ([output](probe-010.txt)): 31/31 |
| C11 | Database rules accept the single-slot move write, refuse strangers | 011 ([output](probe-011.txt), [full](probe-011-full.txt)): 20/20 (18 before + 2 new) |

## Top 3 Things to Fix

None found in this run.

## Issues

None new. Two defects found on main while investigating the owner's lag report were fixed in aaea14d before this run (below).

## Found and fixed before this run (in aaea14d)

- **A connection that dies silently never recovers (high, Functional).** Firebase's own keep-alive has no reply timeout, and the page's wake-up re-read came from Firebase's copy, so a phone that lost its connection without the browser noticing kept an old board (and its own moves never left). Main: no recovery within 45 s in any of the three cases. Fix: a round trip to the server while waiting, on wake and after a slow move; no answer means a new connection. After: 3.3-7.6 s.
- **The end-of-game tap presses Leave or Rematch (medium, Functional).** Online, the results dialog opens synchronously under the finger and the tap's click lands on it. Main: the phone left the game. Fix: only a press that starts on the dialog counts (keys always do).
- Test-harness fixes, not product: the R1b suite's "old rules" now come from before PR #5 (main has had the presence rules since); its old-rules check still fails on main too (the emulator keeps accepting presence writes after the rules switch), so it is a harness limit, not a regression.

## Regression tests

- `tests/rules/database.rules.test.ts`: two rules tests for the new single-slot move write (`rooms/{code}/moves/{n}`), green (20/20). Value: protects=the published rules accept one move slot from a seated player and refuse others; fails_when=room writes stop cascading to moves/{n} or moves get validated only as a whole list; why_new=existing tests only wrote the whole moves list; seam=none; no_claim=turn order (the rules don't check it; the slot transaction does).
- Browser regression suites kept outside the repo (as the project does): `ghost-click.mjs` and `online-freeze.mjs` fail on main and pass on the branch.

## Console Health

| Error | Count | First seen |
|-------|-------|------------|
| none | 0 | |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |

Fixes in this run: 0 verified, 0 best-effort, 0 reverted; 0 deferred. Two defects fixed before the run (above), verified by C3 and C4.

**PR Summary:** QA found 0 issues in the run (2 fixed before it, verified), fixed 0, health score 95 → 100.
