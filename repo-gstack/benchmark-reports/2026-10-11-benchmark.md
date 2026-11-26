# Benchmark: fix/r1a-resume-local-games (e872a0f) vs main (7b3affd), 2026-10-11

**Method.** Both production builds served by `vite preview` on this PC at the same time (branch on 127.0.0.1:4173, main on 127.0.0.1:4174) and measured back to back with gstack's headless Chromium at 1280x800: 2 cold loads (fresh context) and 10 warm reloads per build and case, alternating which build goes first. Medians shown. Firebase hosts are blocked, so nothing reaches the live database (a first visit writes `users/{uid}`); Google Fonts is allowed, as for a real visitor.

**Why not straight against `baselines/baseline.json`?** That baseline (main 7b3affd, 2026-09-30) was measured with Firebase live, and its Home time (LCP 2,536 ms warm) is dominated by Firebase sign-in plus 3 sequential Firestore reads. Timings with Firebase blocked are not comparable to it. Sizes are, and they match: main's JS (663,020 B decoded) and CSS (16,061 B) today are byte-for-byte the baseline's, so the A/B below is a fair stand-in. `baseline.json` is unchanged.

## Results

### Home, first visit (no saved game)

| Metric | main | branch | Delta | Status |
|---|---:|---:|---:|---|
| TTFB (warm) | 2 ms | 2 ms | 0 | OK |
| FCP cold / warm | 708 / 252 ms | 620 / 260 ms | −88 / +8 ms | OK |
| LCP cold / warm | 1,108 / 436 ms | 1,024 / 420 ms | −84 / −16 ms | OK |
| Home ready (Play shown) cold / warm | 602 / 245 ms | 611 / 250 ms | +9 / +5 ms | OK |
| DOM complete (warm) | 402 ms | 420 ms | +18 ms | OK |
| Requests | 7 | 7 | 0 | OK |
| Transfer | 214,329 B | 215,259 B | +930 B (+0.4%) | OK |
| JS decoded | 663,020 B | 665,772 B | +2,752 B (+0.4%) | OK |
| CSS decoded | 16,061 B | 16,243 B | +182 B (+1.1%) | OK |

### Home with a saved game (main ignores it; the branch shows the Continue card)

| Metric | main | branch | Delta | Status |
|---|---:|---:|---:|---|
| Home ready cold / warm | 605 / 217 ms | 669 / 225 ms | +64 / +8 ms | OK |
| LCP cold / warm | 984 / 392 ms | 1,052 / 432 ms | +68 / +40 ms (+10% warm) | OK |
| DOM complete (warm) | 387 ms | 384 ms | −3 ms | OK |

### Reload in the middle of a game against the AI

| | main | branch |
|---|---|---|
| Where the reload lands | Home (game lost) | **The same game** |
| Ready cold / warm | Home in 611 / 232 ms | Board in 494 / 234 ms |
| LCP cold / warm | 980 / 384 ms | 560 / 268 ms |
| Requests / JS decoded | 7 / 663,020 B | 8 / 681,373 B (the AI worker, as in any game) |

No regressions: every timing delta is within noise and under the 20% warning line, and the largest size change is +2.0% (gzip, main script).

## Build sizes (gzip, level 9) against the 2026-09-30 baseline

| Chunk | Baseline (main) | Branch | Delta |
|---|---:|---:|---:|
| index.js (start-up) | 44,743 B (45.1 KB in Vite's report) | 45,630 B (46.1 KB) | +887 B (+2.0%) |
| index.css | 4,237 B (4.3 KB) | 4,267 B | +30 B (+0.7%) |
| app.js (Firebase app) | 30,908 B | 30,909 B | +1 B |
| firebase.js (Firestore) | 130,752 B | 130,760 B | +8 B |
| room.js (lazy) | 39,051 B | 39,051 B | 0 |
| ai.worker.js (raw) | 15,601 B | 15,601 B | 0 |

## Slowest resources (cold, branch)

| # | Resource | Type | Transfer | Duration |
|---|---|---|---:|---:|
| 1 | fonts.googleapis.com `css2` | stylesheet | 1,150 B | 517 ms (main: 510 ms) |
| 2 | firebase.js | script | 131,321 B | 20 ms |
| 3 | index.js | script | 45,955 B | 12 ms |
| 4 | index.css | stylesheet | 4,577 B | 9 ms |
| 5 | app.js | script | 31,263 B | 9 ms |

The render-blocking Google Fonts stylesheet is the slowest item on both builds (pre-existing; PR 01 self-hosts the fonts with `font-display: swap`). Firestore loads at start-up on both builds (pre-existing; part of the start-up work in Track R).

## Budget check (branch, cold, Firebase blocked)

| Metric | Budget | Actual | Status |
|---|---|---:|---|
| FCP | < 1.8 s | 0.62 s | PASS |
| LCP | < 2.5 s | 1.02 s | PASS (with live Firebase, Home waits ~2.5 s: pre-existing) |
| Total JS (decoded) | < 500 KB | 666 KB | FAIL (pre-existing: Firebase app + Firestore at start-up) |
| Total CSS | < 100 KB | 16 KB | PASS |
| Total transfer | < 2 MB | 215 KB | PASS |
| HTTP requests | < 50 | 7 | PASS |

Grade: B (5 of 6) under these conditions; main measured the same way gets the same results on every budget. Not comparable with the baseline's C, which was measured with live Firebase.

**PR summary:** "Benchmark vs main (same machine, back to back): no regressions. Start-up JS +887 B gzip (+2.0%), CSS +30 B; Home ready within ±10 ms warm; a reload mid-game now reopens the board in 234 ms warm instead of landing on Home."
