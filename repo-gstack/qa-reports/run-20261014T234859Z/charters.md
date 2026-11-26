# Charters: the board marks PR (design/04-board-marks)

Target: the branch's production build (`index-DFqW9QV6.js`, `index-C_BYGn3r.css`, code at `a0a5a54`, docs `1609688`) served by a foreground static server on http://127.0.0.1:4173 for each probe; main's build (`2f770e0`) on :4177 for C2. Firebase blocked by hostname. Driver: gstack's playwright-core with its headless Chromium (Aside is macOS-only). Fresh browser contexts per check; nothing reaches the live database.

| # | Contract | Risk | Entry point and inputs | Exit condition | Command |
|---|---|---|---|---|---|
| C1 | The step 2 marks in all six modes: no mark before a move; one mark of the theme's kind (Tabletop pip, Neon ring, Paper pencil ellipse) centred on the last line, following each move; Tabletop's last line a shade stronger (darker by day, lighter at night), others unchanged; pass-and-play boxes carry initials; against the AI Tabletop shows a person and a bot, others initials; Paper's 4x4 lines are pencil curves with a faint second stroke, straight at 7x7, hatched boxes, bigger tilted initials; Neon at night's landing rings carry a turning core, no other mode's | New board drawing in every theme | 4x4 pass-and-play by taps; saved games (pass-and-play and AI, 4x4 and 7x7); phone 390x844 touch | 59 checks | `marks-test.mjs` |
| C2 | C1 on main | Prove the suite tests the change | As C1 | Expected to fail (no marks on main) | `APP=$MAIN_URL marks-test.mjs` |
| C3 | The elastic band and landing rings, six modes, Animations off, touch; Paper's band at its new pencil width | Paper's thinner lines feed the band | 4x4 pass-and-play | 75 checks | `spring-test.mjs` |
| C4 | Drag from dot to dot, taps, the dot's ring and the snapped ring, mouse and touch, with Paper's curved lines | Lines are now paths in Paper | 4x4 pass-and-play | 88 checks | `drag-test.mjs` |
| C5 | Board structure on odd shapes (1x1 wobbly, 1x12 and 12x12 straight, 2x7), cursor ring 3:1, rims, cores, confetti | Wobble on and off by size | Custom boards | 85 checks | `materials-probe.mjs` |
| C6 | Landing-ring contrast from pixels, with Neon at night's cores | The owner's ask | 4x4, drag held | measurements | `ring-contrast.mjs` |
| C7 | Text over its real background, every screen, six modes, phone and desktop | Unchanged screens around the board | 7 screens | 13 checks | `texture-text.mjs` |
| C8 | Viewports, rotation, colour vision, reduced motion and the Animations switch | Hatching and icons for colour-blind players | Every viewport | 27 checks | `acceptance-pr8.mjs` |
| C9 | Game integrity: Hard to the end, big boards, keyboard-only, reload, restart | Marks across a whole game | As in R1a | 35 checks | `integrity-r1a.mjs` |
| C10 | Local games' resume | The mark after a reload | As in R1a | 31 checks | `qa-r1a.mjs` |
| C11 | Drag edges (AI's turn, second finger, letting go off the board) | Adjacent | 4x4 | 10 checks | `drag-edge.mjs` |
| C12 | Themes and the picker | Adjacent | Home, game, Settings | 37 checks | `themes-test.mjs` |

Budget: browser Full, 900 s wall clock under the deadline guard. One suite per probe; a checkpoint before every probe after the first.
