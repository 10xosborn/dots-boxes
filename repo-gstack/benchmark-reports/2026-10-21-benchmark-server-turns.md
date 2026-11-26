# Benchmark: online/server-turns (4613e6f) vs its base #24 design/09-hud-avatars (e4226a8)

What changed: rooms the game creates carry v 2, turn, count and drawn lines, and a move is one four-value update the database rules check (a 6 KB move rule); old rooms keep the one-slot transaction. Pages loaded at startup are unchanged (the online code loads only when online play starts).

## 1. Bundle (`dist-sizes.mjs`, production builds)

| | #24 | branch | delta |
| --- | --- | --- | --- |
| Startup JS (index) | 49,351 B gzip | 49,393 B gzip | +42 B |
| Online chunk (room, loaded on demand) | 39,805 B gzip | 39,905 B gzip | +100 B |
| All JS | 275,371 B gzip | 275,511 B gzip | +140 B (+0.05%) |
| CSS | 12,026 B gzip | 12,026 B gzip | 0 |

## 2. Online move latency (`lag-breakdown.mjs` via `hud/lag-ab.mjs`)

Local Firebase emulators with the new rules loaded, no added network delay; emulator builds; a host on a desktop (mouse) and a guest on a phone (touch), Tabletop at night, Animations on; whole 5x5 games of 60 random legal moves, both players on the same build per game, builds alternating game by game over 4 rounds (8 games, 480 moves).

| Round | Other screen median (checked / old) | Wire median (checked / old) | Own screen median (checked / old) |
| --- | --- | --- | --- |
| 1 | 114 / 95 ms | 44 / 25 ms | 80 / 78 ms |
| 2 | 102 / 102 ms | 34 / 20 ms | 82 / 82 ms |
| 3 | 141 / 111 ms | 61 / 37 ms | 75 / 84 ms |
| 4 | 87 / 92 ms | 34 / 26 ms | 69 / 78 ms |
| paired median | +9.5 ms (+10%) | +16.5 ms | unchanged |

Every move reached the other screen in every game (none later than 3 s), no page errors, no production requests. "Wire" is the time from the move leaving the mover's page to the other page receiving it: the emulator's rule check and the four-value write. The emulator runs the rules in Java on this PC; production's rule engine is faster and the real network dominates, so +16 ms is an upper bound for what players feel. The mover's own line is unaffected (Firebase shows it at once).

## Verdict

**No regressions.** JS +140 B gzip, CSS unchanged, startup pages untouched. Online, the other player sees each move about 10 ms later on the emulator (paired median, under the 20% warning line), the cost of the server checking it; the mover's own screen is unchanged. Not measured: production Firebase and real phones (tests never touch live Firebase).
