# QA Report (recheck): Hard's thinking starts after a reload settles

| Field | Value |
|-------|-------|
| **Date** | 2026-10-20 |
| **URL** | http://127.0.0.1:4173/ (production build of the working tree: 324768f plus the Game.svelte change below) |
| **Branch** | ai/4x4-and-speed |
| **Tier** | Standard (recheck of one change) |
| **Scope** | `start()` in src/screens/Game.svelte: back in a game on the player's turn after a reload, Hard's thinking on the player's time starts 500 ms later instead of during page load (the /benchmark finding: a late-game reload showed the board 12-26 ms later on a 4x-slowed CPU) |
| **Probe budget / guarded command time** | 300 s / about 75 s (3 probes) |
| **Screenshots** | 2 |
| **Main run** | `.gstack/qa-reports/run-20261020T082627Z/` (12 probes, health 100, 1 low pre-existing issue deferred) |

## Results

| Probe | Result |
|---|---|
| 001 Resume | 13 lines before and after the reload, player to move, `reset,ponder` after the reload, game over 0–16, 0 errors |
| 002 Resume, timed | **505 ms from the reset to the first ponder after the reload**; 12 lines kept, player to move, game over 1–15, 0 errors, 0 long tasks |
| 003 New Hard 4x4 game | ponder 14 (every player turn), AI first line 304/433/719 ms, further lines 205/231/699 ms (699: a capture followed by a playout move), game over 1–15, 0 errors, 0 long tasks |

Benchmark after the change (`.gstack/benchmark-reports/raw-20261020-ai2/reload-ab-table16-fix.txt`): the late-game
reload on Tabletop at night is level with main, board ready paired median -13 ms (branch slower in 5/16), LCP 0.

## Health Score: 100/100 (provisional: Console, Functional, UX tested on the changed path)

No new issues. Evidence tool verdict: **inconclusive** (open: no evidence rows), by design for a browser-only run.

[checkpoint 002](exploration-002.json), [checkpoint 003](exploration-003.json)

Limits: the recheck covers the changed resume path and the adjacent new-game path only; Chromium only, emulated phone;
probe 001 printed the message order without the delay, so 002 reran it measuring the delay.

**PR Summary:** "QA recheck: the deferred start works (505 ms), no new issues."
