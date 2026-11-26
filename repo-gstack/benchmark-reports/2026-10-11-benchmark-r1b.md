# Benchmark: fix/r1b-online-presence (2193c45) vs main (39e5edc), 2026-10-11

**Method** (same as the R1a benchmark earlier today): both production builds served by `vite preview` on this PC at the same time (branch on 127.0.0.1:4173, main on 127.0.0.1:4174), measured back to back with gstack's headless Chromium at 1280x800: 2 cold loads and 10 warm reloads per build and case, alternating which build goes first; medians. Firebase hosts blocked (no live reads or writes), Google Fonts allowed. The online screen is not on the start-up path, so Home is what every visitor pays for.

## Results

### Home, first visit

| Metric | main | branch | Delta | Status |
|---|---:|---:|---:|---|
| FCP cold / warm | 608 / 260 ms | 568 / 244 ms | −40 / −16 ms | OK |
| LCP cold / warm | 984 / 432 ms | 948 / 424 ms | −36 / −8 ms | OK |
| Home ready cold / warm | 616 / 249 ms | 566 / 237 ms | −50 / −12 ms | OK |
| DOM complete (warm) | 408 ms | 422 ms | +14 ms | OK |
| Requests | 7 | 7 | 0 | OK |
| Transfer | 215,271 B | 215,842 B | +571 B (+0.3%) | OK |
| JS decoded | 665,772 B | 667,388 B | +1,616 B (+0.2%) | OK |
| CSS decoded | 16,261 B | 16,364 B | +103 B (+0.6%) | OK |

### Home with a saved game

| Metric | main | branch | Delta | Status |
|---|---:|---:|---:|---|
| Home ready cold / warm | 625 / 240 ms | 512 / 225 ms | −113 / −15 ms | OK |
| LCP cold / warm | 996 / 424 ms | 896 / 424 ms | −100 / 0 ms | OK |

All timing deltas are within noise (the branch's lower cold numbers are run order and machine load, not a speed-up). No regressions.

## Build sizes (gzip, level 9)

| Chunk | main | branch | Delta |
|---|---:|---:|---:|
| index.js (start-up) | 45,633 B | 46,172 B | +539 B (+1.2%) |
| index.css | 4,276 B | 4,305 B | +29 B (+0.7%) |
| app.js (Firebase app) | 30,909 B | 30,911 B | +2 B |
| firebase.js (Firestore) | 130,759 B | 130,759 B | 0 |
| room.js (online only, lazy) | 39,052 B | 39,562 B | +510 B (+1.3%) |
| ai.worker.js (raw) | 15,601 B | 15,601 B | 0 |

The production build contains none of the emulator code (`demo-dnb`, `__dnbNet`, `127.0.0.1:9099` absent from every chunk); `connectAuthEmulator`, `connectDatabaseEmulator` and `connectFirestoreEmulator` are tree-shaken away.

## Budget check (branch, cold, Firebase blocked)

| Metric | Budget | Actual | Status |
|---|---|---:|---|
| FCP | < 1.8 s | 0.57 s | PASS |
| LCP | < 2.5 s | 0.95 s | PASS |
| Total JS (decoded) | < 500 KB | 667 KB | FAIL (pre-existing: Firebase app + Firestore at start-up) |
| Total CSS | < 100 KB | 16 KB | PASS |
| Total transfer | < 2 MB | 216 KB | PASS |
| HTTP requests | < 50 | 7 | PASS |

Grade: B (5 of 6), the same as main under the same conditions.

**PR summary:** "Benchmark vs main (same machine, back to back): no regressions. Start-up JS +539 B gzip (+1.2%), CSS +29 B, online-only room code +510 B; Home ready within noise; no emulator code in the production build."
