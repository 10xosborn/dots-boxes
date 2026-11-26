# Benchmark: feat/drag-to-draw vs main

| Field | Value |
|---|---|
| Date | 2026-10-13 |
| Branch | feat/drag-to-draw at 7ff79a2 (draw a line by dragging from dot to dot, with sounds; docs; the wider ring under a finger) |
| Base | main at 3eb4981, built in a scratch worktree |
| Serving | Both production builds served by one plain static server each (`serve-two.mjs`: no compression, `Cache-Control: max-age=600` like GitHub Pages), only while each measurement ran; no background servers |
| Browser | gstack's headless Chromium 151.0.7922.34 through playwright-core 1.62.1, 1280x800 unless noted; Firebase hosts blocked (local adapter), so nothing reached production |
| Passes | Page loads: per scenario and build, 2 cold loads and 10 warm reloads, the builds alternating order between rounds; medians reported; the noisy rows re-run with 4-6 cold loads and up to 32 warm. Move-to-paint: 30 moves per theme and board. Drag: 6 presses of 30 pointer moves per theme and board |
| Raw data | `raw-20261013-drag/`: `pageload.json`, `pageload-reload-rerun.json`, `pageload-home-table-cold-rerun.json`, `move-to-paint.txt`, `drag-frames.txt`, `sizes.json` |

## Verdict

**No regressions.** Dragging costs 0.95 KB of gzipped JavaScript and 58 bytes of gzipped CSS. Page loads are unchanged within noise. A move still paints on the next frame. A drag repaints on every pointer move without missing a frame, the same as main's press preview, on a 12x12 board and on a phone slowed 4x. Three readings looked worse in the first pass (two cold first paints and one warm reload). All three came back flat when re-run with more passes (below).

## Dragging (new): time from each pointer move to the next painted frame

On the branch, a press on a dot followed by 30 moves towards its neighbour: the thin line follows the pointer, then snaps to the full line inside its ring at 45% of the gap. On main, the same moves during a press repaint the dotted press preview. The check also counted, after each move, whether that line was on screen.

| Board and theme | Main, press preview (median / p95 / max) | Branch, drag (median / p95 / max) | Branch: line on screen / snapped (of 180 moves) |
|---|---|---|---|
| 12x12 at 1920x1080, Tabletop by day | 33 / 34 / 35 ms | 33 / 35 / 66 ms | 162 / 96 |
| 12x12 at 1920x1080, Neon at night | 33 / 34 / 35 ms | 33 / 34 / 35 ms | 162 / 96 |
| 7x7 on a 390x844 phone, CPU 4x, Tabletop by day | 33 / 35 / 36 ms | 33 / 35 / 36 ms | 165 / 108 |
| 7x7 on a 390x844 phone, CPU 4x, Neon at night | 33 / 35 / 36 ms | 33 / 35 / 35 ms | 165 / 108 |

Main showed its preview after all 180 moves in every row. On the branch the first three moves of a press stay under the 12% start distance and draw nothing, and the line snaps from move 15. Six presses therefore give 6 x 27 = 162 shown and 6 x 16 = 96 snapped. On the phone, one press started on the last dot of a row and swept left along it (the probe moves sideways only). Its line showed on all 30 moves and snapped from move 3, which gives 165 and 108. Every median is the measurement's floor (two animation frames at 60 Hz). The same probe ran three times; medians and p95s matched each time. Single slow frames turned up on both builds across the runs (main 99 and 160 ms, branch 47 and 66 ms) and never repeated.

## Page loads (medians, ms; bytes uncompressed as served locally)

| Scenario | FCP main → branch (cold / warm) | LCP main → branch (cold / warm) | Ready main → branch (cold / warm) | Transfer main → branch |
|---|---|---|---|---|
| Home, Tabletop by day | 76 → 100 / 68 → 68 (*) | 480 → 480 / 444 → 440 | 111 → 110 / 76 → 70 | 756.8 → 759.5 KB |
| Home, Tabletop at night | 88 → 88 / 64 → 60 | 468 → 464 / 444 → 444 | 103 → 97 / 70 → 69 | 755.7 → 758.4 KB |
| Home, Neon at night | 72 → 72 / 52 → 52 | 468 → 472 / 448 → 444 | 104 → 98 / 75 → 75 | 781.2 → 784.0 KB |
| Home, Neon by day | 72 → 68 / 48 → 48 | 472 → 476 / 444 → 444 | 104 → 114 / 71 → 72 | 781.2 → 784.0 KB |
| Home, Paper by day | 96 → 68 / 64 → 64 | 180 → 160 / 452 → 440 | 125 → 101 / 70 → 68 | 789.6 → 792.3 KB |
| Home, Paper at night | 92 → 92 / 64 → 68 | 180 → 172 / 456 → 464 | 113 → 115 / 72 → 71 | 789.8 → 792.5 KB |
| Game reload, Tabletop by day | 80 → 84 / 68 → 64 | 208 → 196 / 464 → 460 | 109 → 117 / 78 → 78 | 783.4 → 786.2 KB |
| Game reload, Neon at night | 64 → 80 / 52 → 56 (**) | 172 → 184 / 160 → 176 | 106 → 114 / 80 → 92 (**) | 796.8 → 799.5 KB |

"Ready" is when Home's Play button or the game board is in the page. CLS is 0.025 in every scenario on both builds (unchanged). TTFB is 1 ms (local). Requests are unchanged: 8 on Home (11 on Paper), 10 on the Tabletop game, 9 on the Neon game. Every page carries the same +2.7 KB (uncompressed): the bigger `index` chunk and stylesheet.

**Re-runs of the rows that crossed a threshold:**

| Scenario | Passes | FCP (cold / warm) | LCP (cold / warm) | Ready (cold / warm) |
|---|---|---|---|---|
| (*) Home, Tabletop by day | 6 cold, 6 warm | 88 → 92 / 64 → 64 | 472 → 476 / 444 → 444 | 100 → 111 / 72 → 72 |
| Game reload, Tabletop by day | 4 cold, 32 warm | 88 → 88 / 64 → 64 | 492 → 484 / 460 → 456 | 116 → 111 / 81 → 79 |
| (**) Game reload, Neon at night | 4 cold, 32 warm | 72 → 72 / 56 → 52 | 148 → 148 / 116 → 116 | 115 → 105 / 82 → 81 |

The first pass's cold first paints rest on 2 loads each and moved both ways: Tabletop by day +24 ms, Paper by day -28 ms. With more loads the differences fall to 0-4 ms. The Neon reload's warm ready (80 → 92 ms) was noise too: 82 → 81 ms over 32 warm reloads each.

## Move-to-paint (time from a move to the next painted frame)

Pass-and-play, so every click is a move: a press and release on a line's middle (where a tap still draws on the branch). Median and p95 of 30 moves per theme and board.

| Board | Main (median / p95) | Branch (median / p95) |
|---|---|---|
| 12x12 at 1920x1080, six modes | 33 / 34 ms | 33 / 34-35 ms |
| 7x7 on a 390x844 phone, CPU slowed 4x, six modes | 31-32 / 33-34 ms | 32 / 33-36 ms |

Both builds sit on the two-frame floor in every theme, and all 30 moves drew a line on both. With 30 moves, p95 is the second-slowest move, so one slow frame moves it. The branch's 36 ms p95 is Paper at night, with one 46 ms move; one 73 ms move on the 12x12 board in Tabletop at night was its maximum. CDP's CPU throttling slows the main thread only, so a real low-end phone's raster cost isn't modelled here.

## Bundle sizes (production build, gzip -9)

| File | Main | Branch | Change |
|---|---|---|---|
| `index` chunk | 126.0 KB (48.7 KB gz) | 128.6 KB (49.7 KB gz) | +2,632 B raw, +971 B gz (+1.9%): the gesture (pick-up, snap, cancel, the tap-near-a-dot rule), the drag line, both rings and three new tones |
| Start-up JS (`index` + `app`) | 225.6 KB (78.9 KB gz) | 228.2 KB (79.9 KB gz) | +0.95 KB gz (+1.2%) |
| All JS | 811.8 KB (253.5 KB gz) | 814.4 KB (254.4 KB gz) | +0.95 KB gz (+0.4%); the other chunks are the same size (the `app` chunk's hash changes only because it names the new `index` file) |
| CSS | 38.3 KB (8.5 KB gz) | 38.5 KB (8.6 KB gz) | +157 B raw, +58 B gz (+0.7%): the drag line, preview and ring colours, the grab cursors |
| Images, fonts | unchanged | unchanged | none |

Vite's own build report gives the `index` chunk as 129.01 → 131.64 kB (50.36 → 51.35 kB gzip); the table above uses gzip -9 and KiB.

## Budget check (branch)

| Metric | Budget | Actual | Status |
|---|---|---|---|
| FCP | < 1.8 s | 48-100 ms | PASS |
| LCP | < 2.5 s | 116-484 ms | PASS |
| JS on Home (decoded) | < 500 KB | 684 KB (main 681 KB: the Firebase SDK the app loads for sign-in) | FAIL, unchanged from main |
| CSS | < 100 KB | 38.5 KB | PASS |
| Transfer | < 2 MB | 758-800 KB | PASS |
| Requests | < 50 | 8-11 | PASS |

Grade: **B** (5 of 6), the same as main; the one failure is pre-existing.

## Thresholds applied

| Flag in the first pass | Where | Outcome |
|---|---|---|
| Cold FCP +32% (warning) | Home, Tabletop by day | 2 cold loads; with 6: 88 → 92 ms (+5%), warm unchanged |
| Cold FCP +25% (warning) | Game reload, Neon at night | 2 cold loads; with 4: 72 → 72 ms |
| Warm ready +15% (under the 20% warning line, re-run anyway) | Game reload, Neon at night | 82 → 81 ms over 32 warm reloads |

No bundle change crosses the 10% warning line.

## Limits

- Local loopback: no network latency or compression, so transfer numbers are uncompressed sizes and timings show render cost, not download time.
- Headless Chromium on this PC (low memory: 1.0 GB of 7.4 GB free after the runs); no real phone, no Brave.
- The drag and move probes send pointer events from inside the page, so they time the app's work and the next frame, not the browser's input pipeline or a touchscreen's sampling.
- Sound plays through Web Audio in the drag probe (its oscillators are part of the measured work); not listened to.
