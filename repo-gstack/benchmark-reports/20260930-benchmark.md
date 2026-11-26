# Benchmark baseline: Grid Rivals main (7b3affd), 2026-09-30

vite preview of the production build on this PC; Firebase live (anonymous sign-in, profile and scores). Pass 1 is a cold load, passes 2-3 reuse the cache. LCP = Home screen shown after Firebase start-up.

| Metric | Cold load | Warm (median) | Budget | Status |
| --- | ---: | ---: | --- | --- |
| TTFB | 5 ms | 2 ms | | local server |
| First contentful paint | 3280 ms | 92 ms | < 1.8 s | cold FAIL (render-blocking Google Fonts CSS), warm PASS |
| Largest contentful paint (Home shown) | 3280 ms | 2536 ms | < 2.5 s | FAIL: waits for Firebase sign-in + 3 sequential Firestore reads |
| DOM complete / load | 3890 ms | 26 ms | | |
| Requests | 12 | 11 | < 50 | PASS |
| Transfer | 208 KB | cached | < 2 MB | PASS |
| JS (decoded) | 647 KB | | < 500 KB | FAIL decoded (index + Firebase app + Firestore at start-up); ~213 KB compressed |
| CSS | 16 KB | | < 100 KB | PASS |

Build (gzip): index JS 45.1 KB, CSS 4.3 KB, Firebase app 31.2 KB, Firestore 132.3 KB (start-up), rooms 39.5 KB (lazy), AI worker 15.6 KB (raw).

Grade: C (4 of 7 budgets passing on the cold load).