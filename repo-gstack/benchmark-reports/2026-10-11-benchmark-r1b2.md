# Benchmark: fix/r1b-online-resume (c23909c) vs main (cd588b2), 2026-10-11

**Method** (same as today's earlier benchmarks): both production builds served by `vite preview` side by side (branch on 127.0.0.1:4173, main on 127.0.0.1:4174), measured back to back with gstack's headless Chromium at 1280x800: 2 cold loads and 10 warm reloads per build and case, alternating order; medians. Firebase hosts blocked, Google Fonts allowed. Start-up now also reads `dnb:room` (no saved room in these runs, which is the common case; rejoining is measured in the QA run: 0.3-0.4 s to the board).

## Results

| Case | Metric | main | branch | Delta | Status |
|---|---|---:|---:|---:|---|
| Home, first visit | Home ready cold / warm | 596 / 272 ms | 561 / 234 ms | −35 / −38 ms | OK |
| | LCP cold / warm | 992 / 536 ms | 964 / 452 ms | −28 / −84 ms | OK |
| | FCP cold / warm | 588 / 280 ms | 556 / 248 ms | −32 / −32 ms | OK |
| Home, saved AI game | Home ready cold / warm | 610 / 253 ms | 558 / 247 ms | −52 / −6 ms | OK |
| | LCP cold / warm | 992 / 472 ms | 952 / 436 ms | −40 / −36 ms | OK |
| Both | Requests | 7 | 7 | 0 | OK |
| | Transfer | 215,842 B | 216,414 B | +572 B (+0.3%) | OK |
| | JS decoded | 667,388 B | 669,163 B | +1,775 B (+0.3%) | OK |

Timing deltas are within noise (run order and machine load); no regressions.

## Build sizes (gzip, level 9)

| Chunk | main | branch | Delta |
|---|---:|---:|---:|
| index.js (start-up) | 46,172 B | 46,741 B | +569 B (+1.2%) |
| index.css | 4,305 B | 4,305 B | 0 |
| app.js | 30,911 B | 30,910 B | −1 B |
| firebase.js | 130,759 B | 130,760 B | +1 B |
| room.js (online only) | 39,562 B | 39,606 B | +44 B (+0.1%) |
| ai.worker.js (raw) | 8,401 B gz | 8,401 B gz | 0 |

No emulator code in the production build.

## Budget check (branch, cold, Firebase blocked)

FCP 0.56 s PASS, LCP 0.96 s PASS, total JS 669 KB FAIL (pre-existing: Firebase app + Firestore at start-up), CSS 16 KB PASS, transfer 216 KB PASS, 7 requests PASS. Grade B (5 of 6), same as main.

**PR summary:** "Benchmark vs main (same machine, back to back): no regressions. Start-up JS +569 B gzip (+1.2%), online-only room code +44 B, CSS unchanged; Home ready within noise."
