# Benchmark: feat/springy-drag vs main

| Field | Value |
|---|---|
| Date | 2026-10-13 |
| Branch | feat/springy-drag at 973177e (the elastic drag and the landing rings, with the two design-review fixes) |
| Base | main at af69571, built in a scratch worktree |
| Serving | Both production builds served by one plain static server each (`serve-two.mjs`: no compression, `Cache-Control: max-age=600` like GitHub Pages), only while each measurement ran |
| Browser | gstack's headless Chromium 151 through playwright-core 1.62.1 (Aside is macOS-only); Firebase hosts blocked |
| Passes | Drag: 4 presses per board, theme and build, Animations on, three runs of the phone rows. Page loads: 2 cold + 10 warm per scenario and build, flagged rows re-run with 6 and then 12 cold loads. Move-to-paint: 30 moves per theme and board |
| Raw data | `raw-20261013-springy/`: `drag-frames.txt`, `drag-frames-phone-rerun.txt`, `pageload.json`, `pageload-rerun.json`, `pageload-cold12.json`, `move-to-paint.txt`, `sizes.json` |

## Verdict

**No regressions.** The elastic band and the turning rings cost 0.95 KB of gzipped JavaScript and 59 bytes of gzipped CSS. With Animations on, a drag still repaints on every pointer move within the two-frame floor, holding a drag still with the rings turning delivers frames every 16.7 ms like main, and the band springing home misses no frame. Page loads and move-to-paint are unchanged; the one flagged reading was 88 → 88 ms over 12 cold loads.

## Dragging with Animations on

Each press: 30 pointer moves along and across (each timed to the next painted frame), then 1.5 s held still, then a let-go. On the branch the band springs and three rings turn (the fourth gives way to the snapped line); on main the press preview follows the pointer.

| Board and theme | Moves, median / p95 / max (main → branch) | Held still: frame p95, frames over 25 ms (main → branch) | Let go: frame p95 |
|---|---|---|---|
| 12x12 desktop, Tabletop by day | 33.3 / 34.3 / 35 → 33.3 / 34.4 / 35 ms | 16.8 ms, 0 of 364 → 16.7 ms, 0 of 364 | 16.8 → 16.8 ms |
| 12x12 desktop, Neon at night | 33.3 / 34.7 / 36 → 33.3 / 34.6 / 36 ms | 16.7 ms, 0 → 16.8 ms, 0 | 16.7 → 16.7 ms |
| 7x7 phone, CPU 4x, Tabletop by day | 33.1 / 34.4 / 35 → 33.2 / 35.2 / 39 ms | 16.8 ms, 0 → 16.8 ms, 0 | 16.7 → 16.7 ms |
| 7x7 phone, CPU 4x, Neon at night | 33.2 / 34.4 / 38 → 33.3 / 35.1 / 37 ms | 16.7 ms, 0 → 16.8 ms, 1 of 362 (50 ms) | 16.7 → 16.8 ms |

The band was on screen after all 120 moves in every row. Two more runs of the phone rows: single frames over 25 ms appeared on both builds (main once, 33 ms; the branch twice in Neon at night, 50 and 83 ms; none in the last run), about one in 360 frames, and every frame p95 stayed 16.7-16.8 ms. Move p95 on the phone is within about 1 ms of main.

## Page loads (medians, ms; bytes uncompressed as served locally)

| Scenario | FCP main → branch (cold / warm) | LCP main → branch (cold / warm) | Ready main → branch (cold / warm) | Transfer main → branch |
|---|---|---|---|---|
| Home, Tabletop by day | 72 → 88 / 60 → 60 (*) | 484 → 480 / 432 → 440 | 99 → 99 / 66 → 70 | 760.5 → 762.9 KB |
| Home, Tabletop at night | 84 → 84 / 64 → 64 | 460 → 464 / 440 → 440 | 93 → 96 / 68 → 69 | 759.4 → 761.8 KB |
| Home, Neon at night | 64 → 64 / 52 → 48 | 468 → 460 / 444 → 440 | 100 → 92 / 79 → 68 | 785.0 → 787.3 KB |
| Home, Neon by day | 68 → 72 / 48 → 48 | 464 → 476 / 444 → 444 | 103 → 102 / 73 → 76 | 785.0 → 787.3 KB |
| Home, Paper by day | 68 → 92 / 68 → 72 (*) | 156 → 176 / 456 → 452 | 99 → 109 / 76 → 75 | 793.3 → 795.7 KB |
| Home, Paper at night | 72 → 64 / 68 → 68 | 184 → 156 / 456 → 444 | 115 → 92 / 70 → 70 | 793.5 → 795.9 KB |
| Game reload, Tabletop by day | 88 → 84 / 64 → 64 | 492 → 492 / 452 → 448 | 107 → 104 / 78 → 76 | 787.1 → 789.5 KB |
| Game reload, Neon at night | 72 → 76 / 56 → 60 | 180 → 188 / 152 → 156 | 112 → 111 / 81 → 81 | 800.5 → 802.9 KB |

CLS 0.025 on both builds everywhere; requests unchanged.

**(*) Re-runs:** with 6 cold and 30 warm loads, Paper by day was 88 → 88 ms cold FCP; Tabletop by day stayed 72 → 88 ms, but its single loads overlapped (main 68-96 ms plus a 1,156 ms browser-start outlier, branch 80-96 ms). With 12 cold loads each it was **88 → 88 ms** (main [88, 92, 72, 88, 132, 84, 100, 72, 104, 100, 88] after the start-up outlier, branch [116, 88, 80, 88, 76, 92, 100, 72, 96, 96, 80, 96]). Noise.

## Move-to-paint (Animations off, synthetic moves)

| Board | Main (median / p95) | Branch (median / p95) |
|---|---|---|
| 12x12 at 1920x1080, six modes | 33 / 34 ms | 33 / 34-35 ms (one 136 ms move in Tabletop at night) |
| 7x7 phone, CPU 4x, six modes | 31-32 / 33-34 ms (one run 44 ms p95 in Paper at night) | 31-32 / 33-34 ms |

## Bundle sizes (production build, gzip -9)

| File | Main | Branch | Change |
|---|---|---|---|
| `index` chunk | 129.6 KB (50.0 KB gz) | 131.7 KB (51.0 KB gz) | +2,197 B raw, +969 B gz (+1.9%): the springs, the band path, the landing rings |
| All JS | 815.4 KB (254.8 KB gz) | 817.5 KB (255.7 KB gz) | +0.4% |
| CSS | 38.5 KB (8.6 KB gz) | 38.7 KB (8.7 KB gz) | +243 B raw, +59 B gz (+0.7%): the ring styles and the band's width transition |

## Budget check (branch)

| Metric | Budget | Actual | Status |
|---|---|---|---|
| FCP | < 1.8 s | 48-92 ms | PASS |
| LCP | < 2.5 s | 156-492 ms | PASS |
| JS on Home (decoded) | < 500 KB | 686 KB (main 684 KB: the Firebase SDK the app loads for sign-in) | FAIL, unchanged from main |
| CSS | < 100 KB | 38.7 KB | PASS |
| Transfer | < 2 MB | 762-803 KB | PASS |
| Requests | < 50 | 8-11 | PASS |

Grade: **B** (5 of 6), the same as main.

## Limits

- Local loopback, headless Chromium on this PC; CDP's CPU throttling slows the main thread only, so a real low-end phone's raster cost for the turning rings isn't modelled.
- The drag probe dispatches pointer events in the page; it times the app's work and the next frame, not the input pipeline.
