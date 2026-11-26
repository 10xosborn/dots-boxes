# QA Report: Grid Rivals, the stronger AI (Hard's fight for control, Medium's fewest-boxes rule)

| Field | Value |
|-------|-------|
| **Date** | 2026-10-15 |
| **Target** | production build on http://127.0.0.1:4173 (worker `ai.worker-Co6o5Txl.js`, then `ai.worker-D9IryGg9.js` after the fix below), Firebase blocked; repository commands |
| **Branch** | ai/stronger-hard |
| **Commit** | 3829b7f plus the uncommitted fix below (folded into the task's single commit after this run), base main cff945c |
| **Tier** | Standard; mixed run: browser (Full, 900 s guard) and functional (repository commands, evidence tool) |
| **Scope** | `src/lib/engine/ai-core.js`, `scripts/ai-bench.mjs`, `tests/ai/ai.test.ts`, package scripts, README |
| **Driver** | gstack's playwright-core with its headless Chromium (Aside is macOS-only): phone 390x844 with touch and the CPU slowed 4x (CDP); the integrity suite also on desktop 1280x800 and 1920x1080 |
| **Charters** | [charters.md](charters.md): B1-B6 browser, F1-F3 functional |

## Browser: Health Score 100/100 (provisional)

| Category | Score |
|----------|-------|
| Console | 100 (0 page errors) |
| Functional | 100 |
| UX | 100 (no main-thread task over 200 ms while the AI thinks) |
| Performance | 100 (every AI move within 0.83 s of the line before it, the 0.3-0.8 s pause included) |
| Accessibility | 100 (keyboard-only game in B5) |
| Links, Visual, Content | not scored (no UI change) |

Provisional: no real phone; CDP CPU slowing may not reach the AI's worker, but Hard's thinking is bounded by its 0.7 s wall-clock limit either way.

Evidence verdict (browser): inconclusive (open: no evidence rows), final for a browser-only root. Checkpoints: [002](browser/exploration-002.json) · [003](browser/exploration-003.json) · [004](browser/exploration-004.json) · [005](browser/exploration-005.json) · [006](browser/exploration-006.json) · [007](browser/exploration-007.json)

| # | Contract | Probe and result |
|---|---|---|
| B1 | Hard 5x5 to the end, moves within 1.2 s, no long tasks | 001 ([output](browser/probe-001.txt), [full](browser/probe-001-full.txt)): 4/4; median 581 ms, worst 826 ms over 42 AI moves; no long tasks |
| B2 | Hard 6x6 and 3x3 | 002 ([output](browser/probe-002.txt), [full](browser/probe-002-full.txt)): 8/8; 6x6 worst 795 ms (59 moves), 3x3 worst 815 ms (16 moves) |
| B3 | Hard 7x7 (largest phone board) | 003 ([full](browser/probe-003-full.txt)): 4/4; worst 825 ms over 79 moves; one 63 ms task |
| B4 | Medium 5x5, Easy 4x4 | 004 ([full](browser/probe-004-full.txt)): 8/8; worst 783 and 764 ms |
| B5 | Integrity: Hard to the end, phone 7x7, desktop 12x12, keyboard-only, reload, restart | 005 ([output](browser/probe-005.txt)): 35/35 |
| B6 | Local resume | 006 ([output](browser/probe-006.txt)): 31/31 |
| B1-B2 again | Revalidation after the tie-break change (rebuilt worker) | 007 ([full](browser/probe-007-full.txt)): 8/8; 6x6 worst 821 ms, 5x5 worst 795 ms |

## Functional: contract outcomes (no score)

Evidence verdict (functional): **pass** ([evidence.json](functional/evidence.json); checkpoints [002](functional/exploration-002.json) · [003](functional/exploration-003.json) · [004](functional/exploration-004.json)).

| # | Contract | Captures | Outcome |
|---|---|---|---|
| F1 | `vitest run tests/ai`: known endgames (all-but-two, all-but-four, hard-hearted 2-chain, Medium's shortest chain, Easy), random positions, exact 3x3 play | 001 failed (1 of 8, superseded), 002 after the fix | pass (8/8; three more runs also 8/8) |
| F2 | `opening-book.mjs --check 100`: the 3x3 book against a full solve; Hard vs Hard | 003 | pass: book matches; Hard optimal in all 12,951 positions up to 4 lines; Hard vs Hard 3-6 in all 100 games, every move optimal; slowest move 128 ms |
| F3 | `ai-bench.mjs` short run at phone speed | 004 | pass: legal moves only; Hard beat Medium 9/10 (3x3) and 10/10 (4x4), Medium beat Easy 10/10 and 10/10 |

## Issues

### ISSUE-001: a unit test's rule was wrong for perfect play (medium, Functional, in this branch's new tests): fixed

- **What:** capture 001 failed "Hard never gives boxes away needlessly: with safe lines left, a third side is only ever a sacrifice of 1 or 2 boxes" on some random positions.
- **Replay:** `ai-sac-repro.mjs` over 217 positions found 2 cases (a 5-box and a 3-box sacrifice), both with 32 lines left, which is inside Hard's exact-search window on 5x5. The exact search confirms both moves optimal (value -3), so Hard was right and the test's rule was too strict.
- **Fix:** the property now covers positions before the exact search (27 moves played at most on 5x5), with the reason in the test; and the engine breaks ties between equally optimal moves toward the fewest boxes given away (captures and safe lines first, as before), so perfect play also reads naturally.
- **Verification:** capture 002 (same command) passes 8/8, three more runs pass, and the browser contracts were revalidated on the rebuilt worker (probe 007).
- **Fix status:** verified. Files: `src/lib/engine/ai-core.js`, `tests/ai/ai.test.ts`. Committed into the task's single commit (the owner asked for one commit per task).

## Console Health

| Error | Count |
|-------|-------|
| none | 0 |

## Summary

Browser: 0 issues, health 100 (provisional). Functional: 3 of 3 contracts pass on current inputs; 1 issue (a wrong test rule) fixed and verified, 0 deferred.

**PR Summary:** QA found 1 issue (a test rule), fixed 1; browser health score 100 → 100; functional F1-F3 pass.
