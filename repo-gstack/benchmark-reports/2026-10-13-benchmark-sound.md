# Benchmark: fix/sound-start-and-volume vs main

| Field | Value |
|---|---|
| Date | 2026-10-13 |
| Branch | fix/sound-start-and-volume at af35e85 (the audio engine starts in the first click or tap; louder sounds through a limiter; a chime when Sound is switched on) |
| Base | main at 3521b1b, built in a scratch worktree |
| Serving | Both production builds served by one plain static server each (`serve-two.mjs`: no compression, `Cache-Control: max-age=600` like GitHub Pages), only while each measurement ran; no background servers |
| Browser | gstack's headless Chromium 151 through playwright-core 1.62.1 (Aside is macOS-only); Firebase hosts blocked, so nothing reached production; the Sound-on run uses Chrome's autoplay rule (`--autoplay-policy=document-user-activation-required`) |
| Passes | Page loads: per scenario and build, 2 cold loads and 10 warm reloads, the builds alternating order between rounds; the flagged rows re-run with 6 cold and 30 warm. Move-to-paint: 30 moves per theme and board, with Sound off (synthetic events, as in earlier benchmarks) and with Sound on (real clicks and taps) |
| Raw data | `raw-20261013-sound/`: `pageload.json`, `pageload-rerun.json`, `move-to-paint.txt`, `sizes.json` |

## Verdict

**No regressions.** The fix costs 351 bytes of gzipped JavaScript and no CSS. Page loads are unchanged; three first-pass readings came back flat when re-run with more loads. With Sound on and real input, a move paints as fast as on main or faster, and the branch starts every note while the audio engine is running (60 of 60), where main started only 24 to 29 of 30 because its first moves' notes went to a paused engine.

## Page loads (medians, ms; bytes uncompressed as served locally)

| Scenario | FCP main → branch (cold / warm) | LCP main → branch (cold / warm) | Ready main → branch (cold / warm) | Transfer main → branch |
|---|---|---|---|---|
| Home, Tabletop by day | 92 → 100 / 64 → 72 (*) | 472 → 484 / 456 → 464 | 97 → 112 / 79 → 87 (*) | 759.5 → 760.5 KB |
| Home, Tabletop at night | 84 → 100 / 72 → 72 (*) | 496 → 472 / 456 → 476 | 117 → 110 / 86 → 86 | 758.4 → 759.4 KB |
| Home, Neon at night | 72 → 80 / 60 → 52 | 480 → 476 / 464 → 456 | 109 → 115 / 85 → 83 | 784.0 → 785.0 KB |
| Home, Neon by day | 80 → 76 / 48 → 48 | 476 → 492 / 448 → 460 | 114 → 114 / 80 → 80 | 784.0 → 785.0 KB |
| Home, Paper by day | 84 → 80 / 72 → 72 | 188 → 184 / 456 → 456 | 115 → 114 / 99 → 94 | 792.3 → 793.3 KB |
| Home, Paper at night | 72 → 92 / 72 → 76 (*) | 168 → 188 / 456 → 476 | 105 → 123 / 79 → 83 | 792.5 → 793.5 KB |
| Game reload, Tabletop by day | 96 → 80 / 68 → 72 | 512 → 492 / 456 → 468 | 124 → 119 / 83 → 88 | 786.2 → 787.1 KB |
| Game reload, Neon at night | 72 → 72 / 56 → 60 | 148 → 152 / 124 → 120 | 111 → 111 / 88 → 85 | 799.5 → 800.5 KB |

"Ready" is when Home's Play button or the game board is in the page. CLS 0.025 on both builds in every scenario; TTFB 1 ms (local); requests unchanged (8 on Home, 11 on Paper, 10 and 9 on the game reloads). Every page carries the same +1 KB (uncompressed): the larger `index` chunk.

**(*) Re-run with 6 cold loads and 30 warm reloads per build:**

| Scenario | FCP (cold / warm) | LCP (cold / warm) | Ready (cold / warm) |
|---|---|---|---|
| Home, Tabletop by day | 88 → 88 / 64 → 64 | 472 → 464 / 440 → 444 | 99 → 98 / 71 → 72 |
| Home, Tabletop at night | 88 → 88 / 64 → 60 | 480 → 472 / 444 → 440 | 105 → 104 / 70 → 72 |
| Home, Paper at night | 100 → 92 / 72 → 72 | 188 → 184 / 456 → 460 | 113 → 111 / 73 → 72 |

The first pass's cold readings rest on 2 loads each and moved both ways (Paper at night +20 ms, the Tabletop game reload -16 ms). With more loads every difference is 4 ms or less.

## Move-to-paint

**Sound off** (synthetic pointer events, as in earlier benchmarks; median / p95 of 30 moves):

| Board | Main | Branch |
|---|---|---|
| 12x12 at 1920x1080, six modes | 33 / 34 ms (one run 389 ms p95 in Paper by day) | 33 / 34 ms |
| 7x7 on a 390x844 phone, CPU 4x, six modes | 31-32 / 33 ms | 31-32 / 33-34 ms (one run 47 ms p95 in Tabletop by day) |

Both on the two-frame floor; the single slow runs are one-off frames on either build and didn't repeat in the other modes.

**Sound on, real input** (timed in the page from each pointerup to the next painted frame, so the medians sit below the synthetic two-frame floor):

| Board and theme | Main (median / p95 / max) | Branch (median / p95 / max) | Notes started while running, main → branch |
|---|---|---|---|
| 12x12 desktop, mouse clicks, Tabletop by day | 12 / 35 / 46 ms | 9 / 17 / 20 ms | 24 → 60 |
| 12x12 desktop, mouse clicks, Neon at night | 11 / 17 / 18 ms | 11 / 17 / 18 ms | 29 → 60 |
| 7x7 phone, touch taps, CPU 4x, Tabletop by day | 28 / 41 / 43 ms | 27 / 31 / 49 ms | 29 → 60 |
| 7x7 phone, touch taps, CPU 4x, Neon at night | 28 / 32 / 37 ms | 28 / 31 / 31 ms | 29 → 60 |

All 30 moves drew a line in every row. The branch plays two notes per move (the line and its quiet octave), all 60 with the engine running; main plays one per move and lost the first 1 to 6 to an engine that was still paused.

## Bundle sizes (production build, gzip -9)

| File | Main | Branch | Change |
|---|---|---|---|
| `index` chunk | 128.6 KB (49.7 KB gz) | 129.6 KB (50.0 KB gz) | +1,014 B raw, +351 B gz (+0.7%): the engine set-up, the gesture listeners, the limiter and the louder note table |
| Start-up JS (`index` + `app`) | 79.9 KB gz | 80.2 KB gz | +0.4% |
| All JS | 814.4 KB (254.4 KB gz) | 815.4 KB (254.8 KB gz) | +0.1% |
| CSS, images, fonts | unchanged | unchanged | none |

## Budget check (branch)

| Metric | Budget | Actual | Status |
|---|---|---|---|
| FCP | < 1.8 s | 48-100 ms | PASS |
| LCP | < 2.5 s | 120-492 ms | PASS |
| JS on Home (decoded) | < 500 KB | 684 KB (main 683 KB: the Firebase SDK the app loads for sign-in) | FAIL, unchanged from main |
| CSS | < 100 KB | 38.5 KB | PASS |
| Transfer | < 2 MB | 759-801 KB | PASS |
| Requests | < 50 | 8-11 | PASS |

Grade: **B** (5 of 6), the same as main; the one failure is pre-existing.

## Thresholds applied

| Flag in the first pass | Where | Outcome |
|---|---|---|
| Cold FCP +28% (warning) | Home, Paper at night | 2 cold loads; with 6: 100 → 92 ms |
| Cold FCP +19%, warm FCP +12% and warm ready +10% (under the 20% line, re-run anyway) | Home, Tabletop by day and at night | with 6 cold and 30 warm: within 4 ms |

No bundle change crosses the 10% warning line.

## Limits

- Local loopback: no network latency or compression; timings show render cost, not download time.
- Headless Chromium on this PC (low memory); no real phone or speakers.
- The Sound-on timings start at the page's pointerup, not at the hardware event; they compare the two builds under identical input, they aren't absolute input latency.
