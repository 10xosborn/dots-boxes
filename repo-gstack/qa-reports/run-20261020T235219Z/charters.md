# Charters: step 3 HUD (design/09-hud-avatars, ac8e192)

Target: production build `dist-hud2` (= ac8e192) served on 127.0.0.1 by the scratchpad's `serve-two.mjs`, beside #23's build `dist-glass-A` where a comparison helps. Firebase blocked by hostname (fonts allowed); online only on the local emulators. Driver: gstack's bundled Playwright with headless Chromium 151. Isolation: a fresh browser context per session, synthetic profile "Ama" in localStorage, nothing reaches production.

| # | Behaviour (contract) | Risk | Entry point | Exit condition |
|---|---|---|---|---|
| C1 | Player cards show the AI's bot and people's silhouettes, ringed in each player's colour, in all six modes; a two-digit score never changes a card's height | the avatar or ring missing or in a wrong colour; the board moving | saved games (`hud-shots.mjs`) | screenshots of every mode and state; heights equal |
| C2 | The extra-turn cue: after a capture "Your turn · +1 extra turn" (the mover's name in pass and play and for the AI), a chain's ×2/×3, gone when the turn passes; "Extra turn." in the live region; the board never moves; a reload during an extra turn shows the cue again | wrong or stale cue; layout shift; resume losing it | real play (`hud/flow.mjs`), saved games | all six modes pass |
| C3 | Paper's score sheet: stickers, names (underlined while it is their turn), tally gates, the circled score, the turn note in every situation, the details line; long names and many tallies never break a 40 px row | overflow, clipping, a name or score pushed out | pass and play with 16-letter names, a 6x6 game with big scores, 360 px phone | rows stay 40 px; nothing overflows the sheet |
| C4 | The top bar's level chip: your avatar in the level ring (a sticker on Paper's tab), name and level; its name "Ama, level 1. Open your stats"; a long name truncates | the top bar overflowing on a small phone | Home, game, 360 px | no horizontal scroll; label right |
| C5 | The profile card's avatar on Home and Stats | — | Home, Stats | screenshots |
| C6 | Online: "Your turn" by seat, the cue from the room's moves on both screens | the guest seeing "Your turn" on the host's extra turn | two browsers on the emulators | both screens right |
| C7 | Accessibility: avatars hidden from screen readers; text contrast of the stacked pill, the Paper note, its highlighter and the small notes; keyboard play unchanged | low contrast at the smaller size | computed colours on opaque surfaces; the integrity suite's keyboard game | 4.5:1 for text |
| C8 | Responsive: 360x640, 390x844, 768x1024, 1280x800, landscape phone; one line in the pill from 520 px of bar | horizontal scroll, clipped text | each size, every mode in one state | no overflow |
| C9 | Switching theme mid-game during an extra turn swaps cards and sheet and keeps the cue | lost state, errors | theme sheet in a game | cue kept, no errors |
| C10 | Animations off: the cue, highlighter and tally marks appear without motion | motion despite the setting | `anim:false` | no running animations |
