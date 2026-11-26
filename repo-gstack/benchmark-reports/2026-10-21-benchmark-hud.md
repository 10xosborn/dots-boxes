# Benchmark: design/09-hud-avatars (e4226a8) vs its base #23 design/08-liquid-glass (c421b05)

Method: production builds `dist-step3` (branch, byte-identical to the build /qa verified) and `dist-glass-A` (#23) served side by side by one plain static server (`serve-two.mjs`, no compression: byte counts raw unless marked gzip), Firebase blocked, gstack's headless Chromium 151.0.7922.34 (software raster; compare builds, not absolutes). Timings interleaved, the order flipping each round. gstack was upgraded from 1.91.171.0 to 1.91.173.0 before the timing runs (same Chromium before and after, checked). Raw outputs: the scratchpad's `hud/bench/`.

What changed: the game's HUD (player cards with SVG avatars, the turn pill's extra-turn cue, Paper's ruled score sheet with tallies, a circle and an underline, two container queries), the top bar's level chip (an avatar in the level ring) on every screen, Home's profile card; no new requests, fonts or images.

## 1. Bundle (`dist-sizes.mjs`)

| | #23 | branch | delta | status |
| --- | --- | --- | --- | --- |
| CSS | 10,619 B gzip | 12,026 B gzip | +1,407 B (+13.2%) | WARNING (>10%) |
| JS | 273,682 B gzip | 275,371 B gzip | +1,689 B (+0.6%) | OK |
| Everything | 285,201 B gzip | 288,297 B gzip | +3,096 B (+1.1%) | OK |

The CSS warning is the step's own styles (avatars in six modes, the cue, Paper's score sheet and note, the chip); 12 KB gzip stays far under the 100 KB budget.

## 2. Home loads (`home-load-ab.mjs`, phone 390x844 at 2x, CPU 4x, cold)

| Mode (rounds) | FCP | LCP | Home ready | DOM complete |
| --- | --- | --- | --- | --- |
| Tabletop at night (15) | 708 → 696 ms | 2240 → 2140 ms | 1618 → 1526 ms | 887 → 839 ms |
| Paper by day (15) | 576 → 636 ms (+10%) | 1948 → 1600 ms | 1364 → 1390 ms (+2%) | 592 → 615 ms |
| Dark Neon (8) | 636 → 660 ms | 1996 → 1868 ms | 1362 → 1306 ms | 723 → 713 ms |

A first 8-round pass showed FCP +200 ms in Tabletop at night and Paper by day with LCP and "ready" flat or faster; at 15 rounds it is gone (Tabletop -12 ms, Paper +60 ms). Requests 7 → 7 (10 → 10 in Paper).

## 3. Game reload (`reload-ab-size.mjs`, a 4x4 game mid-way, phone CPU 4x, cold)

| Mode (rounds) | Board ready | Paired difference (branch - #23) | LCP |
| --- | --- | --- | --- |
| Dark Neon (15) | 1807 → 1701 ms | -61 ms (slower in 6/15) | 1708 → 1728 ms |
| Tabletop at night (15) | 1600 → 1627 ms | -73 ms (slower in 7/15) | 1916 → 1884 ms |
| Paper by day (10) | 1550 → 1571 ms | +37 ms (slower in 7/10) | 1824 → 1968 ms |

A 10-round pass had shown Dark Neon at +359 ms paired (slower in only 6/10, LCP swinging 2032 → 844 ms); at 15 rounds it is -61 ms.

## 4. Tap to paint and frames from a fresh game (`filter-cost-ab.mjs`): stopped

Claude Code stopped this run for low memory on the machine after its first scenario. Measured: 4x4 on a phone with the CPU slowed 4x, Tabletop at night, 3 rounds x 12 taps: tap to paint median 54.1 → 49.7 ms (p90 82.8 → 81.9, paired +0.6 ms, branch slower in 2/3), frames while a line grows 16.7 → 16.7 ms (over 20 ms: 6.6% → 5.9%), renderer CPU per tap 900 → 899 ms. **Not measured:** Dark Neon and Paper by day on the phone, and all three on a 12x12 board at 1920x1080.

## Verdict

**No regressions measured; one warning; one measurement incomplete.** CSS +13% (+1.4 KB gzip) crosses the 10% warning line for bundle growth; total transfer +1.1%. Home loads and game reloads are flat after re-runs, and the one tap-to-paint scenario measured is flat. The rest of the tap-to-paint set was stopped by Claude Code for low memory and has not been re-run; the change adds a handful of static SVG elements and text to the HUD, so a cost there would be unexpected, but it is not measured.
