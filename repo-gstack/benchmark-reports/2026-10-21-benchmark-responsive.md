# Benchmark: design/10-responsive (spec step 4) vs its base #25 online/server-turns (4613e6f)

What changed: the game screens became a grid that fills the screen, the board sized by a size container (`.play`, container query units), small inline-size containers on the chips row and the top bar, Paper's two-page spread from 960 px (its pages are the grid's `::before`/`::after`), a side-by-side layout for short, wide screens, Home fitted with a size container, and boardFit.ts mirroring the layouts. Builds: this branch's final working tree (`dist-step4`, index CSS `CstpsYHO`) and #25's (`dist-turns`), served together by the scratchpad's `serve-two.mjs`; gstack's bundled Playwright with headless Chromium 151 (Aside is macOS-only); Firebase blocked by hostname; every A/B interleaved round by round unless noted. The machine was under memory pressure (1.3-1.8 GB free), so wall-clock medians moved a lot between runs; paired differences and CPU counters are the steadier signals.

## 1. Bundle (`dist-sizes.mjs`)

| | #25 | branch | delta |
| --- | --- | --- | --- |
| Startup JS (index) | 49,393 B gzip | 50,057 B gzip | +664 B (+1.3%) |
| All JS | 275,511 B gzip | 276,176 B gzip | +665 B (+0.2%) |
| CSS | 12,026 B gzip | 13,718 B gzip | **+1,692 B (+14.1%): WARNING** |

The CSS is the new layout: the game grid, the side-by-side rules, Paper's spread with its two textured pages (by day and at night), Home's fitting rules and the online note's overlay. No new requests, no new assets (the spread reuses the paper texture).

## 2. Home load (`home-load-ab.mjs`, 390x844 phone, CPU 4x, cold, 8 rounds)

| Mode | FCP | LCP | Home ready | DOM complete | Requests |
| --- | --- | --- | --- | --- | --- |
| Tabletop at night | 628 → 536 ms | 1816 → 1632 ms | 1272 → 1106 ms | 697 → 700 ms | 7 → 7 |
| Paper by day | 548 → 568 ms | 1768 → 1544 ms | 1465 → 1230 ms | 679 → 612 ms | 10 → 10 |

No regression; level or earlier.

## 3. Reload into a game (`reload-ab-moves.mjs` and `step4/reload-work.mjs`, 4x4 mid-game, 390x844 phone, CPU 4x, cold)

| Run | Mode | Ready (#25 → branch) | LCP (#25 → branch) |
| --- | --- | --- | --- |
| 8 rounds | Tabletop at night | 1644 → 1601 ms (paired +8, slower 4/8) | 1940 → 1936 ms |
| 8 rounds | Paper by day | 1329 → 1476 ms (paired +35, 5/8) | 1588 → 1536 ms |
| 8 rounds | Dark Neon | 1623 → 1620 ms (paired +238, 4/8) | 1808 → 1740 ms |
| 15 rounds | Paper by day | 1324 → 1421 ms (+7%, paired +94, 9/15) | 1328 → 1664 ms (**+25%: WARNING**, paired +160) |
| 15 rounds | Tabletop at night | 1484 → 1602 ms (+8%, paired +155, 8/15) | 1788 → 1960 ms (+10%, paired +284) |

The wall clock is noisy: the branch was slower in only half the rounds, and the same Paper LCP moved -3% in one run and +25% in the next. The main thread's own work (CDP `Performance.getMetrics`, 10 rounds) is steadier:

| Mode | Task | Script | Style recalc | Layout | Recalc count |
| --- | --- | --- | --- | --- | --- |
| Tabletop at night | 1766 → 1854 ms (paired +134) | 551 → 585 (+50) | 110 → 157 (+38) | 323 → 320 (+8) | 18 → 20 |
| Paper by day | 2036 → 2098 ms (paired +106) | 578 → 677 (-45) | 128 → 180 (+45) | 479 → 433 (-56) | 13 → 20 |

So a reload does about 5-7% more main-thread work at CPU 4x, mostly style recalculation (+40-50 ms at 4x, roughly 10-12 ms on a real phone): the size containers style their contents once their size is known, in a few more passes. Layout is unchanged.

## 4. Tapping lines (`filter-cost-ab.mjs`: 12 taps from a fresh pass-and-play game, each timed to the next painted frame)

**4x4 on a 390x844 phone, CPU 4x.** Five runs of 3-8 rounds:

- Tabletop at night: paired +1.5 / +10.9 / +2.2 ms, renderer CPU per tap -16 / +7 / -2 ms (of about 900).
- White Neon: paired +10.5 / +15.0 / +1.0 ms, renderer CPU +20 / +25 / +7 ms (of about 700-750).
- Paper by day: paired +11.6 ms, renderer CPU +20 ms (of about 650).

Wall-clock medians swung from +4% to +41% between runs while the paired differences stayed small, and a bisect by CSS injection gave contradictory answers from run to run (removing the chips row's clip: flat in one 5-round run, +12 ms in an 8-round run). Read as: a small tendency, 1-3% more renderer work per tap, within this machine's noise. Line-grow frames are unchanged (median 16.7 ms; over 20 ms within ±4 points).

**12x12 at 1920x1080** (Paper on its new spread, Tabletop in the column), final build, 4 rounds:

| Mode | Tap to paint | Renderer CPU per tap | Grow frames over 20 ms |
| --- | --- | --- | --- |
| Paper by day | 32.1 → 32.1 ms | **367.6 → 269.9 ms (paired -75.3, -27%)** | 4.1% → 0.2% |
| Paper at night | 31.7 → 32.3 ms | **293.8 → 203.5 ms (paired -84.9, -31%)** | 3.8% → 0.1% |
| Tabletop by day | 32.8 → 32.7 ms | 407.0 → 393.3 ms (paired -13.5) | 0.4% → 0.6% |

Found and fixed during this benchmark: the first spread re-rastered its textured pages under every new line and tally mark (renderer CPU +38-40 ms per tap, +10-13%; slow frames 3% → 6%), because the score sheet and the board now lie transparent over the pages. Each page now has its own layer (`will-change: transform` on the two pseudo-elements, desktop and sideways), so the paper is drawn once: the spread is now about a quarter cheaper per line than #25's sheet.

## 5. Dragging (`drag-anim-perf.mjs`, 4 presses: 30 moves, 1.5 s held, let go)

| Case | Moves median / p95 (#25 → branch) | Held frames over 25 ms |
| --- | --- | --- |
| 12x12 desktop, Tabletop by day | 33.2 / 35.8 → 33.3 / 35.6 ms | 0 → 0 of 364 |
| 12x12 desktop, Dark Neon | 33.3 / 56.5 → 33.4 / 62.6 ms | 2 → 3 of ~360 |
| 7x7 phone CPU 4x, Tabletop by day (second run) | 33.1 / 42.6 → 33.3 / 36.3 ms | 0 → 0 of 364 |
| 7x7 phone CPU 4x, Dark Neon (second run) | 33.3 / 38.1 → 33.2 / 36.7 ms | 0 → 0 of 364 |

This tool runs #25 then the branch (not interleaved). Its first run showed Tabletop on the phone worse (10 → 29 held frames over 25 ms) and Dark Neon better (23 → 10), both on a busy machine; the second run was flat for both.

## Verdict

**No regressions.** Two warnings:

- **CSS +1.7 KB gzip (+14%):** the new layouts.
- **Reloading into a game:** about 5-7% more main-thread work at CPU 4x (style recalculation from the size containers, roughly 10 ms on a real phone). One 15-round run put Paper's LCP median +25%, another put it at -3%. Noisy, but flagged.

Page loads are level or faster. Tap and drag timing is flat within noise. Paper's desktop spread now draws about a quarter less per line than #25's sheet, after the layer fix found here.

Not measured: real phones and GPUs (headless draws in software), Safari, production Firebase.
