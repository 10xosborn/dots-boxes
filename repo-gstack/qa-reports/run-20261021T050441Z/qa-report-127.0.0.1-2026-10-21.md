# QA Report: Grid Rivals (Dots & Boxes): server-checked turns online

| Field | Value |
|-------|-------|
| **Date** | 2026-10-21 |
| **Targets** | browser: emulator builds `dist-emu-v2` (this branch) and `dist-emu-hud` (#24) served on 127.0.0.1, two players on the local Firebase emulators; functional: `npm run test:rules` (Vitest and @firebase/rules-unit-testing against the Database emulator) |
| **Branch** | online/server-turns (stacked on #24) |
| **Commit** | 4613e6f |
| **Tier** | Standard |
| **Scope** | Diff-aware: v2 rooms (v, turn, count, drawn), the move write, the rematch, the generated rules |
| **Budget** | browser exploration 900 s (deadline guard), 2 checkpoints and 4 probes; functional unbounded, 1 capture |
| **Driver** | gstack's bundled Playwright with headless Chromium 151 (host: 1280x800 desktop, mouse; guest: 390x844 phone, touch); production Firebase blocked and counted (0 hits) |

Charters: [charters.md](charters.md). Browser checkpoints: [001](browser/exploration-001.json), [002](browser/exploration-002.json). Functional capture: [001](functional/.qa-evidence/001/) (exit 0, complete).

## Browser: health score 100 (provisional: Performance is /benchmark's; Accessibility and Visual unchanged by this diff, not scored)

| Category | Score |
|---|---|
| Console | 100 (0 page errors in 14 sessions) |
| Functional | 100 |
| UX | 100 |
| Content | 100 |

| # | Contract | Result |
|---|---|---|
| B1 | Two current copies, new rules | 7/7: a whole 3x3 game in a v2 room (24 moves), turn, count and the 24 drawn lines equal to the moves, results on both screens, the rematch a clean new game with the guest first, game 2 plays on |
| B2 | Mixed versions, new rules | 8/8: an old host's room (no v) plays a whole game with a current guest; in a current host's room an old guest's move is refused and the old copy says "That move could not be sent. Tap again." |
| B3 | The site before the rules (today's published rules) | 15/15: everything plays, mixed versions included |
| B4 | Presence, moves made offline, reconnects, the away offer, rejoining after a reload or browser restart (v2 rooms) | 39/40 and 23/23. The one failure is the presence suite's scenario with the rules from before presence existed (`git show cd588b2^1`), where presence writes should be refused: it fails the same way on #24's build (checked in this session), so it is how that probe swaps rules on today's emulator, not this change; those rules are not published anywhere |

## Functional: contract outcomes (`npm run test:rules`, 34/34 pass; the rules file matches its generator)

| Contract | Outcome | Tests |
|---|---|---|
| Successful execution | pass | whole honest games on 1x1, 1x3, 2x2, 3x2, 3x3, 2x5, 6x6 and 12x12; a line closing one box keeps the turn, two boxes at once too, a line closing nothing passes it |
| Invalid input | pass | off the board (12 on 2x2, -1), not a whole number (2.5), a skipped slot, a played slot, a drawn line, a wrong next turn, the line marked with the wrong seat |
| Authorization | pass | out of turn, a stranger moving or writing timings or flags, a player writing the other's name or online flag, the host taking the guest's seat, a third player after the guest |
| State transitions | pass | no move after the last line; a rematch only after a finished game and only as a clean reset (count 0, turn = first, no moves or lines, the first player swapped, game + 1, same players and board) |
| Duplicates | pass | a line drawn twice, a slot written twice |
| Partial updates | pass | the counters, the turn or a line alone; a move without its line; a second line in one move; replacing the room |
| History | pass | moves, lines, first, rows, game, host, turn, count and v can't be changed or removed in a v2 room |
| Old copies and rooms | pass | rooms without v keep the old rules (moves and rematches as before); an old copy's lone move write is refused in a v2 room |

## Issues

None found in the change. Known limits, for the PR:
- A copy of the game from before this change (a tab not reloaded) can't move in a room made by the new version once the new rules are published, and its own message says "Tap again"; publishing the rules a day after the deploy leaves time for open tabs to reload.
- A game in progress at the moment the rules are published, in which a stale copy already moved, can stop accepting moves (that copy never wrote the new counters).
- Rooms made by old copies stay unchecked until a later rules change makes v2 rooms the only kind.

> QA found 0 issues, fixed 0; browser health 100 (provisional); functional contracts all pass (34/34 rules tests).
