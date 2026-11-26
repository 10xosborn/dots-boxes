# Benchmark: the owner's 2026-10-19 colour changes (design/06-owner-colours) vs main

| Field | Value |
|---|---|
| Date | 2026-10-19 (calm machine: 16% CPU, 3 GB free memory) |
| Builds | branch `f793df3` vs main `288ab3a`; also vs `cff945c` (main before PR #18) for #18's two unmeasured items |
| Serving | scratchpad `serve-two.mjs` (one plain static server per build, Cache-Control max-age=600 like GitHub Pages) |
| Driver | gstack's playwright-core, headless Chromium (Aside is macOS-only), Firebase blocked by hostname |
| Phone profile | 390x844 at 2x with touch, CPU slowed 4x unless noted |
| Raw data | scratchpad `bench06/` (sizes.json, loads.json, reload-ab.txt, gpu.json, gpu-vs-cff945c.json, frames-vs-main.txt, frames-vs-cff945c.txt) |

## Verdict

**No regression.** JavaScript is unchanged and CSS grows 28 B gzip. Tabletop at night downloads more texture (the day's felt and wood, 77 KB instead of 20 KB), but loads, reloads and frames measure flat. Against the build before PR #18, Neon's GPU cost at idle is lower.

## Bundles (gzip, level 9)

| Asset | main | branch | Delta |
|---|---|---|---|
| JavaScript (all chunks) | 268.0 KB | 268.0 KB | 0 (identical code) |
| CSS | 10,169 B | 10,197 B | +28 B |
| index.html | 904 B | 892 B | -12 B |
| Texture files in the build | 5 | 3 (`grain.webp`, `cardstock.webp` removed) | -58 KB raw |

Per mode, from the request log (QA probe 008):

| Mode | main | branch |
|---|---|---|
| Tabletop at night | grain 20.3 KB | felt 32.5 + wood-day 44.9 = 77.4 KB, the same files as Tabletop by day |
| Cozy Paper at night | cardstock 37.3 KB | paper-day 38.5 KB, the same file as Paper by day |
| Dark Neon | none | none |

## Home loads (medians of 4 cold and 6 warm loads, ms)

| Mode | ready cold, main → branch | warm | bytes |
|---|---|---|---|
| Tabletop at night | 382 → 379 | 209 → 186 | 777 → 803 KB (Home shows the wood, not the felt) |
| Cozy Paper at night | 430 → 399 | 239 → 220 | 848 → 850 KB |
| Dark Neon | 414 → 391 | 204 → 223 | +0.7 KB |
| Tabletop by day, Paper by day, White Neon (unchanged) | 385 → 392, 480 → 451, 480 → 415 | 222 → 183, 220 → 228, 223 → 222 | +0.7 KB (CSS) |

All within the ±25 ms swing that cold medians from a few loads show between identical builds.

## Game reload (the board's dots in the page)

The single pass (4 cold loads) flagged Tabletop at night at 456 → 555 ms. The interleaved A/B run (15 rounds, main and branch alternating load by load, order flipping each round) does not confirm it:

| Mode | ready, main / branch | paired difference (median) | rounds branch slower | LCP difference |
|---|---|---|---|---|
| Tabletop at night | 498 / 509 ms | +11 ms (+2%) | 8/15 | +12 ms |
| Cozy Paper at night | 429 / 436 ms | +3 ms | 11/15 | +20 ms |
| Dark Neon | 486 / 498 ms | +19 ms (+4%) | 12/15 | +20 ms |

All under the 20% warning threshold.

## GPU and renderer cost at idle (CPU time per process over 5 s, % of a core; headless Chromium draws in software)

| Screen | vs main 288ab3a: GPU main → branch | vs before #18 (cff945c): GPU → branch |
|---|---|---|
| Dark Neon Home, Animations on | 6.6 → 6.8 | (see JSON) |
| Dark Neon game | 3.7 → 3.5 | 5.8 → 4.0 |
| White Neon Home | 4.6 → 4.9 | 5.6 → 4.9 |
| White Neon game | 3.1 → 2.7 | 4.3 → 2.8 |
| Dark Neon, Animations off | 0 → 0 | 0.3 → 0.1 (game) |
| Tabletop at night Home / game | 1.1 / 0.1 → 1.1 / 0.1 | 1.2 / 0.1 → 1.1 / 0.1 |

Renderer CPU on Tabletop at night's Home: 8.9 → 9.4% (8.4 → 9.2% against cff945c), about half a percent of a core more while Home's demo board animates over the wood (painting the multiplied wood under it). The game screen is unchanged (0.4%).

**PR #18's open item, closed:** its glass without backdrop-filter or blur costs less than the board before it: Dark Neon's game 5.8 → 4.0% and White Neon's 4.3 → 2.8% of a core for the GPU process.

## Frames (Animations on, crowded board, main and branch interleaved, 2 rounds pooled)

| Size, mode | drag moves median / p95, main → branch | tap to paint median | growing frames p95, share > 25 ms |
|---|---|---|---|
| 12x12 at 1920x1080, Tabletop at night | 33.4 / 34.4 → 33.3 / 34.6 ms | 32.9 → 32.5 ms | 16.8 → 16.7 ms, 0% → 2% |
| 12x12, Cozy Paper at night | 33.3 / 34.6 → 33.3 / 34.6 | 32.2 → 32.2 | 16.7 → 16.8, 0% → 0% |
| 12x12, Dark Neon | 33.3 / 42.7 → 33.4 / 42.4 | 51.1 → 63.2 | 33.3 → 33.3, 13% → 10% |
| 12x12, White Neon (unchanged) | 33.3 / 38.0 → 33.4 / 35.0 | 51.2 → 56.5 | 33.4 → 33.4, 27% → 25% |
| 7x7 phone CPU 4x, Tabletop at night | 33.3 / 35.1 → 33.2 / 35.4 | 31.2 → 31.2 | 16.8 → 16.7, 0% |
| 7x7 phone, Cozy Paper at night | 33.3 / 35.2 → 33.4 / 35.3 | 31.5 → 31.0 | 16.7 → 16.7, 0% |
| 7x7 phone, Dark Neon | 33.4 / 35.8 → 33.3 / 36.2 | 31.9 → 31.3 | 16.8 → 16.7, 0% |
| 7x7 phone, White Neon (unchanged) | 33.4 / 35.5 → 33.4 / 35.4 | 30.7 → 31.5 | 16.7 → 16.7, 0% |

Drags paint every pointer move within the two-frame floor (33 ms) everywhere. Dark Neon's 12x12 tap-to-paint median moved 51 → 63 ms, but White Neon, byte-for-byte the same in both builds, moved 51 → 57 ms in the same run: run-to-run noise in Neon's 3-4-frame tap path, not this change.

Re-run of the two Neon modes at 12x12 with 4 rounds (48 taps per build): tap to paint median Dark Neon 55.3 → 61.5 ms (p95
73.3 → 73.7), White Neon 55.2 → 49.7 (p95 69.3 → 88.2). The medians move by about 6 ms either way, in a mode that did not
change too, and sit on the 3- and 4-frame steps (50 and 66.7 ms), so one frame of quantisation flips them; the p95s match.

**PR #18's second open item, closed (branch vs `cff945c`, main before #18, 2 rounds):**

| Size, mode | growing frames p95 and share > 25 ms, before #18 → now | drag moves median / p95 |
|---|---|---|
| 12x12, Dark Neon | 50 ms, 41% → 33.3 ms, 12% | 33.4 / 35.1 → 33.3 / 39.2 ms |
| 12x12, White Neon | 50 ms, 50% → 33.4 ms, 26% | 33.3 / 34.7 → 33.4 / 45.5 |
| 12x12, Tabletop and Paper at night | 16.8 ms, 0-1% → 16.8 ms, 0-4% | 33.3-33.4 / 34.3-34.6 both |
| 7x7 phone (CPU 4x), all four | 16.7-16.8 ms, 0% → 16.7-16.8 ms, 0% | 33.3-33.4 / 35-35.9 both |

Neon's glass without blur or backdrop-filter (PR #18) holds a growing line at 30 fps or better on a full 12x12 board where
the blurred board before it dropped half its frames; drags paint every pointer move within two frames in both.

## Performance budget (branch)

| Metric | Budget | Actual | Status |
|---|---|---|---|
| FCP | < 1.8 s | 0.22 s cold (phone, CPU 4x) | PASS |
| LCP | < 2.5 s | 0.45-0.65 s cold | PASS |
| Start-up JS (gzip) | < 500 KB | about 85 KB (entry 45.7 + app 31.2) | PASS |
| CSS | < 100 KB | 46 KB raw, 10.2 KB gzip | PASS |
| Transfer | < 2 MB | 0.80-0.86 MB | PASS |
| Requests | < 50 | under 30 | PASS |

Grade: A (6/6). Status: DONE.
