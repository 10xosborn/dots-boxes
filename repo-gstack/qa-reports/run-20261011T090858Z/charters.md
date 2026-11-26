# QA charters: fix/r1b-online-resume (4125292)

Base: main (cd588b2). Changed: `src/App.svelte` (start-up rejoins a saved room), `src/lib/resume.ts` (`dnb:room` save, load with 24 h and 10-minute rules, clear, end time), `src/lib/online/room.ts` (`rejoinRoom`), `src/lib/state/app.svelte.ts` (`roomResume`), `src/screens/Online.svelte` (save on create and join, rejoin, "Getting back into your game…", "That game has ended.", clear on Leave and when the room closes, end time on game over).

**Surface.** Browser only (no rules or data-layer change).

**Isolation.** Online flows: emulator build at http://127.0.0.1:4175/ against the local Firebase emulators (demo project `demo-dnb`); rooms deleted through the emulator's local admin REST API to simulate a closed room. Local games: production build at http://127.0.0.1:4173/ with Firebase blocked. Every context aborts live Firebase hosts and the run fails on any attempt. Throwaway contexts only.

**Driver.** gstack's own headless Chromium through gstack's bundled playwright-core (two contexts, host desktop 1280x800 with mouse, guest phone 390x844 with touch). A browser restart is simulated with a new tab in the same context (sessionStorage gone; localStorage and the IndexedDB sign-in kept, as after a real restart).

**Budget.** Full (diff-aware), 900 s, gstack-qa-deadline.

| # | Contract | Risk | Entrypoint | Exit condition |
|---|---|---|---|---|
| C1 | Creating or joining saves `dnb:room` with the right seat; a reload while waiting returns to the same code | Rejoin impossible | `node online-resume.mjs` | R1-R2 pass |
| C2 | Host reload mid-game: back in the same room and seat within 3 s (R1 acceptance); play continues; the friend never sees "stepped away" for a quick reload; guest reload and a browser restart rejoin too | The reported bug (host has no way back) | `node online-resume.mjs` | R2-R4 pass |
| C3 | Leave and a room closed during play clear the save; a room that is gone or a seat that is not yours says "That game has ended." and clears it | Stale rooms reopened forever; wrong seat taken | `node online-resume.mjs` | R5-R7, R11 pass |
| C4 | A finished game records its end on both devices; 10 minutes later with no rematch it is not reopened; a rematch clears the end; saves older than 24 h are ignored; invite links still join and save | Old games reopening; invite flow broken | `node online-resume.mjs` | R8-R10 pass |
| C5 | R1b-1 presence still works on this build (new rules) | Regression in presence from the Online screen changes | `node online-r1b.mjs new` | N checks pass |
| C6 | Local games unaffected by the new start-up step (Home, resume, Quit/Restart, pass-and-play, scoring) | AI resume precedence broken | `node qa-r1a.mjs O`, `node qa-r1a.mjs all` | all pass |
