# Benchmark: the online play fix (fix/online-sync) vs main

| Field | Value |
|---|---|
| Date | 2026-10-15 |
| Builds | branch `b4e468b` (dist `index-Ma2ZkviS.js`, `index-i8HDskhf.css`) vs main `2f770e0` (scratch worktree build, `index-CfMbEBaV.js`, same CSS), served side by side by one plain static server per build (`serve-two.mjs`, Cache-Control max-age=600 like Pages) |
| Driver | gstack's playwright-core with headless Chromium; Firebase blocked; phone 390x844 at 2x with touch, CPU slowed 4x |
| Raw data | `raw-20261015-online/` (`abd.json`: 4 cold + 6 warm loads per scenario and 16 moves; `rerun-paper-dark.json`, `rerun-neon-dark.json`: 8 cold + 10 warm; `rerun-paper-dark-swapped.json`: the same with the two builds' slots swapped) |
| Online move latency | measured in /qa (`.gstack/qa-reports/run-20261015T042332Z/`) with two browsers and the emulators |

## Verdict

**No regressions.** The change lives in online code that loads only when online play starts, plus the shared results dialog. Start-up script grows by 440 B gzip; page loads and move-to-paint are flat within this setup's noise. One scenario sat 45 ms (11%) slower on cold loads in three runs (Paper at night), below the 20% warning line and with no start-up code behind it (the entry page is identical apart from hashes; the only difference is 1.3 KB of script), so it is recorded, not flagged.

## Bundles

| Asset | main | branch | Delta | Status |
|---|---|---|---|---|
| JS entry (gzip) | 51,958 B | 52,398 B | +440 B (+0.8%) | OK |
| Online code, loaded when online play starts (gzip) | 39,577 B | 39,779 B | +202 B | OK |
| ?debug=net panel (gzip), loaded only with the flag | none | 1,083 B | new, not loaded otherwise | OK |
| Firebase SDK chunk (gzip) | 130,299 B | 130,298 B | 0 | OK |
| CSS | `index-i8HDskhf.css` | same file | 0 | OK |
| Bytes per Home page (uncompressed transfer) | 789-879 KB | +1,161 B | +0.14% | OK |

## Page loads (phone, CPU 4x, medians)

| Scenario | Home ready cold, main → branch | warm | LCP cold | Status |
|---|---|---|---|---|
| Tabletop by day | 406 → 376 ms | 185 → 193 | 476 → 460 | OK |
| Tabletop at night | 360 → 360 | 177 → 188 | 432 → 432 | OK |
| Neon at night | 400 → 433; re-run 480 → 480 | 196 → 213; re-run 254 → 263 | 476 → 536; re-run 576 → 580 | OK (noise) |
| Neon by day | 427 → 460 | 269 → 215 | 520 → 560 | OK |
| Paper by day | 408 → 408 | 218 → 218 | 528 → 536 | OK |
| Paper at night | 408 → 483; re-run 396 → 441; slots swapped 451 → 496 | 218 → 236; 229 → 211; 225 → 254 | 540 → 608; 516 → 568; 580 → 680 | OK (+11% cold, under the 20% warning line) |
| Game reload, Tabletop at night (board ready) | 502 → 436 | 226 → 215 | 584 → 532 | OK |
| Game reload, Neon at night | 448 → 450 | 251 → 250 | 532 → 548 | OK |

## Move to paint (a tap on a line to the next painted frame, 16 moves)

| Theme | main median / p95 | branch median / p95 | Status |
|---|---|---|---|
| Tabletop at night | 29.0 / 42.1 ms | 28.2 / 30.8 ms | OK |
| Neon at night | 26.8 / 33.2 ms | 27.2 / 29.4 ms | OK |

## Online move latency (from /qa, two browsers, local emulators)

| Measure | main | branch |
|---|---|---|
| Other screen, no network delay (5x5, 60 moves) | median 48 ms, worst 92 ms | median 39 ms, worst 77 ms |
| Other screen, 4G-like round trip (4x4 / 5x5) | median 255 / 267 ms, worst 296 / 317 ms | median 254 / 258 ms, worst 313 / 308 ms |
| Mover's own screen | median 18-30 ms | median 19-28 ms |
| A connection that dies silently: waiting phone / moving phone / waking phone | never within 45 s (all three) | 7.6 s / 5.1 s / 3.3 s |

## Performance budget (branch)

| Metric | Budget | Actual (worst scenario) | Status |
|---|---|---|---|
| FCP | < 1.8 s | 0.30 s cold | PASS |
| LCP | < 2.5 s | 0.68 s cold | PASS |
| Total JS (gzip, start-up) | < 500 KB | about 83 KB (entry + app) | PASS |
| Total CSS | < 100 KB | 43 KB (9.7 KB gzip) | PASS |
| Total transfer | < 2 MB | 0.88 MB | PASS |
| HTTP requests | < 50 | under 30 | PASS |

Grade: A (6/6).
