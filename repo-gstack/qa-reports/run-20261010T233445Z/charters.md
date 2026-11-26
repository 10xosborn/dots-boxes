# QA charters: fix/r1a-resume-local-games (8b5d504)

Target: http://127.0.0.1:4173/ (vite preview of the production build). Surface: browser only (Svelte SPA, no routes; screens switch in-app).
Driver: gstack's own headless Chromium through gstack's bundled playwright-core (Aside is macOS-only; `$B` cannot block requests, and this local build talks to production Firebase).
Isolation: every browser context aborts googleapis.com, firebaseio.com, firebasedatabase.app and firebaseapp.com, so the app falls back to on-device storage. No production reads or writes. Throwaway contexts only.
Budget: Full browser run, 900 s, enforced by gstack-qa-deadline. Diff-aware scope: changed screens (Home, Game), data layer (scores, leaderboard, stats) and adjacent flows.
Changed files: App.svelte, Game.svelte, Home.svelte, lib/resume.ts, lib/state/app.svelte.ts, lib/data/{types,local,firebase}.ts, lib/progression.ts.

| # | Behavior (contract) | Risk | Entrypoint | Exit condition |
|---|---|---|---|---|
| C0 | Orientation: Home loads at desktop 1280x800 and phone 390x844 (touch) with no console errors; with a saved game, the "Continue your game" card shows and fits the phone | Layout break on Home; errors at start-up | `node qa-r1a.mjs O` | screenshots + console errors captured |
| C1 | A reload during an AI game reopens it with the same board, turn and clock, says "Game resumed", and the AI moves if it was its turn | Lost games (the reported bug); double AI moves; clock reset | `node qa-r1a.mjs A` | A1-A5 pass |
| C2 | After a browser restart (localStorage kept, sessionStorage lost) Home offers "Continue your game"; Continue opens the same game; leaving through Home keeps it; a later reload goes to Home; Discard clears it | Resume offered wrongly or never; game lost on Discard misfire | `node qa-r1a.mjs A` (B part) | B1-B6 pass |
| C3 | Quit and Restart clear the saved game; a finished game isn't kept; Play again starts fresh | Stale games resurrected; Play again broken by the new start() signature | `node qa-r1a.mjs C` | C1-C5 pass |
| C4 | Pass-and-play survives a reload on a phone with touch input, with the right player up | Two-player games lost; wrong turn after replay | `node qa-r1a.mjs D` | D1-D2 pass |
| C5 | A resumed ranked win counts for XP, stats and wins, is saved once under its game id with resumed: true, and sets no fastest-win time (results say so) | Leaderboard pollution; double counting | `node qa-r1a.mjs E` | E1-E8 pass |
