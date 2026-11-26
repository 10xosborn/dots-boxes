# Charters: the stronger AI (ai/stronger-hard, 3829b7f)

Scope: `src/lib/engine/ai-core.js` (Hard's fight for control, chain analysis, exact-search windows, 0.7 s move limit;
Medium's fewest-boxes rule), `scripts/ai-bench.mjs`, `tests/ai/ai.test.ts`, package scripts, README. The AI runs in the
game's Web Worker (unchanged `ai.worker.ts` / `ai.ts`).

## Browser (REPORT_DIR/browser), production build on http://127.0.0.1:4173, Firebase blocked

Driver: gstack's playwright-core with its headless Chromium (Aside is macOS-only). Phone 390x844 with touch and the CPU
slowed 4x through CDP (a mid-range Android), Animations off; the human taps a random free line. An AI move's delay is
the time from the line before it to the AI's line on screen, including the game's own 0.3-0.8 s pause.

| # | Contract | Risk | Entry and inputs | Exit condition | Command |
|---|---|---|---|---|---|
| B1 | Hard on 5x5 plays to the end; every move within 1.2 s; no main-thread task over 200 ms while playing | The new 0.7 s thinking, the worker | Home, Play, Start game (Hard, 5x5) | result dialog, delays, long tasks | `ai-browser.mjs hard:5` |
| B2 | The same on 6x6 and on 3x3 (book and exact search) | Bigger boards; the 3x3 path | as B1 | as B1 | `ai-browser.mjs hard:6 hard:3` |
| B3 | The same on 7x7, the largest board a phone fits | Most lines | Custom 7x7 | as B1 | `ai-browser.mjs hard:7` |
| B4 | Medium on 5x5 and Easy on 4x4 | Medium's new rule | as B1 | as B1 | `ai-browser.mjs medium:5 easy:4` |
| B5 | Game integrity: Hard to the end, phone 7x7, desktop 12x12, keyboard-only 3x3, reload, restart | Adjacent | as in R1a | 35 checks | `integrity-r1a.mjs` |
| B6 | Local games' resume (an AI game reloaded mid-thought) | Adjacent | as in R1a | 31 checks | `qa-r1a.mjs` |

Budget: 900 s wall clock under the deadline guard; one suite per probe; a checkpoint before every probe after the first.

## Functional (REPORT_DIR/functional), repository commands, captured with gstack's evidence tool (timeouts per command)

| # | Contract | Command | Expectation |
|---|---|---|---|
| F1 | Known endgames, random positions and exact 3x3 play | `npm run test:ai` | exit 0, 8 tests pass |
| F2 | The 3x3 opening book against a full solve, and Hard vs Hard on 3x3 | `node scripts/opening-book.mjs --check 100` | exit 0; book matches; every game 6-3 to the second player |
| F3 | The benchmark runs and plays only legal moves | `npm run ai:bench -- --sizes 3,4 --games 10 --slow 4 --pairs hard:medium,medium:easy` | exit 0, a results table |
