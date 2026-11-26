# Benchmark: design/02-materials vs main

| Field | Value |
|---|---|
| Date | 2026-10-13 |
| Branch | design/02-materials at 70ab46e (palettes, materials, lighting; QA and design-review fixes) |
| Base | main at 83e2c8b, built in a scratch worktree |
| Serving | Both production builds served by one plain static server each (`serve-two.mjs`: no compression, `Cache-Control: max-age=600` like GitHub Pages), only while each measurement ran; no background servers |
| Browser | gstack's headless Chromium 151 through playwright-core 1.62.1, 1280x800 unless noted; Firebase hosts blocked (local adapter), so nothing reached production |
| Passes | Page loads: per scenario and build, 2 cold loads and 10 warm reloads, the builds alternating order between rounds; medians reported. Move-to-paint: 30 moves per theme and board |
| Raw data | `raw-20261013-materials/pageload.json`, `raw-20261013-materials/move-to-paint.txt` |

## Verdict

**No material regressions.** The new materials cost about 1.3 KB of gzipped JavaScript and 1.6 KB of gzipped CSS, first paint lands 4-28 ms later (heavier full-page backgrounds), and a move still paints within two frames on a 12x12 board and on a slowed phone, exactly as on main. Two numbers cross the skill's relative thresholds and are explained below: CSS +23% (warning) and the Tabletop game reload's LCP, which moved to a different element.

## Page loads (medians, ms; bytes uncompressed as served locally)

| Scenario | FCP main → branch (cold / warm) | LCP main → branch (cold / warm) | Ready main → branch (warm) | Transfer main → branch |
|---|---|---|---|---|
| Home, Tabletop by day | 72 → 96 / 48 → 60 | 464 → 480 / 420 → 440 | 76 → 74 | 760.5 → 775.0 KB |
| Home, Tabletop at night | 76 → 92 / 48 → 64 | 452 → 476 / 420 → 452 | 73 → 77 | 759.3 → 773.8 KB |
| Home, Neon at night | 68 → 76 / 40 → 52 | 464 → 476 / 432 → 452 | 84 → 80 | 785.5 → 800.0 KB |
| Home, Neon by day | 64 → 80 / 44 → 48 | 452 → 484 / 436 → 444 | 83 → 80 | 785.5 → 800.0 KB |
| Home, Paper by day | 60 → 76 / 48 → 76 | 156 → 192 / 124 → 152 | 80 → 88 | 803.0 → 808.6 KB |
| Home, Paper at night | 64 → 92 / 48 → 76 | 160 → 176 / 116 → 452 (*) | 76 → 77 | 803.0 → 808.7 KB |
| Game reload, Tabletop by day | 68 → 84 / 56 → 72 | 136 → 484 / 104 → 464 (**) | 80 → 84 | 776.4 → 802.2 KB |
| Game reload, Neon at night | 68 → 68 / 48 → 56 | 132 → 148 / 108 → 124 | 87 → 88 | 801.4 → 815.9 KB |

"Ready" is when Home's Play button or the game board is in the page. CLS is 0.025 in every scenario on both builds (unchanged). TTFB is 1 ms (local). Requests: 8 on Home (11 on Paper, its font files), 9 → 10 on the Tabletop game (the felt grain tile).

(**) **LCP on the Tabletop game reload changed element, not speed.** Main's LCP is the offline banner (136 ms); on the branch the board's felt texture is now the largest image on screen and becomes the LCP element. With Animations on, its LCP is recorded when the game screen's 0.32 s entrance fade ends (484 ms); with Animations off it is 136-140 ms, against main's 112-124 ms for the banner (`lcp-diag.mjs`, 3 loads per case). The board itself is in the page at the same moment as on main (84 vs 80 ms warm). Neon's board has no image (gradients only), so its LCP stays on the banner.

(*) **Paper at night's warm LCP median (452 ms)** didn't reproduce: in the diagnosis the LCP element is the title on both builds, 148-156 ms on main and 164-168 ms on the branch with Animations on (116-124 vs 128-144 ms off). The bench's warm median picked up loads where a later element won.

**First paint +4 to +28 ms** on every scenario, most in Paper (48 → 76 ms warm): its desk now has a texture tile blended in `multiply` (`soft-light` at night) under a vignette, and every theme's page and board backgrounds are layered gradients. By the skill's relative thresholds that is a warning in most scenarios and a regression for Paper's warm FCP (+58%), but the absolute cost is under two frames on this PC.

## Move-to-paint (time from a move to the next painted frame)

Pass-and-play, so every click is a move; median and p95 of 30 moves per theme and board.

| Board | Main (median / p95) | Branch (median / p95) |
|---|---|---|
| 12x12 at 1920x1080, six modes | 33 / 34-35 ms | 33 / 34-35 ms |
| 7x7 on a 390x844 phone, CPU slowed 4x, six modes | 31-32 / 33-34 ms | 31-32 / 32-33 ms |

Both builds sit on the measurement's floor (two animation frames at 60 Hz) in every theme: the engrave, emboss and glow filters don't push a move past the frame budget. CDP's CPU throttling slows the main thread only, so a real low-end phone's raster cost isn't modelled here.

## Bundle sizes (production build, gzip -9)

| File | Main | Branch | Change |
|---|---|---|---|
| Start-up JS (`index` + `app`) | 218.9 KB (77.6 KB gz) | 225.6 KB (78.9 KB gz) | +1.3 KB gz (+1.6%): the board's SVG effects and layers, twice (board and hero) |
| All JS | 805.1 KB (252.2 KB gz) | 811.8 KB (253.5 KB gz) | +1.3 KB gz (+0.5%) |
| CSS | 30.9 KB (6.9 KB gz) | 38.3 KB (8.5 KB gz) | +1.6 KB gz (+23%): six token blocks with the new material tokens, backgrounds, board surfaces, control states — **WARNING** (over 10%) |
| `grain.webp` (Tabletop felt) | none | 10.8 KB | new; loads only in Tabletop, with the board |
| Paper texture | `paper-grain.webp` 12.9 KB | `paper-light.webp` 4.1 KB, `paper-soft.webp` 4.3 KB | Paper loads one 4 KB tile per mode instead of 12.9 KB |

Per visit (uncompressed, as served locally): Tabletop and Neon Home +14.5 KB, Tabletop game +25.8 KB (the felt tile), Paper +5.5 KB (its smaller tile offsets the code). Fonts unchanged.

## Budget check (branch)

| Metric | Budget | Actual | Status |
|---|---|---|---|
| FCP | < 1.8 s | 48-96 ms | PASS |
| LCP | < 2.5 s | 124-488 ms | PASS |
| JS on Home (decoded) | < 500 KB | 681 KB (main 674 KB: the Firebase SDK the app loads for sign-in) | FAIL, unchanged from main |
| CSS | < 100 KB | 39 KB | PASS |
| Transfer | < 2 MB | 774-816 KB | PASS |
| Requests | < 50 | 8-11 | PASS |

Grade: **B** (5 of 6), the same as main; the one failure is pre-existing.

## Thresholds applied

| Flag | Where | Why it isn't a real regression |
|---|---|---|
| CSS +23% gz (warning) | `index.css` | +1.6 KB gz for six themes' materials and states |
| FCP over +20% (warnings), Paper warm +58% (regression by the relative rule) | Every scenario | 4-28 ms in absolute terms, under two frames |
| LCP +346% (regression by the relative rule) | Tabletop game reload | A different LCP element timed at the end of the 0.32 s entrance fade; with Animations off 136-140 vs 112-124 ms; the board appears at the same moment |

## Limits

- Local loopback: no network latency or compression, so transfer numbers are uncompressed sizes and timings show render cost, not download time.
- Headless Chromium on this PC (low memory, about 0.8 GB free during the runs); no real phone, no Brave.
- Two cold loads per scenario and build: cold medians are noisier than the warm ones.
