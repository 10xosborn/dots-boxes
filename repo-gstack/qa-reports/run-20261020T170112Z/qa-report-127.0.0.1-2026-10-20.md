# QA Report: Grid Rivals (Dots & Boxes)

| Field | Value |
|-------|-------|
| **Date** | 2026-10-20 |
| **URL** | http://127.0.0.1:4173/ (production build `dist-qa-87b0ed6`); online on :4175 (emulator build) |
| **Branch** | fix/owner-2026-10-20 |
| **Commit** | 87b0ed6 (2026-10-20), on 0ad568e, base main ab4c706 |
| **PR** | — (opened after the gates) |
| **Tier** | Standard |
| **Scope** | Diff-aware: the owner's 2026-10-20 reports (board painting, Random starter, hover, keyboard cursor, sounds, Paper line colours) and adjacent flows (drag, resume, online) |
| **Probe budget / guarded command time** | 900 s for exploration / about 60 s across 6 guarded probes; required suites ran unbounded |
| **Pages visited** | Home, Setup, Game (AI, two players), Settings, theme sheet, Online lobby and game |
| **Screenshots** | 1 baseline + suite shots (drag, materials, resume) |
| **Framework** | Svelte 5 SPA (Vite) |

Driver: gstack's bundled Playwright with its headless Chromium 151, and headless Brave 155 (the owner's browser) for C1 and C5. Firebase blocked by hostname (fonts allowed); online only against the local emulators (demo project).

**Evidence-tool verdict: inconclusive (open: no evidence rows).** `gstack-qa-evidence` records functional command captures; this run was browser-only, so its rows are empty by design. The browser evidence is the checkpoints, probe outputs and suite logs below.

Checkpoints: [checkpoint 001](browser/exploration-001.json), [checkpoint 002](browser/exploration-002.json), [checkpoint 003](browser/exploration-003.json), [checkpoint 004](browser/exploration-004.json), [checkpoint 005](browser/exploration-005.json), [checkpoint 006](browser/exploration-006.json). Charters: [charters.md](charters.md).

## Health Score: 100/100 (provisional: Performance not scored here; /benchmark runs next)

| Category | Score |
|----------|-------|
| Console | 100 (0 errors; the only network error is the Firebase request the probes block) |
| Links | 100 (no links; every client-side route reached) |
| Visual | 100 |
| Functional | 100 |
| UX | 100 |
| Performance | not scored (/benchmark) |
| Content | 100 |
| Accessibility | 100 |

## Top 3 Things to Fix

None found by this run. (The design review before it fixed one polish item: Paper at night's box rim, `87b0ed6`.)

## Console Health

| Error | Count | First seen |
|-------|-------|------------|
| (none) | 0 | — |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

## Results by charter (final build)

| # | Contract | Result | Log |
|---|----------|--------|-----|
| C1 | Every line painted within 600 ms, every mode | Chromium 0/36 unpainted, Brave 0/36; first three lines along one row: branch 0/60 unpainted, main 24/60 (control) in both browsers | `suites/C1-*.txt` |
| C2 | Random starter | 16 rematches each: two players 10 Player / 6 Kofi; vs AI 9 Player / 7 Rookie | `suites/C2-first-random.txt` |
| C3 | No draw on hover | 8/8 | `suites/C3-hover-check.txt` |
| C4, C5 | Keyboard cursor and sounds | 20/20 Chromium, 20/20 Brave; cursor ring 7/7 at 3:1 or more (corrected later on 2026-10-20: the probe sampled beside the ring, which happened to give 5.07-10.7:1; measured on the ring's own outline it is 3.29-6.31:1) | `suites/C4C5-*.txt`, `suites/C7-materials-cursor.txt` |
| C6 | Paper lines 3:1 | 6/6 modes (Paper by day coral 3.28:1, Paper at night sand 4.38:1) | `suites/C6-line-contrast.txt` |
| C7 | Drag, band and rings, ids, confetti, theme tokens | drag 88/88, edge 10/10, spring 74/75, ids 7/7, confetti 13/13, theme tests 7/7 | `suites/C7-*.txt` |
| C8 | Resume and integrity | 31/31, 35/35 | `suites/C8-*.txt` |
| C9 | Online (emulator) | 9/9: first two lines along one row painted on both screens, host drag pick-snap-drop, the other player the line note, three moves in order, nothing to live Firebase | `suites/C9-online.txt` |
| C10 | Exploratory edges | 17/17 over 6 probes: lone line across theme switches, reload after one move, keyboard extra turn, dragged box line (box chime only), two players on one keyboard, phone tap ticks once | `browser/probe-00N.txt` |

The one spring-test failure ("paper-light: snapped, the band is the line's full width 17.425 vs 12.3") is a stale fixture: it expects PR #21's thinner pencil lines on Paper by day, and fails identically on main `ab4c706`. Prior learning applied: probes-patched-for-old-design (confidence 9/10, from 2026-10-20). The old `materials-probe.mjs shapes` part also crashes on main (it reads Neon's glow layer, built only in Neon since PR #18); not run.

## Fixes Applied

| Issue | Fix Status | Commit | Files Changed |
|-------|-----------|--------|---------------|
| (none in this run) | — | — | — |

## Limits

- Real phones and the owner's own Brave profile were not used (headless, throwaway profiles).
- The baseline load ran before the first guarded command (checkpoint 001).
- Online: one room, three moves, local emulators only.

> QA found 0 issues, fixed 0, health score 100 → 100 (provisional; performance in /benchmark).
