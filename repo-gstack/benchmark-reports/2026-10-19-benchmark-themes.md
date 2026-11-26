# Benchmark: the four restyled theme modes (design/05-four-modes) vs main

| Field | Value |
|---|---|
| Dates | 2026-10-15 (calm machine) and 2026-10-19 (machine 75-87% busy with Windows background work, 0.5 GB free memory) |
| Builds | branch `6aaf438` (final; earlier runs on `8659ce4`, before the layer trim below) vs main `cff945c`, served side by side by `serve-two.mjs` |
| Driver | gstack's playwright-core, headless Chromium, Firebase blocked, phone 390x844 at 2x with the CPU slowed 4x |
| Raw data | scratchpad `bench4/` (loads.txt, reload2.txt, reload-ab.txt, reload-ab-final.txt) |

## Verdict

**No regression on the final build for loads, and the night textures are smaller; GPU and 12x12 frame cost not measured
(stopped for low memory).** The first game-reload measurement found the board appearing 8-14% later in all four modes:
the board built Neon's glow, reflection and glass-tile shapes in every mode, hidden. The branch now builds them only in
Neon (reflections and node glow only in Dark Neon); after that, Tabletop and Paper at night are flat or faster than main,
White Neon flat, Dark Neon +3% (its real glow layers).

## Bundles (gzip, level 9)

| Asset | main | branch | Delta |
|---|---|---|---|
| Start-up script | 51.43 KB | 52.82 KB (+0.26 after the trim, per Vite) | +1.4-1.7 KB (+3%), OK |
| CSS | 9.40 KB | 9.93 KB | +0.53 KB (+5.6%), OK |
| Tabletop at night textures | wood-night 28.0 + felt 32.5 KB | grain 20.3 KB | -40 KB |
| Paper at night texture | paper-night 63.4 KB | cardstock 37.3 KB | -26 KB |
| Neon textures | none | none | 0 |

## Page loads (2026-10-15, calm machine, build `8659ce4`; medians of 4 cold and 6 warm loads, ms)

| Home | ready cold main → branch | warm | bytes |
|---|---|---|---|
| Tabletop at night | 652 → 566 | 310 → 297 | 790 → 791 KB (texture 28.7 → 20.8 KB) |
| Cozy Paper at night | 439 → 431 | 281 → 280 | 880 → 862 KB |
| Dark Neon | 570 → 569 | 310 → 320 | 811 → 819 KB |
| White Neon | 552 → 568 | 292 → 369 (warm noise, see below) | 811 → 819 KB |
| Tabletop and Paper by day | 697 → 664, 553 → 473 | 345 → 326, 276 → 268 | +8 KB (the start-up script) |

## Game reload (the board's dots in the page), interleaved A/B, 15 rounds per mode (2026-10-19, busy machine)

The machine was 75-87% busy, so plain medians were unusable (a second plain run contradicted the first scenario by
scenario); main and branch alternated load by load instead, so the load hits both alike. Absolute times are about three
times the calm ones; the paired difference is the signal.

| Mode | before the trim (`8659ce4`): paired diff, rounds slower | final (`6aaf438`) |
|---|---|---|
| Tabletop at night | +210 ms, 10/15 | **-37 ms, 7/15** |
| Cozy Paper at night | +166 ms, 10/15 | **-67 ms, 6/15** |
| Dark Neon | +161 ms, 9/15 | **+40 ms (+3%), 10/15** |
| White Neon | +124 ms, 13/15 | **-53 ms, 6/15** |

LCP paired differences on the final build: -56, -76, -12 and -104 ms.

## Idle frames and move to paint (2026-10-15, calm machine, build `8659ce4`)

- Idle frames with Animations on, Home and game, Dark Neon, White Neon, Tabletop and Paper at night, and Dark Neon with
  Animations off: 16.7 ms median and p95 everywhere, 0 frames over 25 ms, main and branch alike.
- Move to paint (a tap to the next painted frame, 16 moves, 4x4): medians main → branch 27.8 → 28.2 (Tabletop at night),
  28.2 → 29.2 (Paper), 29.4 → 27.7 (Dark Neon), 26.8 → 29.3 ms (White Neon); p95 is the slowest of 16 and noisy.

## Not measured

- **Neon's GPU cost at idle** (`bench-gpu.mjs`): stopped by Claude Code on 2026-10-19 because the machine was critically low
  on memory (0.5 GB free); not a failure of the run. By construction the Neon board has no backdrop-filter and no blur
  (main had `backdrop-filter: saturate(1.5)` on the board and blurred line, dot and box groups), so it should cost less, but
  that is not measured.
- **Drag and line-grow frames on a crowded 12x12 board at 1920x1080 and 7x7 on a slowed phone** (`frames-ab.mjs`, written,
  interleaved): not run for the same reason.

## Performance budget (branch)

| Metric | Budget | Actual | Status |
|---|---|---|---|
| FCP | < 1.8 s | 0.30 s cold (calm run) | PASS |
| LCP | < 2.5 s | 0.68 s cold (calm run) | PASS |
| Start-up JS (gzip) | < 500 KB | 85 KB (entry 54.8 + app 31) | PASS |
| CSS | < 100 KB | 45 KB raw, 10 KB gzip | PASS |
| Transfer | < 2 MB | 0.79-0.86 MB | PASS |
| Requests | < 50 | under 30 | PASS |

Grade: A (6/6). Status: DONE_WITH_CONCERNS (GPU and 12x12 frames not measured).
