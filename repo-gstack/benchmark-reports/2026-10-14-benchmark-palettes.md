# Benchmark: the dark palettes PR (design/03-dark-palettes) vs main

| Field | Value |
|---|---|
| Date | 2026-10-13/14 |
| Builds | branch `bde5869` (dist `index-i8HDskhf.css`, `index-CfMbEBaV.js`) vs main `ba0e9a0` (scratch worktree build), served side by side by one plain static server per build (`serve-two.mjs`, Cache-Control max-age=600 like Pages) |
| Driver | gstack's playwright-core with headless Chromium; Firebase blocked; phone 390x844 at 2x with touch, CPU slowed 4x (unless noted) |
| Raw data | `raw-20261013-palettes/` (`ab.json`, `ab-neon-rerun.json`, `cd.json`, `gpu.json`, `gpu-fix1.json`, `gpu-final.json`, `drag-anim*.txt`, `final-abd.json`, `final-paper-rerun.json`) |

## Verdict

**No regressions on the final commit.** The first measurement found one real regression: Neon kept the GPU busy all the time with Animations on, and dropped frames during drags on big desktop boards. It was fixed in the branch (`404546e`, `bde5869`) and measured again. What remains are warnings: Neon's idle GPU time with Animations on (5-8% of a core in the software renderer, about 0 with Animations off), and a few slow frames as a move lands on a 12x12 board at 1920x1080 in software rendering. Texture bytes grow by 9-63 KB per page; page loads are flat.

## Bundles

| Asset | main | branch | Delta | Status |
|---|---|---|---|---|
| CSS | 39.64 kB (8.96 kB gzip) | 43.02 kB (9.74 kB gzip) | +0.78 kB gzip (+8.7%) | OK |
| JS (entry) | 134.86 kB (52.67 kB gzip) | 135.01 kB (52.72 kB gzip) | +0.05 kB gzip | OK |
| Texture tiles in the build | 66.8 KB (5 tiles) | 211.5 KB (5 tiles) | +144.7 KB | per page only the theme's own tiles load (below) |

Images a page loads: Tabletop by day 46.0 KB (main 24.1), at night 28.7 KB (23.0), a Tabletop game at night 61.9 KB (34.1; the felt tile is 33 KB); Paper by day 39.4 KB (4.2), at night 64.9 KB (4.4); Neon none. Total transfer per Home: +9 to +64 KB (+1% to +8%), under 0.9 MB everywhere.

## Page loads (final build, phone, CPU 4x; medians; 4 cold + 6 warm, Paper and Neon re-run with 6-8 cold)

| Scenario | Home ready cold, main → branch | warm | FCP warm | LCP cold | Status |
|---|---|---|---|---|---|
| Tabletop by day | 519 → 436 ms | 233 → 183 | 120 → 104 | 616 → 516 | OK |
| Tabletop at night | 390 → 380 | 196 → 183 | 96 → 100 | 464 → 460 | OK |
| Neon at night | 403 → 382 | 197 → 208 | 88 → 100 | 480 → 464 | OK |
| Neon by day | 413 → 427 | 192 → 211 | 92 → 104 | 500 → 532 | OK |
| Paper by day (8 cold) | 478 → 491 | 247 → 218 | 120 → 112 | 608 → 636 | OK |
| Paper at night (8 cold) | 409 → 392 | 204 → 209 | 104 → 112 | 532 → 508 | OK |
| Game reload, Tabletop at night (board ready) | 482 → 449 | 226 → 246 | 116 → 128 | 572 → 540 | OK |
| Game reload, Neon at night (board ready) | 511 → 505 | 266 → 264 | 112 → 120 | 592 → 620 | OK |

Cold medians swing by tens of ms between identical builds; the first pass flagged Neon at night (+82 and +118 ms cold) and Paper by day (+127 ms cold), and both came back flat with more samples. Before the fixes, Neon's first paint was about 30 ms later (warm FCP 120 vs 92); on the final build it is 8-12 ms.

## Move to paint (a tap on a line to the next painted frame; 16 moves; phone, CPU 4x)

| Board | main | branch |
|---|---|---|
| Tabletop at night | 28.1 ms median, 30.7 p95 | 29.3, 32.0 |
| Neon at night | 27.9, 30.6 | 27.5, 28.6 |

## Frames

### Idle, with Animations on (3 s of frame intervals, phone, CPU 4x)

Main-thread frames: 16.7 ms median and p95 everywhere, on both builds, Home and game, Neon and Tabletop. The aurora's drift runs on the compositor, so the main thread never sees it; its cost shows in the GPU process (next).

### GPU process time while idle (5 s, share of one core, median of 3; headless Chromium draws with a software GPU, so this is an upper bound for a phone)

| Page | main | branch first build | after `404546e` | final `bde5869` |
|---|---|---|---|---|
| Neon at night, Home | 1.6-1.8% | **38.1%** | 6.9% | 8.0% |
| Neon at night, game | 0.1% | **70.6%** | 6.6% | 6.1% |
| Neon by day, Home | 1.4% | **30.3%** | 5.5% | 5.5% |
| Neon by day, game | 0.1% | **61.6%** | 6.0% | 4.8% |
| Neon at night, Animations off | 0-0.1% | 0-0.8% | | 0-0.3% |
| Tabletop at night | 0.1-1.4% | 0.1-1.2% | | 0.1-1.1% |

Cause (first build): the three aurora lights were blurred (`filter: blur(70px)`) again on every frame, and the glass board and cards re-blurred the moving light behind them on every frame. Fix `404546e`: each light is a soft radial gradient (no filter), and the lights move four times a second, in steps of under a pixel on a phone, with the drift's ease kept in the keyframes. Same look (screenshots compared).

### Dragging (`drag-anim-perf.mjs`: 30 pointer moves each timed to the next painted frame, 1.5 s held with the rings turning, then a let-go; 4 presses; Animations on)

| Board | main | branch first build | final `bde5869` |
|---|---|---|---|
| 12x12 at 1920x1080, Neon at night: moves | 33.3 ms median, 34.5 p95 | **59.6, 95.6** | 33.3, 44.4 (max 75) |
| same: frames while held | p95 16.7, 0 of 364 over 25 ms | **p95 50, 134 of 206 over 25 ms** | p95 16.8, 0 of 364 |
| same: let-go frames | p95 16.8 | p95 50 | p95 33.3 (max 50) |
| 12x12 at 1920x1080, Tabletop by day | 33.3, 34.5; 0 over 25 ms | same | 33.3, 34.5; 0 over 25 ms |
| 7x7 phone CPU 4x, Neon at night and Tabletop by day | 33.2, 35; 0 over 25 ms | 33.1, 35.5; 0 | 33.2, 35.8; 0 |

Cause, isolated by variants: (1) the board's backdrop blur was redone on every frame of the drag because the board changes under it (blur and pause: 154 of 203 frames over 25 ms; colour boost only and pause: 0 of 364); (2) each aurora step redraws the whole screen (aurora frozen: 0 of 364). Fix `bde5869`: the board keeps only the colour boost (`saturate(1.5)`, no blur; the aurora behind it is already soft, so the blur showed nothing), and the aurora holds still while a drag's band is out (`html:has(#board .drag)`).

## Budget check (final build)

| Metric | Budget | Actual (worst page) | Status |
|---|---|---|---|
| FCP | < 1.8 s | 0.29 s cold | PASS |
| LCP | < 2.5 s | 0.64 s cold | PASS |
| Total JS | < 500 KB | 135 KB (52.7 KB gzip) | PASS |
| Total CSS | < 100 KB | 43 KB | PASS |
| Total transfer | < 2 MB | 0.88 MB | PASS |

Grade: A.

## Warnings to watch

1. Neon with Animations on keeps the GPU lightly busy (5-8% of a core here, in software; a phone's GPU does this work cheaply). Animations off brings it to about 0.
2. On a 12x12 board at 1920x1080 in software rendering, a few frames reach 33-50 ms as a move lands or the band springs home in Neon at night. Phones and normal boards are unaffected.
3. Not measured: a real phone and the owner's Brave with its GPU.
