# Benchmark: design/01-themes (9e4d256) vs main (3b3de84), 2026-10-12

**Method** (same as the earlier branch benchmarks): both production builds served by `vite preview` side by side (branch on 127.0.0.1:4173, main built in a scratch worktree on 127.0.0.1:4174), measured back to back with gstack's headless Chromium at 1280x800: 2 cold loads and 10 warm reloads per build and case, alternating order; medians. Firebase hosts blocked, Google Fonts allowed (main still loads them). Cases: Home on the default theme, Home with Neon and with Paper saved (main has no themes, so it shows its one look), and a reload in the middle of a game. A second pass measures a first visit on a phone-like connection.

**Counting main's fonts.** Main's two Google font files (Unbounded 51,464 B + Manrope 24,963 B = 76,427 B) never appear in its resource timing entries, so they were counted from network events in a separate load and added to main's transfer below. The phone-like pass counts every byte from DevTools network events, so it needs no correction.

## Results (1280x800, no throttling)

| Case | Metric | main | branch | Delta | Status |
|---|---|---:|---:|---:|---|
| Home, default theme (branch: Tabletop dark) | Home ready cold / warm | 1,560 / 233 ms | 108 / 70 ms | −1,452 / −163 ms | OK (faster) |
| | FCP cold / warm | 1,568 / 232 ms | 88 / 52 ms | −1,480 / −180 ms | OK |
| | LCP cold / warm | 1,976 / 432 ms | 472 / 416 ms | −1,504 / −16 ms | OK |
| Home, Neon | Home ready cold / warm | 689 / 226 ms | 102 / 69 ms | −587 / −157 ms | OK |
| | LCP cold / warm | 1,072 / 404 ms | 460 / 420 ms | −612 / +16 ms (+4%) | OK |
| Home, Paper (light) | Home ready cold / warm | 548 / 238 ms | 97 / 73 ms | −451 / −165 ms | OK |
| | LCP cold / warm | 916 / 424 ms | 160 / 108 ms | −756 / −316 ms | OK |
| Reload mid-game | Board ready cold / warm | 665 / 244 ms | 105 / 75 ms | −560 / −169 ms | OK |
| | LCP cold / warm | 716 / 296 ms | 132 / 104 ms | −584 / −192 ms | OK |
| All | CLS | 0.025-0.028 | 0.024-0.025 | ≈0 | OK |
| Requests | Home | 9 (7 + 2 font files) | 8 Tabletop, 8 Neon, 11 Paper | Paper +2 (+22%) | OK (under +30%) |
| Transfer, first visit | Home | 292,833 B | Tabletop 269,973 B / Neon 296,115 B / Paper 313,649 B | −7.8% / +1.1% / +7.1% | OK |
| JS decoded | Home | 669,155 B | 674,407 B | +5,252 B (+0.8%) | OK |
| CSS bundle | `index.css` | 16,364 B (4,305 B gzip) | 29,330 B (6,758 B gzip) | +2,453 B gzip (+57%) | **REGRESSION** (size rule: over +25%) |

**Why main's cold numbers are slow:** main's Google Fonts stylesheet blocks the first paint, and on this connection it took up to 3.2 s to arrive (3,205 ms in the first cold run; `curl` took 1.66 s for it today). The branch makes no third-party request before the first paint, so first paint and Home ready no longer depend on Google's response time. Warm numbers are the stable comparison: Home ready 233 → 70 ms. The LCP gap is smaller than the FCP gap on Home because LCP includes the screens' 0.32 s entrance fade on both builds.

## First visit on a phone-like connection

390x844, 150 ms latency, 1.6 Mbps down, 750 kbps up, CPU slowed 4x; 3 cold loads per build and case, medians.

| Case | FCP | Home ready | LCP | Load event | Bytes |
|---|---:|---:|---:|---:|---:|
| Home, default theme | 1,260 → **668** ms | 2,583 → **1,994** ms | 3,004 → **2,400** ms | 2,253 → 1,373 ms | 287 → 264 KB |
| Home, Neon | 892 → 844 ms | 2,300 → 2,229 ms | 2,728 → 2,636 ms | 1,910 → 1,724 ms | 287 → 290 KB |
| Home, Paper | 944 → 656 ms | 2,355 → 2,187 ms | 2,788 → 2,596 ms | 2,029 → 1,475 ms | 287 → 307 KB |

(main → branch.) Faster in every case, including Paper, which carries 20 KB more. On this profile both builds stay above the 2.5 s LCP budget on Neon and Paper (main by more): most of the time goes to the start-up JavaScript, mainly the Firebase SDK (131 KB gzip), which is unchanged here and is the subject of the planned speed work.

## Build sizes (gzip, level 9; fonts and images as stored)

| File | main | branch | Delta |
|---|---:|---:|---:|
| index.js (start-up) | 46,738 B | 48,596 B | +1,858 B (+4.0%) |
| index.css | 4,305 B | 6,758 B | +2,453 B (+57.0%) |
| app.js | 30,911 B | 30,910 B | −1 B |
| firebase.js | 130,759 B | 130,759 B | 0 |
| room.js (online only) | 39,606 B | 39,605 B | −1 B |
| ai.worker.js | 8,401 B | 8,401 B | 0 |
| Fonts per theme (what a page load fetches) | 76,427 B from Google (Unbounded + Manrope) | Tabletop 26,576 B (Jost); Neon 75,740 B (Unbounded + Manrope); Paper 79,212 B (Kalam 400/700 + Atkinson 400/700) | |
| Texture tiles | none | wood-light 24,146 B, wood-dark 23,022 B, paper-grain 13,162 B (one per page load at most) | |

Extended-Latin font files load only when a name on screen needs them (unicode-range); none did in these runs. Unbounded's is the largest at 118,348 B.

## Slowest resources (first cold run)

main: Google Fonts CSS 3,205 ms (render-blocking, third party), firebase.js 30 ms, index.js 17 ms, app.js 15 ms, index.css 13 ms.
branch: every first-party file under 40 ms from the local server; the only third-party request is the blocked Firebase sign-in.

## Recommendations

1. **CSS +2.45 KB gzip (the flagged item).** It holds all six theme modes' tokens and rules in one file, so switching themes is instant with no extra request or flash. Splitting each theme into its own file would save about 1.5 KB on a first visit but adds a request and a possible flash on every switch. Recommendation: accept it (it is under the brief's 12 KB gzip budget at 6.8 KB), and revisit if the CSS passes 10 KB.
2. **Unbounded's extended-Latin file (118 KB)** would load in Neon as soon as a name with letters like ő or ł appears. If the open question about the Ghanaian letters (Ɛ ɛ Ɔ ɔ) ends with a fallback font, trim this file to the ranges actually needed.
3. Pre-existing, not from this PR: Firebase SDK on the start-up path (total JS 674 KB decoded fails the 500 KB budget on both builds).

## Budget check (branch, cold, Tabletop, Firebase blocked)

FCP 0.09 s PASS, LCP 0.47 s PASS, total JS 674 KB decoded FAIL (pre-existing: Firebase at start-up), CSS 29 KB PASS, transfer 270 KB PASS, 8 requests PASS. Grade B (5 of 6), same as main. Brief budgets: start-up JS 48.6 KB gzip (budget 57) PASS; CSS 6.8 KB gzip (budget 12) PASS; texture tiles 13-24 KB (budget 25 each) PASS.

**PR summary:** "Benchmark vs main (same machine, back to back): first paint and Home ready faster in every theme, because the render-blocking Google Fonts request is gone (Home ready 233 → 70 ms warm; first visit on a throttled phone profile 2.58 → 1.99 s). Start-up JS +1.86 KB gzip (+4%); CSS +2.45 KB gzip (+57%, every theme's tokens, flagged by the size rule and under budget); first-visit transfer −8% Tabletop, +1% Neon, +7% Paper."

Raw data: `raw-20261012-themes/` (`bench.json`, `slow.json`, `sizes.json`).

**After the design review (06d45e5):** `index.css` 30,122 B raw, 6,881 B gzip (+123 B over the measured build, from the design fixes); start-up JS unchanged at 48,596 B gzip. Timings were not re-measured for a CSS-only change of that size.
