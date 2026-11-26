# Benchmark: the stronger AI (ai/stronger-hard) vs main

| Field | Value |
|---|---|
| Date | 2026-10-15 |
| Builds | branch `8c0c324` (entry `index-CfB3wrkv.js`, worker `ai.worker-D9IryGg9.js`, on-demand `ai-core-DEIhvNym.js`) vs main `cff945c` (entry `index-Ma2ZkviS.js`, worker `ai.worker-Duy7mktc.js`), served side by side by `serve-two.mjs` |
| Driver | gstack's playwright-core, headless Chromium, Firebase blocked, phone 390x844 at 2x, CPU slowed 4x; 6 cold + 8 warm loads per scenario |
| Raw data | `raw-20261015-ai/` |

## Verdict

**No regressions; start-up is lighter.** The AI engine left the page's start-up script (it was only there as the
fallback for browsers that can't run the worker): the start-up script is 8.7 KB gzip smaller (-16%), every page
downloads about 15 KB less, and the worker that plays the AI grew by 5 KB (loaded when a game against the AI starts).

## Bundles

| Asset | main | branch | Delta | Status |
|---|---|---|---|---|
| Start-up script (gzip) | 53.16 kB | 44.42 kB | -8.74 kB (-16%) | better |
| AI worker (raw) | 15.60 kB | 20.78 kB | +5.18 kB | OK (loaded for AI games only) |
| Main-thread fallback engine | (in the start-up script) | 20.01 kB, 9.99 kB gzip, on demand | loaded only without a worker | better |
| Bytes per Home page (uncompressed) | 790-855 KB | -14.8 KB | -1.8% | better |

## Page loads (medians, ms)

| Scenario | ready cold main → branch | warm | LCP cold | Status |
|---|---|---|---|---|
| Home, Tabletop at night | 478 → 496 | 217 → 248 | 576 → 592 | OK (noise; under the 20% warning line) |
| Game reload, Tabletop at night | 500 → 498 | 263 → 261 | 604 → 584 | OK |
| Home, Neon at night | 447 → 444 | 222 → 218 | 544 → 532 | OK |
| Game reload, Neon at night | 482 → 472 | 258 → 258 | 628 → 608 | OK |
| Home, Paper by day | 408 → 383 | 193 → 184 | 528 → 496 | OK |

## AI thinking (from /qa, `.gstack/qa-reports/run-20261015T064932Z/`)

Phone with the CPU slowed 4x: every AI move within 0.83 s of the line before it (the game's own 0.3-0.8 s pause
included) on 3x3 to 7x7, no main-thread task over 200 ms while the AI thinks in its worker. Without a worker (blocked
on purpose), the on-demand engine plays with main-thread tasks of at most 191 ms.

## Performance budget (branch)

| Metric | Budget | Actual | Status |
|---|---|---|---|
| FCP | < 1.8 s | 0.28 s cold | PASS |
| LCP | < 2.5 s | 0.61 s cold | PASS |
| Start-up JS (gzip) | < 500 KB | 75 KB (entry 44 + app 31) | PASS |
| CSS | < 100 KB | 43 KB | PASS |
| Transfer | < 2 MB | 0.84 MB | PASS |
| Requests | < 50 | under 30 | PASS |

Grade: A (6/6).
