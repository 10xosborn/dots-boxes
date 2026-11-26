# QA charters: fix/r1b-online-presence (d1c172e, 54f5110)

Base: main (39e5edc). Changed: `src/lib/online/room.ts`, `src/screens/Online.svelte`, `firebase/database.rules.json`, `tests/rules/database.rules.test.ts`, emulator mode in `src/lib/firebase/{config,app}.ts` and `src/lib/data/firebase.ts`, `firebase.json`, `.env.emulator`, `package.json`, `README.md`.

**Surfaces.** Browser (online play between two browsers; local games for regressions) and functional (the documented `npm run test:rules` command).

**Isolation.** Online flows use the emulator build (`vite build --mode emulator`) served at http://127.0.0.1:4175/ and the local Firebase emulators under the demo project `demo-dnb` (Auth 127.0.0.1:9099, Realtime Database 127.0.0.1:9000, Firestore 127.0.0.1:8080). Every browser context also aborts requests to `*.googleapis.com` (except fonts), `*.firebaseio.com`, `*.firebasedatabase.app` and `*.firebaseapp.com`, and the run fails if any such request is attempted. Regressions use the production build at http://127.0.0.1:4173/ with those hosts blocked (on-device storage). The emulator database is read and its rules switched through the emulator's admin REST API (`Authorization: Bearer owner`), local only. Nothing touches the live project.

**Driver.** gstack's own headless Chromium through gstack's bundled playwright-core (Aside is macOS-only; two isolated contexts, touch emulation, request blocking and connection control need Playwright). Host: desktop 1280x800 with mouse. Guest: phone 390x844 with touch. Connection loss is simulated with the SDK's `goOffline()`/`goOnline()`, exposed only in emulator builds.

**Budget.** Browser: Full (diff-aware), 900 s, enforced by gstack-qa-deadline. Functional: Full, per-capture timeout 300 s.

| # | Contract | Risk | Entrypoint | Exit condition |
|---|---|---|---|---|
| C1 | With the new rules, both players appear in `presence/{code}/{uid}` (one child per connection) and in the old `rooms/{code}/online` flag; a move reaches the other player | Presence never written; old clients lose the flag | `node online-r1b.mjs new` | N checks pass |
| C2 | A player who loses the connection sees "Reconnecting…" after ~2 s and can still draw; the other player sees nothing for the first seconds, then "X stepped away." after ~10 s; on reconnect the offline move arrives once, presence returns, both notes clear | Stuck "away" after a reconnect (the reported bug); lost or doubled moves; alarming copy | `node online-r1b.mjs new` | N checks pass |
| C3 | Moves never wait for presence: on your turn the note says "Your move will be waiting.", your move is saved while the friend is away, and they see it when back | Players blocked behind "Waiting for your friend to reconnect" | `node online-r1b.mjs new` | N checks pass |
| C4 | With the rules published today (no `presence/`), the same flows work through the old flag, re-registered on every reconnect, with no console errors | Shipping before the owner publishes rules breaks online play | `node online-r1b.mjs old` | O checks pass |
| C5 | After 2 minutes away the other player is offered "Leave game"; it goes away when the friend is back | Endless wait with no way out | `node online-r1b.mjs long` | L checks pass |
| C6 | Local games are unaffected: Home, the Continue card, resume, Quit/Restart, pass-and-play, resumed scoring (production build, Firebase blocked) | Regression from the shared Firebase setup changes | `node qa-r1a.mjs O`, `node qa-r1a.mjs all` | O and A-E checks pass |
| F1 | Realtime Database rules: rooms unchanged; the old online flag still writable by the room's players; `presence/` readable only by the room's two players, writable only under one's own id while in the room, values must be times, own presence always removable, onDisconnect cleanup can be registered | Rules too open (privacy) or too strict (presence never written) | `npm run test:rules` | 18 tests pass, exit 0 |
