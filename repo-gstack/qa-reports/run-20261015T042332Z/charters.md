# Charters: online play fix (fix/online-sync, aaea14d)

Target: the branch's emulator build (`vite build --mode emulator`, the same code as the production build except the
emulator hookup) served on http://127.0.0.1:4175, against the local Firebase emulators (demo project `demo-dnb`, started
per probe with `firebase emulators:exec`, the published `firebase/database.rules.json`). Main's emulator build (2f770e0)
for the mixed-version probe. The production build on :4173 for the AI-game probes. Driver: gstack's playwright-core with
its headless Chromium (Aside is macOS-only): host on a desktop context (1280x800, mouse), guest on a phone context
(390x844, touch). Production Firebase hosts blocked in every context. Animations on unless stated (players' default).
Network delay, where stated, comes from a local TCP proxy between the browsers and the database emulator (90 ms each
way plus up to 40 ms jitter, a 4G round trip from Ghana to Belgium); a "dead connection" is that proxy dropping one
connection's data both ways while its sockets stay open.

| # | Contract | Risk | Entry point and inputs | Exit condition | Command |
|---|---|---|---|---|---|
| C1 | Every move reaches the other screen with nobody touching it; the mover's line shows at once; no request goes to the page's host while playing | The new slot writes | 5x5 room, 60 random legal moves (box completions and extra turns) | all 60 seen by the other screen within 3 s, both boards and the room agree, 0 requests while playing | `online-lag.mjs` SIZE=5 |
| C2 | Same over a 4G-like round trip; median other-screen delay under 500 ms | Speed target | 4x4 room through the delay proxy | median < 500 ms, none missed | `online-lag.mjs` via `delay-proxy.mjs` |
| C3 | A connection that dies silently recovers: waiting phone, moving phone, waking phone | The new link check | 3 fresh 4x4 games through the proxy, one connection frozen in each | each case shows the move on the other screen within seconds (main: never within 45 s, measured before this run) | `online-freeze.mjs` |
| C4 | The tap that ends a game does not press Rematch or Leave in the results dialog that opens under the finger | The dialog fix | 3x3 games until the phone draws the last line, which runs under a dialog button | no rematch, phone stays on the finished board, a later real tap on Rematch works (main fails) | `ghost-click.mjs` |
| C5 | Presence, "Reconnecting…", offline moves landing after reconnect, away notes, no lost or doubled moves | Adjacent: the link check reconnects | R1b suite, new rules | 20 checks | `online-r1b.mjs new` |
| C6 | Rejoin after reload or browser restart, ended rooms, 8 s offline limit | Adjacent | R1b-2 suite | 23 checks | `online-resume.mjs` |
| C7 | Old and new versions play each other (a tab left open on the old version) | Slot writes vs whole-room writes | main's build as host + branch as guest, then the reverse | 40 moves each, none missed | `online-lag.mjs` via `serve-two.mjs` |
| C8 | ?debug=net panel: appears only with the flag, times moves at four points, takes out clock error | New tool | 4x4 through the proxy, 16 moves | panel median within 30 ms of the harness's own measure | `online-lag.mjs` with `?debug=net` |
| C9 | AI games unchanged: results dialog buttons work, whole games, reload, restart | Shared results dialog | integrity suite on the production build | 35 checks | `integrity-r1a.mjs` |
| C10 | Local games' resume unchanged | Shared dialog | R1a suite | 31 checks | `qa-r1a.mjs` |
| C11 | The published database rules accept the new single-slot move write and refuse strangers | Rules vs the new write path | rules tests | all pass | `npm run test:rules` |

Budget: browser Full, 900 s wall clock under the deadline guard. One suite per probe; a checkpoint before every probe after the first.
