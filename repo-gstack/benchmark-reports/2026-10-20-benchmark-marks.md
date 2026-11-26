# Benchmark: the spec's step 2 board marks (design/07-board-marks) vs main

| Field | Value |
|---|---|
| Date | 2026-10-20 |
| Builds | branch `3e7ea88` vs main `10e07f1`, served side by side by `serve-two.mjs` (plain static server for both) |
| Driver | gstack's playwright-core, headless Chromium 151, Firebase blocked by hostname; phone 390x844 at 2x with touch and the CPU slowed 4x unless noted; builds alternate round by round (order flipping) |
| Raw data | `raw-20261020-marks/` |

## Verdict

**No regressions over the thresholds.** The marks add 1.8 KB gzip to the start-up script; the board appears as fast as on
main, a tap paints its line as fast, and drags and Neon's turning rings (now with cores) keep every frame. One cost is
noted, not a regression: a reload into a crowded 6x6 game in Paper by day does about 86 ms more rendering work (CPU slowed
4x) during the lines' opening animation, because each pencil line is two animated strokes; the board itself appears no
later. A ghost stroke with `stroke-opacity` instead of `opacity` was tried and changed nothing measurable.

## Bundles

| Asset | main | branch | Delta | Status |
|---|---|---|---|---|
| Start-up script (raw / gzip) | 128,009 / 45,271 B | 133,507 / 47,113 B | +5,498 / +1,842 B (+4%) | OK |
| CSS (raw / gzip) | 46,094 / 10,197 B | 46,887 / 10,408 B | +793 / +211 B | OK |
| AI worker | 20,780 B | 20,780 B | 0 | OK |

## Game reloads (interleaved, medians)

| Scenario | main | branch | Paired difference | Status |
|---|---|---|---|---|
| 4x4 Tabletop at night, against the AI (person and bot), 10 rounds | ready 501 ms, LCP 996 | 469, 924 | ready +10 ms (branch slower in 5/10), LCP -16 | OK |
| 4x4 Dark Neon, 10 rounds | ready 527, LCP 632 | 524, 632 | ready +25 (6/10), LCP +52 | OK (noise level) |
| 6x6 Paper by day (pencil), 10 rounds, wall clock | ready 429, LCP 856 | 518, 972 | ready +38 (8/10), LCP +52 | see counters |
| 6x6 Paper by day, Chrome's counters, 6 rounds | ready 425; script 176, style 81, layout 144, all tasks 650 ms in the first 1.5 s; 188 board elements | 412; 172, 103, 158, 736; 246 | ready -13, script -4, style +22, layout +14, all +86 | OK: noted |

The wall-clock 6x6 runs swung widely on this machine (the same branch build measured 518 and 592 ms in two runs); Chrome's
counters are steadier and show the board ready and script time unchanged, with the extra work in style and layout (and
paint) while the lines animate in.

## Moves and drags

| Scenario | main | branch | Status |
|---|---|---|---|
| Tap to paint, 6x6 Paper by day (48 taps a build) | median 21.7 ms, p90 28.2 | 23.8, p90 26.6 (paired +3.4) | OK |
| Tap to paint, 4x4 Tabletop against the AI | 22.6, p90 28 | 22.2, p90 27.3 (paired 0) | OK |
| 12x12 Dark Neon at 1920x1080, 4 rounds: drag moves / held / growing frames over 25 ms | 33.3 ms (p95 45.8) / 0% / 12% | 33.4 (p95 38.9) / 0% / 11% | OK |
| 12x12 White Neon, 4 rounds | 33.3 (p95 35.1) / 0% / 23% | 33.4 (p95 34.9) / 0% / 22% | OK |
| 7x7 Neon on a phone, CPU 4x, 2 rounds (both modes) | drag 33.4, held 0%, growing 0% | the same | OK |

A first 2-round 12x12 run showed growing frames 9 → 12% and 19 → 24%; the 4-round rerun above did not repeat it.

## Performance budget (branch)

| Metric | Budget | Actual | Status |
|---|---|---|---|
| Start-up JS (gzip) | < 500 KB | 47.1 KB entry | PASS |
| CSS | < 100 KB | 46.9 KB raw | PASS |
| LCP (game reload, CPU 4x) | < 2.5 s | 0.63-0.97 s | PASS |
| Tap to paint | one or two frames | 22-24 ms median | PASS |

Grade: A.
