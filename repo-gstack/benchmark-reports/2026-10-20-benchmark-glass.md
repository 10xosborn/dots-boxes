# Benchmark: design/08-liquid-glass (c421b05) vs its base fix/owner-2026-10-20 (da25977)

Method: production builds `dist-glass-A` (branch) and `dist-marks-on-22` (base) served side by side by one plain static server (`serve-two.mjs`, no compression: byte counts raw unless marked gzip), Firebase blocked, gstack's headless Chromium 151 (software raster and compositing, so GPU and raster numbers are upper bounds; compare them, not absolutes). Timings interleaved, order flipping each round. Raw outputs: `raw-20261020-glass/`.

What changed: Neon's board became clear liquid glass (static layers: a translucent fill, inset shadows, a radial highlight, a masked gradient rim in `::before` and four gradient edge highlights in `::after`, both over the board's content; no filter, no blur), and every theme's lines are a fifth thinner.

## 1. Bundle (`dist-sizes.mjs`)

| | base | branch | delta |
| --- | --- | --- | --- |
| CSS | 10,414 B gzip | 10,619 B gzip | +205 B (+2.0%) |
| JS | 273,671 B gzip | 273,682 B gzip | +11 B |
| Everything | 284,985 B gzip | 285,201 B gzip | +216 B (+0.08%) |

## 2. GPU and renderer CPU

Idle, 5 s, phone 390x844 at 2x (`bench-gpu.mjs`, 3 reps): every scenario flat or lower (Neon Home at night GPU 9.6 → 8.8% of a core, game 4.9 → 4.6%; by day 8.7 → 8.8% and 4.0 → 3.8%; Animations off and Tabletop at night unchanged).

Held drag, 3 s, the landing rings turning (`glass-gpu.mjs`, 6 alternating runs x 2 sessions per build, medians):

| Mode | GPU ms (base → branch) | Renderer ms | Frames | Frames > 20 ms |
| --- | --- | --- | --- | --- |
| Dark Neon | 344 → 359 (+4%) | 493 → 461 (-6%) | 16.7 ms | 0% → 0% |
| White Neon | 322 → 335 (+4%) | 388 → 460 (+19%) | 16.7 ms | 0% → 0% |

## 3. Drawing lines from a fresh game (`filter-cost-ab.mjs`)

4x4 phone, CPU 4x (3 rounds x 12 taps): tap to paint within ±2.6 ms in all six modes (White Neon 33.5 → 36.1 ms, +8%, slower in 3/3; Paper by day 34.7 → 36.3); grow frames 16.7 ms everywhere; renderer CPU per tap within ±3%.

12x12 at 1920x1080 (3 rounds; Neon re-run with 6):

| Mode | Tap to paint median (base → branch) | Grow frames > 20 ms | Renderer CPU per tap |
| --- | --- | --- | --- |
| Tabletop night / day | 32.6 → 32.7 / 32.3 → 32.7 ms | ≤ 0.8% both | +5% / +1% |
| Paper night / day | 32.8 → 32.9 / 32.3 → 32.8 ms | ≤ 0.8% both | -5% / -8% |
| Dark Neon (6 rounds) | 68.2 → 69.4 ms (paired +13, slower 5/6) | 22.8% → 21.7% | 153 → 148 ms (-3%) |
| White Neon (6 rounds) | 58.0 → 50.1 ms (faster 6/6) | 58.0% → 62.3% | 230 → 298 ms (+30%) |

Neon on a 12x12 board at full HD already drops frames on the base in software rendering (Dark 23%, White 58% of grow frames over 20 ms); the branch is the same within noise.

## 4. Loads (`reload-ab-size.mjs` 8 rounds, `home-load-ab.mjs` 6 then 12 rounds, phone CPU 4x)

| Scenario | base → branch |
| --- | --- |
| Reload, Dark Neon | ready 1034 → 925 ms (paired -118), LCP 1236 → 1160 |
| Reload, White Neon | ready 773 → 762 ms (paired -5), LCP 904 → 908 |
| Reload, Tabletop by day | ready 681 → 680 ms, LCP 1152 → 1124 |
| Home, Dark Neon | FCP 392 → 352, LCP 1260 → 1192 ms |
| Home, White Neon (12 rounds) | FCP 324 → 348, LCP 1152 → 1156 ms (a 6-round pass showed FCP +24%; with 12 rounds it is noise, and the glass is not on Home) |

## Verdict

**No regressions; one warning.** Nothing crosses the regression lines (+50% or +500 ms). **Warning:** White Neon's raster work while lines grow on a 12x12 board at full HD is about 30% higher (renderer CPU per tap 230 → 298 ms, confirmed over 6 rounds), and a held drag by day is +19%; user-visible timings did not move (tap to paint faster, frames the same). The likely cause is the two glass layers drawn over the board's content (the masked rim and the edge highlights), repainted where a growing line or the drag touches them. If it matters on a real phone, a follow-up can promote those two layers to their own compositing layers so content repaints never redraw them. Not measured: real GPUs and the owner's phone.
