# Benchmark: fix/owner-2026-10-20 (87b0ed6) vs main (ab4c706)

Method: both production builds served side by side by one plain static server (scratchpad `serve-two.mjs`, no compression, so byte counts below are raw unless marked gzip), Firebase blocked, gstack's headless Chromium 151 (software raster: the raster work runs in the renderer process). Every timing is interleaved main/branch with the order flipping each round, so a busy machine slows both alike. Raw outputs and probes: `raw-20261020-owner-fixes/`. No stored baseline is comparable (the 2026-09-30 one was measured with live Firebase), so main built beside the branch is the baseline.

What could cost something: the board's line and dot filters (Tabletop's engrave and lift, Paper's emboss with its blur and flat shadow) now cover the whole board instead of each group's box. Early in a game the old box held only the few lines drawn so far; by mid-game it was the whole board anyway.

## 1. Drawing lines from a fresh game (`filter-cost-ab.mjs`, 4 rounds x 12 taps per build and mode)

Each tap is timed to the next painted frame (two rAFs), then 450 ms of frame intervals while the line grows; renderer CPU is the process's CPU time per tap.

| Board | Mode | Tap to paint, median (p90) ms: main -> branch | Grow frames median / p90 ms | Frames > 20 ms | Renderer CPU per tap ms |
| --- | --- | --- | --- | --- | --- |
| 4x4 phone, CPU 4x | Tabletop night | 32.8 (48.9) -> 32.7 (34.9) | 16.7 / 16.7 both | 0.6% -> 0.1% | 844 -> 842 |
| 4x4 phone, CPU 4x | Tabletop day | 32.3 (37.7) -> 32.3 (33.9) | 16.7 / 16.7 both | 0.1% -> 0.0% | 747 -> 749 |
| 4x4 phone, CPU 4x | Paper night | 32.5 (48.9) -> 33.2 (48.8) | 16.7 / 16.7 both | 0.1% -> 0.8% | 793 -> 807 |
| 4x4 phone, CPU 4x | Paper day | 32.7 (50.8) -> 33.3 (48.1) | 16.7 / 16.7 both | 0.5% -> 0.2% | 759 -> 757 |
| 12x12, 1920x1080 | Tabletop night | 32.7 (34.3) -> 32.5 (33.7) | 16.7 / 16.7 both | 0.3% -> 0.1% | 318 -> 334 (+5%) |
| 12x12, 1920x1080 | Tabletop day | 32.7 (33.8) -> 32.6 (33.8) | 16.7 / 16.7 both | 0.0% both | 204 -> 212 (+4%) |
| 12x12, 1920x1080 | Paper night | 32.9 (33.7) -> 32.9 (33.8) | 16.7 / 16.7 both | 0.0% -> 0.1% | 213 -> 219 (+3%) |
| 12x12, 1920x1080 | Paper day | 32.9 (33.8) -> 32.9 (34.1) | 16.7 / 16.7 both | 0.0% both | 194 -> 199 (+2.5%) |

Paint latency and frames are unchanged everywhere (every frame on the 60 Hz beat; the paired tap-to-paint medians are within 1 ms). The only movement: on a 12x12 board, the first dozen lines cost 2.5-5% more renderer CPU, because the filters now work over the whole board from the first line rather than over the few lines drawn so far. Under the 20% warning line, no dropped frames, and gone by mid-game (main's box covers the whole board by then). On main the first lines along one row are not painted at all, so main's cost there is not a fair floor.

## 2. Reloading a game in progress (`reload-ab-size.mjs`, 4x4, 24 moves, cold, phone CPU 4x)

| Mode | Ready (board in the page) main -> branch | Paired median, branch slower in | LCP main -> branch |
| --- | --- | --- | --- |
| Tabletop night (8 rounds) | 526 -> 569 | +49 ms, 6/8 | 968 -> 1020 |
| Tabletop day (8) | 584 -> 564 | -11 ms, 3/8 | 1032 -> 1008 |
| Paper night (8) | 521 -> 548 | +19 ms, 7/8 | 952 -> 1012 |
| Paper day (8) | 446 -> 465 | +18 ms, 4/8 | 880 -> 900 |
| **Re-run, Tabletop night (16)** | 489 -> 480 | +5 ms, 9/16 | 920 -> 916 |
| **Re-run, Paper night (16)** | 602 -> 590 | +36 ms, 8/16 | 1064 -> 1044 |

The two night modes leaned slower in the first pass; with 16 rounds each they are a coin flip (9/16 and 8/16, LCP -8 and +8 ms). "Ready" is measured before anything paints, so the filter change can't move it. Noise, as CLAUDE.md's ±25 ms cold-load note predicts.

## 3. Home page load (`home-load-ab.mjs`, 8 cold loads per build, phone CPU 4x)

| Metric | Tabletop night main -> branch | Paper day main -> branch |
| --- | --- | --- |
| TTFB | 1 -> 1 ms | 1 -> 1 ms |
| FCP | 256 -> 260 ms | 288 -> 280 ms |
| LCP | 884 -> 892 ms | 1024 -> 1008 ms |
| Home ready (Play in the page) | 451 -> 471 ms | 551 -> 554 ms |
| DOM interactive | 54 -> 58 ms | 64 -> 64 ms |
| DOM complete / full load | 288 -> 303 ms | 274 -> 257 ms |
| Requests | 7 -> 7 | 10 -> 10 |
| Transfer (raw) | 802,914 -> 804,258 B | 849,886 -> 851,230 B |

Flat within noise in both directions.

## 4. Bundle sizes (`dist-sizes.mjs`)

| | main | branch | delta |
| --- | --- | --- | --- |
| index.js (start-up script) | 45,374 B gzip | 45,838 B gzip | +464 B (+1.0%) |
| All JS | 271,394 B gzip | 271,855 B gzip | +461 B (+0.2%) |
| CSS | 10,197 B gzip | 10,203 B gzip | +6 B |
| Everything | 282,492 B gzip | 282,957 B gzip | +465 B (+0.16%) |

28 other files unchanged. The JS growth is the button-click listener, the noise click and the drop's glide in `sound.ts`, and the move kind passed from the board.

## Budget (Home, phone CPU 4x)

| Metric | Budget | Actual (branch) | Status |
| --- | --- | --- | --- |
| FCP | < 1.8 s | 0.26-0.28 s | PASS |
| LCP | < 2.5 s | 0.89-1.01 s | PASS |
| Total JS | < 500 KB | 272 KB gzip, every chunk | PASS |
| Total CSS | < 100 KB | 10 KB gzip | PASS |
| Total transfer | < 2 MB | 0.80-0.85 MB raw | PASS |
| HTTP requests | < 50 | 7-10 | PASS |

Grade: A (6/6).

## Verdict

**No regressions.** Nothing crosses a warning threshold (timing +20%, bundle +10%); the scenarios that leaned slower came back flat with twice the samples. Watch item: early-game renderer CPU on very large boards (+2.5-5% on 12x12), frames unaffected. Not measured: real GPUs (headless draws in software, so these are upper bounds) and the owner's phone.
