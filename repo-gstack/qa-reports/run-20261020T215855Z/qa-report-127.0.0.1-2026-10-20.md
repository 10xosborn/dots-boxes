# QA Report: Grid Rivals (Dots & Boxes): Neon's liquid glass and thinner lines

| Field | Value |
|-------|-------|
| **Date** | 2026-10-20 |
| **URL** | http://127.0.0.1:4173/ (production build `dist-glass-A`) |
| **Branch** | design/08-liquid-glass |
| **Commit** | c421b05 (2026-10-20), stacked on fix/owner-2026-10-20 da25977 |
| **PR** | — (opened after the gates, based on #22's branch) |
| **Tier** | Standard |
| **Scope** | Diff-aware: Neon's clear liquid glass (both modes) and lines a fifth thinner (all six modes) |
| **Probe budget / guarded command time** | 900 s exploration / about 3 minutes across 6 guarded probes; the suites ran unbounded as explicit plan checks |
| **Pages visited** | Home, Setup, Game (two players, AI saved games), the results dialog, the theme sheet |
| **Screenshots** | baseline + suite shots |
| **Framework** | Svelte 5 SPA (Vite) |

Driver: gstack's bundled Playwright with its headless Chromium 151. Firebase blocked by hostname.

**Evidence-tool verdict: inconclusive (open: no evidence rows).** `gstack-qa-evidence` records functional command captures; this run was browser-only, so its rows are empty by design. The evidence is the checkpoints, probe outputs and suite logs.

Checkpoints: [checkpoint 001](browser/exploration-001.json), [checkpoint 002](browser/exploration-002.json), [checkpoint 003](browser/exploration-003.json), [checkpoint 004](browser/exploration-004.json), [checkpoint 005](browser/exploration-005.json). Charters: [charters.md](charters.md).

## Health Score: 100/100 (provisional: Performance not scored here; /benchmark runs next)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors) |
| Links | 100 |
| Visual | 100 |
| Functional | 100 |
| UX | 100 |
| Performance | not scored |
| Content | 100 |
| Accessibility | 100 |

## Top 3 Things to Fix

None found.

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

## Results by charter

| # | Contract | Result |
|---|----------|--------|
| G1 | Contrast on the glass with thinner lines | lines 6/6 modes at 3:1 or more; dots and initials 3:1 or more everywhere (White Neon's coral dots 3.07, were 3.02); keyboard ring 7/7 on its outline |
| G2 | Dialogs above the glass board | the results dialog and the theme sheet painted solid green with the board's glass layers solid magenta: 0 magenta pixels inside either dialog in both Neon modes (one sanity bound too strict for White Neon's opaque option cards; see checkpoint 003) |
| G3 | Theme switches mid-game | Dark Neon glass → Tabletop (its felt and wooden frame, no rim, glass or highlights) → Paper (its sheet) → Neon (glass back, game kept): 5/5 after a probe fix (checkpoint 004) |
| G4 | Dots clear of the rim and edge highlights | 12x12 at 1920x1080: nearest dot 46.9 px away; landscape phone 13.9 px |
| G5 | Regressions | marks 63/63, a theme switched mid-game 22/22, elastic band 75/75, drag 88/88, drag edges 10/10, sounds and cursor 20/20, paint 0/36, hover 8/8, resume 31/31, integrity 35/35, ids 7/7, confetti 13/13, theme tests 7/7 |

Probe updates made for this branch (not product changes): `spring-test.mjs` and `marks-test2.mjs` now expect the new line widths (0.068 and 0.048 of a gap); `materials-probe.mjs` samples the keyboard ring on its own outline (it had sampled beside it since the cursor became the thin preview in #22). Prior learning applied: probes-patched-for-old-design (confidence 9/10, from 2026-10-20).

## Fixes Applied

None needed.

> QA found 0 issues, fixed 0, health score 100 → 100 (provisional; performance in /benchmark).
