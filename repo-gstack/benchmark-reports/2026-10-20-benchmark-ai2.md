# Benchmark: Hard's pondering and quicker AI moves (ai/4x4-and-speed) vs main

| Field | Value |
|---|---|
| Date | 2026-10-20 |
| Builds | branch `324768f` (entry `index-…js` 128,178 B, worker `ai.worker-…js` 24,876 B) vs main `10e07f1` (entry `index-xWGg2yOc.js` 128,009 B, worker `ai.worker-D9IryGg9.js` 20,780 B), served side by side by `serve-two.mjs` |
| Driver | gstack's playwright-core, headless Chromium 151, Firebase blocked by hostname, phone 390x844 at 2x with touch, CPU slowed 4x; builds alternate load by load (order flips each round) |
| Raw data | `raw-20261020-ai2/` (`sizes.json`, `ai-latency-home.json`, `reload-ab*.txt`) |

## Verdict

**The AI answers much sooner and a game is 24% shorter; page loads flat, with one small, explained exception.** On a
phone-speed CPU the AI's first line of a turn comes at a median 448 ms after the player's line (main 701), and each
further line while it takes a chain at 252 ms (main 629); a whole Hard 4x4 game against random play took 19.9 s
(main 26.2 s). The start-up script grew by 69 bytes gzip.

Finding (OK by the thresholds, < 20%): a reload into a **late** game on Hard is 12-26 ms slower to show the board
(paired median, Tabletop at night), because Hard starts thinking on the player's time while the page is still
appearing and the worker shares the slowed CPU. A reload into an early game (nothing to think about) is level
(-3 ms). Suggested fix: start that thinking about half a second after a reload.

**After the fix** (`start()` in Game.svelte: back in a game on the player's turn, Hard starts thinking 500 ms after the
reload; QA recheck `.gstack/qa-reports/run-20261020T085036Z/`): the late-game reload on Tabletop at night is level
with main, board ready paired median **-13 ms** (branch slower in 5/16), LCP paired 0
(`raw-20261020-ai2/reload-ab-table16-fix.txt`). No regressions remain.

## Bundles

| Asset | main | branch | Delta | Status |
|---|---|---|---|---|
| Start-up script (raw / gzip) | 128,009 / 45,271 B | 128,178 / 45,340 B | +169 / +69 B | OK |
| AI worker (raw / gzip) | 20,780 / 10,277 B | 24,876 / 11,937 B | +4,096 / +1,660 B | OK (loaded when a game against the AI starts) |
| No-worker fallback engine (raw / gzip) | 20,017 / 9,941 B | 23,860 / 11,541 B | +3,843 / +1,600 B | OK (loaded only without a worker) |
| CSS, Firebase, online room | | | 0 | OK |

## AI moves in a real game (Hard 4x4, 2 games per build, player draws a random line after 0.7 s)

| Metric | main | branch | Delta |
|---|---|---|---|
| AI's first line of a turn, median / p90 / max | 701 / 772 / 803 ms | 448 / 706 / 709 ms | -253 ms median |
| Further lines after it closes a box, median / p90 / max | 629 / 795 / 817 ms | 252 / 284 / 291 ms | -377 ms median |
| Whole game | 26.2 s, 26.2 s | 19.8 s, 20.0 s | -24% |
| Main-thread long tasks over 50 ms (all from rendering) | 6, longest 76 ms | 4, longest 69 ms | fewer |

The branch's slowest first lines (about 0.7 s) are Hard's playout moves early in the game, which use the move's full
0.7 s (kept: cutting it to 0.5 s made Hard weaker in the AI benches).

## Page loads (medians, ms)

| Scenario | main | branch | Paired difference (branch - main) | Status |
|---|---|---|---|---|
| Home cold, Tabletop at night (8 rounds): ready / FCP / LCP | 514 / 220 / 804 | 541 / 248 / 872 | ready +7 (branch slower in 5/8) | OK (noise: same CSS, +169 B JS) |
| Game reload, Tabletop at night, 24 lines drawn (10 rounds) | ready 458, LCP 908 | 484, 912 | +26 (6/10), LCP +16 | OK, see 16 rounds |
| Same, 16 rounds | ready 466, LCP 920 | 484, 932 | +12 (10/16), LCP +12 | OK (finding above) |
| Same, 6 lines drawn (nothing to ponder), 16 rounds | ready 454, LCP 880 | 447, 872 | -3 (6/16), LCP -8 | OK |
| Game reload, Neon at night, 24 lines drawn (10 rounds) | ready 479, LCP 592 | 480, 584 | -3 (4/10), LCP +4 | OK |

## Performance budget (branch)

| Metric | Budget | Actual | Status |
|---|---|---|---|
| FCP | < 1.8 s | 0.25 s (Home cold) | PASS |
| LCP | < 2.5 s | 0.87 s (Home cold) | PASS |
| Start-up JS (gzip) | < 500 KB | 45.3 KB entry | PASS |
| CSS | < 100 KB | 46 KB raw | PASS |
| Transfer | < 2 MB | 0.80 MB per Home load (uncompressed server) | PASS |
| Requests | < 50 | not counted this run | N/A |

Grade: A (5/5 measured).
