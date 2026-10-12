# Grid Rivals UI Themes: Spec

> **Palette and materials update (owner, 2026-10-12).** The three themes keep their layouts but take new palettes and real materials: Tabletop is a felt mat in a wooden rim on a maple or walnut table, Neon a room lit by its colours with glowing lines and controls, Cozy Paper a sheet of real-looking paper with printed lines. Each theme's tokens (section C) hold the current values; where older colour names elsewhere in this spec disagree (teal, slate purple, blue ink, chalkboard and so on), the tokens and this note win.

Oct 12, 2026 · @Osborn Tulasi

The canvas holds three themes, all drawn on the same game moment: desktop and phone game screens, setup, an avatar builder, and the same "You win!" results screen in each theme's style. Minimalist Premium and Neon each come in light and dark. I recommend **Minimalist Premium**, the tabletop look built from your reference pictures. **Neon**, your original layout in coral and slate purple, is the cheapest upgrade. Each theme's full spec is in its own tab under Theme specs.

## What every theme must handle

Every theme shows only what Grid Rivals does today, plus a few presentation changes your overhaul plan already approved; anything else is marked as an enhancement. The reference site (gametable.org) was used only to check the game's functions: it offers up to 4 players, 4 AI levels, several board sizes, board themes and drag-between-dots input.

| Item | Status | Where it lives today |
| --- | --- | --- |
| Two players: you against an AI (Rookie, Tactician, Maestro) or two people on one device; online games by invite link | In the game | Setup.svelte, Online.svelte |
| Board sizes 3×3 to 6×6 (ranked) and custom up to 12×12 | In the game | SizePicker.svelte, boardFit.ts |
| Who starts: me, AI or random | In the game | Setup.svelte |
| Scores, whose turn, AI thinking, clock, board size, difficulty, level | In the game | PlayerCards.svelte, Game.svelte |
| Player avatars beside the names: your own avatar, and a bot for the AI | New in these mockups, with an avatar builder screen | PlayerCards.svelte and ProfileCard.svelte (initials today), TopBar.svelte, Setup.svelte; new AvatarBuilder.svelte |
| Box ownership by colour, pattern and initials | In the game | Board.svelte |
| Line preview on hover or press; keyboard cursor (arrow keys and Enter) | In the game | Board.svelte |
| Extra turn after closing a box | Rule only; no visual cue today | rules.ts |
| Restart and Quit, with a browser confirm() | In the game | Game.svelte |
| Results: title, score, time, XP and level bar, leaderboard comparison, rank, Play again, Change settings, Leaderboard | In the game | ResultsModal.svelte |
| Light and dark themes | In the game (toggle) | app.css, Settings.svelte |
| Extra-turn cue and last-move marker | New in these mockups; approved in your plan (F4) | Board.svelte, PlayerCards.svelte |
| Themed confirm dialog in place of confirm() | New, recommended | Game.svelte |
| Picture of the finished board on results | Planned in your brief (F8 BoardSnapshot) | new component |
| Up to four players | Enhancement, not built: rules, AI, online rooms and scores all assume two players | rules.ts, AI, online code |
| Theme picker | Enhancement: Settings has light/dark only | Settings.svelte |

The mockups use one sample game everywhere: Ama (you, level 7) against Tactician (Medium AI) on 5×5, 5–4 after 42 lines, and Ama has just closed a box. The finished game is 14–11 in 4:12.3.

## Comparison

Minimalist Premium reads best on the board, Neon costs least to build, and Cozy Paper has the most charm. Ratings use one scale: High, Medium or Low.

| Theme | Visual personality | Board readability | Mobile suitability | Implementation complexity | Best use case |
| --- | --- | --- | --- | --- | --- |
| 1 Minimalist Premium (tabletop), light and dark | Warm and tactile: a board game on a table; the dark "night table" keeps the warmth | High: grey lanes show every possible line; strong lines; solid fills with a person or bot icon | High: the same single column as the other themes; Quit and Restart within thumb reach | Medium: a wood texture tile, offset line shadows and an icon set | Default look for casual and younger players, in every mode |
| 2 Neon (your original layout), dark and light | Soft and modern: coral accents on a slate-purple to soft-white gradient, with glowing lines | High: coral against slate (or soft white at night), plus patterns and initials | High: today's single column | Low: token changes in app.css and one glow filter on the line group | The fastest refresh of today's app; a calmer neon look |
| 3 Cozy Paper and Notebook | Handmade and nostalgic | Medium: wobbly pencil lines and hatching lose precision on boards above 6×6 | Medium: the two-page spread has to collapse to one page | High: paper texture, hand-drawn paths and selection marks, two fonts | Relaxed pass-and-play; a seasonal skin |

The trade-off runs one way: the more personality a theme carries, the more it costs to build and the harder its board is to read on big boards. Neon is cheap and clear but the least warm; Cozy Paper is the warmest but the least precise.

## Recommendation: Minimalist Premium

Build Minimalist Premium, the tabletop, as Grid Rivals' main look, in light and dark. Keep Neon as the quick interim refresh if the full redesign has to wait. Cozy Paper fits later as an optional skin, once a theme picker exists.

- **Usability:** grey lanes show every legal line before you touch the board. Dark lines and solid fills read at a glance from 3×3 to 12×12. The person or bot icon in each box shows ownership without relying on colour.
- **Visual distinction:** it moves Grid Rivals from a screen-like look towards a warm, physical game. It has to stay its own: Grid Rivals' colours, the Jost typeface, its own icons, no copied wood photo or wording from the reference site.
- **Responsiveness:** the same single column as Neon and Cozy Paper, so phones need no separate layout; Quit and Restart sit within thumb reach under the board.
- **Maintainability:** flat fills and one texture tile. Line shadows are a second offset line, not CSS filters. One token set covers light and dark.
- **Game feel:** friendly for 10–17-year-olds and adults alike, and it works for AI, pass-and-play and online games.

Its risk: the board and colours are close to your reference pictures, so keep the differences above.

| Borrow | From | How it fits without clashing |
| --- | --- | --- |
| Highlighter on the extra-turn message | Cozy Paper and Notebook | A yellow swipe behind "go again" so the extra turn is hard to miss |
| Hatching as a second ownership cue | Cozy Paper and Notebook | Offered in a high-contrast setting, under the icon |
| Soft glow on the active player | Neon | A warm halo round the active avatar on the night table, in place of a plain ring |
| Picture of the finished board | Your plan (F8 BoardSnapshot) | The results dialog already sits over the finished board; a later "Save image" button fits in its actions |

## Shared spec (every theme)

All themes share one component set and one rules engine: a theme changes tokens and a few component variants, never rules.ts or the input logic.

### Theme architecture

- **Tokens:** CSS custom properties per theme and mode, e.g. `[data-skin="table"]` and `[data-skin="table"][data-theme="dark"]`. Today app.css sets `:root` (dark) and `[data-theme="light"]`, and app.svelte.ts writes `root.dataset.theme`; add `data-skin` beside it.
- **Modes:** Minimalist Premium and Neon ship light and dark sets, and both are mocked up. Cozy Paper's dark set (a chalkboard) is specified in its tab but not mocked up.
- **Board skin:** a new src/lib/theme/skins.ts exports each theme's board ratios and flags; Board.svelte reads them. Geometry stays `layout()` and `PAD` from boardFit.ts.
- **Fixed heights:** the turn line and the extra-turn cue keep a reserved height, so turn changes never move the board.
- **What a theme may configure:**

| Property | Values used by the themes |
| --- | --- |
| Colours, fonts, radii, shadows | Token sets in each theme tab |
| Line width, dot radius, box inset and radius | Ratios of the dot gap (sp) |
| Undrawn lanes | Shown (Minimalist) or hidden (Neon, Cozy Paper) |
| Line colour | Neutral (Minimalist) or by the player who drew it (Neon, Cozy Paper) |
| Ownership mark | Person or bot icon (Minimalist), initial plus pattern (Neon), hatching plus a handwritten initial (Cozy Paper); never colour alone |
| Last-move marker | Darker line plus pip (Minimalist), ring (Neon), hand-drawn ellipse (Cozy Paper) |
| Line preview | Ghost line (Minimalist), dotted (Neon), pencil dots (Cozy Paper) |
| Turn indicator | Sliding pill (Minimalist, Neon), circled score and a turn note (Cozy Paper) |
| Controls | Quit and Restart under the board in every theme (paper tabs on Cozy Paper) |
| Game over | The same results dialog in each theme's style (next section) |

### Player avatars

Each player's own avatar sits beside their name, and the AI shows a friendly bot by default. Avatars are decoration: the name beside them carries identity, so screen readers skip them.

| Where | Size | What shows |
| --- | --- | --- |
| Player cards, in the game and behind the results dialog | 40 px Minimalist, 38 px Neon | The avatar in a circle, a 2 px gap in the card colour, then a 2 px ring in the player's colour |
| Top bar level chip | 26 px in a 36 px ring (Minimalist, Neon); 28 px on Cozy Paper's tab | Your avatar, then "Ama" and "Lv 7"; the ring shows progress to the next level |
| Minimalist results header | 48 px | Both avatars beside the final score |
| Setup, "Your name" | 48 px Minimalist, 50 px Neon, 32 px Cozy Paper | Your avatar with a pencil badge; tapping it opens the avatar builder |
| Cozy Paper score rows | 28 px desktop, 24 px phone | Round stickers ringed in the player's pencil colour: in the page margin on desktop, before the name on phones |

- The AI's default avatar is a white robot head (antenna, dark visor, two lit eyes) on the AI's colour. Visor and eyes: #2B241D (#241C15 dark) and #7FD3DD in Minimalist; #1F1C25 (#2B2731 light) and #F6F6F6 in Neon; #2E2B27 and #FFE58A in Cozy Paper.
- Players make their avatar in the avatar builder (below); Ama's is a sample. A player with no avatar yet gets a plain person silhouette in their colour.
- Two players on one device each pick an avatar on Setup. Showing an online opponent's avatar means storing it with their profile in Firebase, a change that needs your approval first.
- The board's ownership marks stay as they are: an avatar is too detailed at box size.

#### Avatar builder

Players make their avatar on one phone screen, opened from the avatar beside "Your name" on Setup. It has a big preview with Undo and Random either side, five tabs, the choices for the open tab, then Save avatar. Press Play on its board to try it.

| Tab | Choices |
| --- | --- |
| Face | Skin tone (6), eyes (Dots, Happy, Wink, Wide), mouth (Smile, Grin, Open, Calm) |
| Hair | Style (Bun, Puffs, Afro, Short, Buzz, Braids, Locs, Long) and colour (Black, Brown, Auburn, Blonde, Grey, Blue, Pink, Purple) |
| Top | Tee, Hoodie, Collar or Jersey, in Green, Teal, Blue, Purple, Red, Orange, Yellow or Charcoal |
| Extras | Glasses (None, Round, Square, Shades) and headwear (None, Cap, Headphones, Wrap), worn in the top's colour |
| Backdrop | Sun, Peach, Rose, Lilac, Sky, Mint, Lime, Sand, Indigo or Night |

- Every tap updates the preview at once, and each choice shows your avatar wearing it. Random picks a full set, Undo returns to the last saved avatar, and Save avatar stores it; the button reads "Saved" until the next change.
- Store the avatar as ten small choices, not a picture: skin (1 to 6), hair, hairColour, eyes, mouth, top, topColour, glasses, headwear and bg, each saved by its name from the table. One Avatar.svelte draws it from the same layered paths as the mockup; the board's script holds them all.
- Save it on the device with the player's name. Putting it in Firebase, so online opponents see it, waits for your approval.
- A cap or wrap hides the top of the hair (bun, puffs, afro); braids, locs and long hair still hang below it.
- The choices panel fills a fixed space, so switching tabs never moves Save avatar and the screen never scrolls. The tabs form a tablist, each choice is a button with a name and a pressed state, and the preview has a text description such as "bun hair in black, green tee, on sun".

### Game-over screens

All three themes show the same "You win!" results screen: today's results dialog (ResultsModal.svelte), styled in each theme's fonts and colours.

| Theme | How the results screen looks |
| --- | --- |
| Minimalist Premium (light and dark) | A square white sheet (a dark sheet at night) over the dimmed table: gold trophy, "You win!" in Jost, the score in the players' colours, chips, the XP block, the leaderboard note and rank, a teal Play again pill, then Change settings and Leaderboard |
| Neon (dark and light) | The same dialog with rounded corners in the coral palette, set in Unbounded and Manrope |
| Cozy Paper and Notebook | The same content as a torn scorecard over the board page, with tallies, a hatched level bar and an XP stamp |

### The eight game events

The mockups show these states; none of the behaviour exists until it is built. Logic marked "today" is already in the code.

| Event | Game logic | Visual feedback (each theme's tab gives its version) | Timing |
| --- | --- | --- | --- |
| 1. Hover or focus a valid line | Today: Board.svelte picks the nearest undrawn line within 0.34 of the dot gap; arrow keys move a cursor; only on the human's turn | Preview in the mover's colour; keyboard cursor adds a focus ring | Instant |
| 2. A line is drawn | Today: commit() → play(); lines.push({e, p}); sound; live-region text | The line grows from the nearer dot; the last-move marker moves to it | ≤ 240 ms |
| 3. A box is completed | Today: play() returns the closed boxes; the score updates; sound | The box fills and its mark appears; the score changes; optional "+1" that floats away (aria-hidden) | Fill ≤ 320 ms |
| 4. The turn changes | Today: the turn passes when no box closed; the AI waits 300–800 ms, then moves | The turn indicator moves to the other player; AI shows its thinking state | 200–300 ms |
| 5. Extra turn | Today: the rules keep the turn after a capture | An extra-turn cue for the mover until they draw again; x2 and x3 for chains (plan F4) | Cue in 160 ms |
| 6. Game over | Today: finish() runs 500 ms after the last line (60 ms with animations off); XP and leaderboard save | The theme's own game-over screen; confetti only on a win with animations on | 200–600 ms |
| 7. Restart or back to setup | Today: restart() and quit() ask confirm() when moves exist; Change settings goes to Setup | A themed confirm dialog replaces confirm(); Play again keeps focus | Dialog 160 ms |
| 8. Desktop to phone | Today: boardFit.ts sizes the board; MIN\_TAP\_PX is 40 | Each theme's own phone layout, not a shrunk desktop | See breakpoints |

### Accessibility

- Text at least 4.5:1, large text and icons at least 3:1, each player colour at least 3:1 against its board (the theme tabs list the computed ratios).
- Never colour alone: every box carries a pattern, initial or icon, and the turn indicator names the player.
- A visible 2–3 px focus ring in the theme's focus colour; the board stays a keyboard widget (role="application", arrows and Enter).
- Touch targets at least 44 px; a dot gap of at least 40 px (MIN\_TAP\_PX).
- Honour the Animations setting and prefers-reduced-motion; no flashing, shaking or zooming.
- Dialogs: role="dialog", aria-modal, a labelled title, a focus trap, Play again focused on open.
- Keep the existing live-region announcement and add "extra turn" to it.

### Breakpoints

- **Phone, under 640 px:** the same single column; the board is the viewport width minus 32 px. Nothing scrolls: each screen fits the viewport height (100dvh), and the board shrinks first when space runs short.
- **Tablet, 640–1023 px:** the phone layout, centred, at most 600 px wide.
- **Desktop, 1024 px and up:** one centred column, at most 680 px wide (Cozy Paper keeps its two-page spread); the board at most 600 px and no taller than the viewport minus the chrome.
- **boardFit.ts:** `available()` mirrors today's CSS (330 px of chrome, a 640 or 680 px app width). Every theme changes the chrome, so update those numbers per theme, or measure the board's container with a ResizeObserver and pass the real size to `fits()` and `dotGapPx()`.

## Limits and assumptions

- The mockups are HTML on the canvas, not pictures from an image model, and they are not working code: no game logic runs in them. The Tweaks switch only swaps pre-drawn moments: Extra turn or Tactician thinking.
- Minimalist Premium's board and feel follow your reference pictures, but in Grid Rivals' own colours, type, icons and words; its game screens use the same layout as the other themes, so it is not a copy of those screens.
- Palettes (owner, 2026-10-12): Paper and Neon use orange #FF8C32, teal #00B58C, indigo #4657CE, cyan #21BDCA and coral #FC4422; Tabletop uses burnt orange #D77027, pale mint #C4DFC9, pastel yellow #F7CD70 and golden yellow #F4AF3D by day, and coral red #E9494B, sage #AEC8BF, pale butter #F4DD97 and turquoise #63C1C8 at night. Where a palette colour is too light or too dark for text or a thin mark, a deeper or lighter shade of it is used (listed in each theme's tokens).
- The Cozy Paper boards were rebuilt from its spec tab after the marker version was dropped, because the canvas can't hand back earlier copies of a board. Small drawing details may differ from the first version.
- The sample numbers are placeholders built on your real formulas: +168 XP = 60 × 1.5 (Medium) × 1.8 (5×5) + 2 × 3 (margin), from progression.ts. Kwame's 3:06.8 and the ranks are made up.
- The avatar art is a starting set made for these mockups and worth a pass by an illustrator; the app stores no avatar today (PlayerCards and ProfileCard show initials).
- Fonts load from Google Fonts in the mockups; your plan asks for self-hosted fonts.
- Wood and paper textures are drawn with SVG noise in the mockups; ship one small tiled image (at most 25 KB) instead.
- Contrast ratios were computed from the hex values; check them again on real phones.
- Up to four players and a theme picker are listed as enhancements only; nothing in the mockups assumes them.

# Theme specs

One tab per theme, each with its mockups (A), rationale (B), tokens (C), components (D), interactions (E) and build notes (F). Every value matches the artboards on the canvas.

1. Minimalist Premium (recommended), light and dark
2. Neon (your original layout, coral), dark and light
3. Cozy Paper and Notebook

# 1 · Minimalist Premium (tabletop)

A warm tabletop: one white board sheet on light wood, in the same layout as Neon and Cozy Paper and with the same "You win!" results dialog. The board and the wood come from your three reference pictures, in Grid Rivals' own colours, type and icons.

## A. Mockups

Canvas rows 1 (light table) and 2 (night table): Desktop game (a hover preview and the extra-turn chip), Phone game (Tweaks → moment: Extra turn or Tactician thinking), Setup, Game over, and Avatar builder (press Play to try it).

## B. Rationale

- **Mood and audience:** friendly and calm, like a board game on a table; casual players, students from 10 up, and adults.
- **Identity:** a felt game mat in a wooden rim on a maple (or walnut) table: lines and dots engraved in the felt, a printed guide under every possible line, solid box fills with a rim and an icon or initial, cream cards that cast soft shadows. Burnt orange marks you and the main action by day (coral red at night); golden yellow (turquoise) the other player.
- **Layout:** the same single column as Neon and Cozy Paper, at most 680 px wide: top bar (brand and level chip), two player cards, the turn pill, chips, the board, then Quit and Restart.
- **Type:** one family, Jost: geometric, friendly and readable at 13 px, with tabular figures for scores and the clock.
- **Legibility:** the sheet is the only white surface under the board; lanes show the legal moves; the active player's card gets a ring and a soft glow, and the pill names whose turn it is.
- **Advantages:** the clearest board for beginners; tactile without heavy effects; the same controls as every other theme.
- **Trade-offs:** the board is close to the reference site's; the bot icon must become an initial in pass-and-play and online games.

## C. Tokens


| Token | Light (maple table) | Dark (walnut table) | Used for |
| --- | --- | --- | --- |
| --table | #E3B970 | #2A1F18 | The table: wood tile, plank seams, light from above, darker edges |
| --felt | #C4DFC9 (pale mint) | #2F3F39 (sage, deepened) | The board: a felt mat with a fine nap |
| --frame | #B0602A | #3B2A1E, brass edge #F4DD97 | The board's wooden rim (wood grain) and its cast shadow |
| --lane | rgba(35,57,45,0.17) | rgba(174,200,191,0.14) | Printed guide under every undrawn line |
| --line | #23392D | #AEC8BF (sage) | Drawn lines, engraved, the same for both players |
| --dot | #2C4637 bead | #E8CF83 brass peg (pale butter) | Dots, engraved |
| --p1 | #D77027 (burnt orange) | #E9494B (coral red) | You: box fill, card ring, turn pill, preview |
| --p1-deep | #C2611F | #F06567 | Your score |
| --p2 | #F4AF3D (golden yellow) fill, #B07A12 marks | #63C1C8 (turquoise) | AI or player 2 |
| --p2-deep | #9C6B0E | #7FD1D7 | Their score |
| --box-rim | #9E4E17 and #94650C | #FF9A9B and #A5E4E8 | Rim round each player's boxes (their visible edge on the felt) |
| --accent | #D77027 | #F4DD97 (pale butter) | Primary buttons and progress |
| --accent-lip | #9E4E17 | #8C7536 | Pressed edge; hover darkens towards it |
| --on-accent | #FFFFFF (19 px bold) | #2A1F18 | Text and icons on the accent |
| --ink | #2B241D | #F4EBDD | Text |
| --ink-2 | #5A4632 | #C9BBA6 | Secondary text |
| --pill | #FFF8E9 | #3A2C23 | Cards, chips and the turn pill |
| --control | #F6EAD0 | #46362B | Unselected controls |
| --select-tint | #FCE6B2 (pastel yellow) | #4A4126 | Selected options |
| --sel-ring | #9E4E17 | #F4DD97 | Ring round the selected option |
| --focus | #8A3F0E | #63C1C8 | Focus ring |
| --gold | #8C5F0A | #F4DD97 | Gold text (rank 1) |

Computed contrast: ink on the cards 14.5:1 (night 11.4:1); ink-2 8.4:1 (7.1:1); lines on the felt 8.7:1 (6.3:1); box rims on the felt 4.2:1 and 3.6:1 (5.5:1 and 7.9:1); white on burnt orange 3.4:1, so primary labels are 19 px bold; dark labels on the butter buttons 12:1; focus 4.1:1 on the table and 7.1:1 on the cards (7.6:1 and 6.4:1 at night).

- **Type (Jost):** brand 19 bold; card names 16 bold; scores 30 extra-bold; turn pill 14 bold; chips 14 semibold; screen title 30 bold; labels 14 semibold; body 14–15; results title 36 extra-bold and results score 40 extra-bold; buttons 16–22.
- **Spacing:** 4, 8, 12, 16, 24, 32 px.
- **Radii and borders:** cards and Quit/Restart 14 px; pills and chips 999 px; badges 50%; setup controls 12–14 px; the board sheet square. No borders: depth comes from shadows.
- **Elevation:** sheet `0 2px 0 rgba(90,64,36,.08), 0 22px 36px -18px rgba(70,46,20,.55)`; cards, chips and the pill `0 6px 14px -8px rgba(60,38,14,.5)`; Quit and Restart a `0 4px 0 #CDB894` pressed edge (`#15110E` at night).
- **Board (sp = the gap between dots):** line 0.14 sp; lane 0.12 sp; dot radius 0.13 sp; line and dot shadows offset 0.03 sp right and 0.04 sp down; box fill covers the cell inside the lines with a 0.04 sp rim of --p1-deep or --p2-deep; icon 0.34 sp, white at 94%; preview capsule 0.30 sp at 32% with dashed rings (radius 0.22 sp) on both dots; last-move pip radius 0.08 sp.
- **Motion:** line 200 ms ease-out from the nearer dot; box 240 ms fade with the icon scaling 0.8 → 1; the turn pill's half slides over 350 ms; game over: the scrim fades in over 200 ms and the results dialog rises 12 px over 260 ms. Reduced motion: fades only.

## D. Components

| Component (file) | Treatment | States | Responsive |
| --- | --- | --- | --- |
| Game layout (Game.svelte) | One column, at most 680 px: top bar, player cards, turn pill, chips, the board, Quit and Restart | – | Same order on phones; the board is the width minus 32 px and the page never scrolls |
| Top bar (TopBar.svelte) | Brand mark and "Grid Rivals" in Jost; the level chip is a white pill with your avatar inside a teal progress ring, then your name and level | – | – |
| Player cards (PlayerCards.svelte) | White card: the player's 40 px avatar (the bot for the AI) in a 2 px ring of their colour, name and level, the score in the player's deep colour | Active (2 px ring in the player's colour plus a soft glow); inactive; thinking | Two columns at every width |
| Turn pill (.turnbar) | White pill whose tinted half slides to the mover; "Your turn · +1 extra turn" after a capture | Your turn; their turn; thinking; extra turn | – |
| Chips (Game.svelte) | White pills: clock, size, difficulty, and level with a mini bar | – | Wrap to two lines on narrow phones |
| Board (Board.svelte) | White sheet, lanes, charcoal lines with offset shadows, solid fills with icons, dots with shadows | Idle; preview (capsule and dashed rings); keyboard cursor (3 px teal ring round the line); last move (darker line and pip); not your turn (no preview) | Size from boardFit.ts |
| Quit and Restart (Game.svelte) | Two white buttons with a wood-dark pressed edge; the same quit() and restart() | Hover; pressed (the edge collapses); focus ring | Side by side, full width |
| Confirm dialog (new; replaces confirm()) | Small white card: title, one line, two pills, the safe action first | Safe action focused; Esc closes | Centred; full width minus 32 px on phones |
| Setup (Setup.svelte, Seg.svelte, SizePicker.svelte) | White sheet on the table; tiles for mode and AI opponent; chips for board size and who starts; your avatar with a pencil badge beside the name field opens the avatar builder | Selected (teal fill, or teal ring and tint); unselected; focus; disabled (sizes that don't fit the screen) | One column |
| Avatar builder (new AvatarBuilder.svelte) | Back and "Your avatar" as on Setup; a 148 px preview in a 4 px sheet gap and 8 px blue ring, with white round Undo and Random buttons; a white tab bar whose chosen tab is teal; the white sheet holds the choices: cells #F1EFEA, the chosen one #E2F2F3 with a 3 px teal ring (night: #2E2823, #10363A, #3FB8C5); colours as pills with a teal outer ring; the teal Save avatar pill | Tab chosen; choice chosen; Saved | Phone layout at every width; the choices sheet fills the space left, so nothing scrolls |
| Primary button | Teal pill, 56–60 px, white text, pressed edge | Hover; pressed; focus; disabled; loading ("Starting…") | Full width on phones |
| Game over (ResultsModal.svelte) | The same results dialog as the other themes, on a square white sheet over the dimmed table: gold trophy, "You win!", the score, chips, the XP block, the leaderboard note and rank, a teal Play again pill, then Change settings and Leaderboard pills | Win (trophy); loss and draw (today's icons); level up (adds a chip); save failed (today's message) | Centred; at most 460 px wide, full width minus 32 px on phones |

Configurable without duplicating the UI: avatar (the player's own, the bot, or a silhouette), player colours, lanes on or off, controls in a menu or inline.

## E. Interactions

| Event | What the player sees |
| --- | --- |
| 1. Hover or focus a line | A translucent blue capsule over the line and dashed rings on its two dots; keyboard focus adds a 3 px teal ring |
| 2. Line drawn | The line grows from the nearer dot in 200 ms and stays darker, with a blue pip, until the next move |
| 3. Box completed | The fill fades in with its icon; your score counts up in your card |
| 4. Turn changes | The pill's tinted half slides to Tactician and reads "Tactician is thinking…"; Tactician's card takes the ring |
| 5. Extra turn | The pill reads "Your turn · +1 extra turn" until you draw again |
| 6. Game over | 500 ms after the last line the scrim fades in and the results dialog rises over the board: trophy, title, score, chips, XP, leaderboard lines, actions |
| 7. Restart or setup | Restart or Quit → confirm dialog → the board clears with a 200 ms fade, or Home; Change settings opens Setup |
| 8. Desktop to phone | Already one column: phones get the same layout, the board takes the full width minus 32 px, and nothing scrolls |

## F. Build notes

- **Token names:** as in C. Map today's names: --bg1 and --bg2 → --table, --text → --ink, --muted → --ink-2; keep --p1 and --p2.
- **Font:** Jost, self-hosted (400, 600, 700, 800).
- **Assets:** one original 512 × 512 WebP wood-grain tile (at most 25 KB), not the reference site's photo; inline SVG icons for person, bot and back.
- **Hierarchy:** board first, turn pill second, scores third, controls last.
- **Must match the mockup:**
  - [ ] Lanes under every undrawn line
  - [ ] Lines 0.14 sp with an offset shadow line, no CSS filters
  - [ ] Last move darker, with a pip
  - [ ] Solid fills with a white icon and a darker rim
  - [ ] Same layout as Neon and Cozy Paper: top bar, cards, turn pill, chips, board, Quit and Restart
  - [ ] Phones never scroll
  - [ ] Game over: the results dialog on a white sheet, with Play again as the teal pill
- **Pitfalls:** draw all line shadows in one group under the lines; keep the wood on the page, never under the board; pass-and-play and online games need initials instead of the bot icon; don't reuse the reference site's copy, icons or texture.

# 2 · Neon (coral)

Your original Grid Rivals layout in your five colours. Coral #FB5553 marks you and every primary action; muted slate purple #736C7E tops the screen and marks the opponent. Soft white #F6F6F6, light gray-lavender #E1DEE3 and dusty mauve gray #A69EA8 fill the gradient and the surfaces. It comes in dark and light, and it is the cheapest theme to build.

## A. Mockups

Canvas rows 3 (dark) and 4 (light): Desktop game, Phone game (Tweaks → moment: Extra turn or Tactician thinking), Setup, Game over (today's results dialog, recoloured), and Avatar builder (press Play to try it).

## B. Rationale

- **Mood and audience:** soft and modern, like the pastel neon in your picture; today's players, who keep every habit.
- **Identity:** today's layout and fonts (Unbounded and Manrope) in a room lit by the five colours: dark glass panels with thin indigo borders, a board with a lit edge, lines that glow like tubes with bright cores, dots like indicator lights; the main action, the selected option and the turn pill glow, other controls only on hover.
- **Colour logic:** coral is you in both modes; cyan (night) or indigo (day) is the other player; teal (night) or indigo (day) is the main action; orange is gold and highlights.
- **Layout:** unchanged single column, at most 680 px wide: top bar, two player cards, the turn pill, chips, the board, then Quit and Restart.
- **Legibility:** the players differ in hue and saturation (coral against slate), pattern (stripes against dots) and initial; at night coral and the gray-lavender lines also differ 2.4:1 in lightness.
- **Advantages:** the lowest build cost; nothing to relearn; a softer neon than the earlier versions.
- **Trade-offs:** coral is pale for an accent on white (3.2:1), so it never carries small text. Coral marks both you and the buttons, so actions are solid coral shapes while your marks are lines and boxes. The glow costs one SVG filter on the line group.

## C. Tokens

These are today's variable names in app.css, plus a few new ones, so the change is mostly a value swap.


| Token | Dark | Light | Used for |
| --- | --- | --- | --- |
| --page | #070A18 | #EEF1FA | The room, lit from its corners by indigo, cyan, coral and orange light |
| --board | #0B0F24, indigo glow inside, cyan-lit edge | #FFFFFF, cyan-to-indigo edge glow | The board: dark (or bright) glass with a faint grid |
| --text | #EEF1FF | #141832 | Text |
| --muted | #A7AECB | #4F5577 | Secondary text |
| --p1 | #FC4422 (coral) | #FC4422 | You: glowing lines, boxes, card and pill |
| --p2 | #21BDCA (cyan) | #4657CE (indigo) | AI or player 2 |
| --line | coral and cyan tubes with bright cores, near and far glow | coral and indigo with a soft glow | Drawn lines |
| --dot | cyan indicator light | indigo with a soft glow | Dots |
| --box | the player's colour at 32%, rim and glow | the player's colour, solid, soft glow | Boxes |
| --accent | #00B58C (teal), dark label | #4657CE (indigo), white label | The main action, glowing most |
| --sel-ring | #7D8BFF (indigo, lightened), glow | #4657CE, glow | The selected option |
| --focus | #21BDCA | #4657CE | Focus ring |
| --gold | #FF8C32 (orange) | #B5560C | Trophy, rank 1, highlights |
| --panel | #10142C, 1 px indigo border | #FFFFFF, 1 px indigo border | Cards, chips, panels |

Computed contrast, dark: text on panel 16:1; muted 8.3:1; coral lines on the board 5.4:1, cyan 8.3:1; white initials on the boxes 10:1 or more; dark labels on teal 7:1; focus 8.6:1. Light: text on white 17:1; muted 7.3:1; coral lines 3.5:1 and indigo 6:1; white labels on indigo 6:1; focus 5.3:1.

- **Type:** unchanged: Unbounded 700/800 for the brand, scores, initials and the results title; Manrope 400–800 for everything else, at today's sizes. Labels on coral buttons are 19 px bold.
- **Spacing and radii:** unchanged: 22 / 14 / 10 px radii and today's gaps.
- **Elevation:** the board frame `0 0 34px -6px rgba(251,85,83,.5)` (dark) or `0 0 30px -8px rgba(251,85,83,.45)` (light), plus a soft drop shadow. No backdrop-filter anywhere.
- **Glow:** one blur filter on the group of lines (0.04 sp dark, 0.022 sp light) and a soft halo on the active player card.
- **Board:** today's geometry (line 0.085 sp, dot 0.07 sp, box inset 0.1 sp with radius 0.12 sp, initials 0.32 sp; phones use line 0.1 sp and dot 0.085 sp). Solid box fills with stripes for you and dots for the opponent; a dotted coral preview; a coral last-move ring (radius 0.09 sp).
- **Motion:** today's timings (line 200 ms, box pop 420 ms, score bump 450 ms, turn pill 350 ms), with ease-out in place of the overshooting curves.

## D. Components

| Component (file) | Change | States |
| --- | --- | --- |
| Background (app.css: body, .aurora) | Remove the aurora; the slate-purple-to-soft-white gradient (light) or slate-to-deep-slate (dark) | – |
| Panels and modal (app.css: .panel, .modal) | Remove the backdrop-filter blur; solid panels | – |
| Primary button (app.css: .btn.primary) | Solid coral with a white 19 px bold label and a 4 px darker lip; no gradient | Hover 8% lighter; pressed (lip collapses); focus ring; disabled 40% |
| Top bar (TopBar.svelte) | Brand in soft white on the slate band; the level chip stays a panel, with your avatar inside a coral progress ring | – |
| Player cards (PlayerCards.svelte) | The player's 38 px round avatar (the bot for the AI) in a 2 px ring of their colour; active card: 1 px border and ring in the player's colour, plus a soft halo | Active; inactive; thinking |
| Turn pill (.turnbar) | The sliding half takes the mover's tint; adds "· +1 extra turn" after a capture | Your turn; their turn; thinking; extra turn |
| Board (Board.svelte) | Solid box fills with pattern and initial; one glow filter on the line group instead of a filter per line; a thin coral frame; the last-move ring | Idle; preview; keyboard cursor; last move |
| Segmented controls (Seg.svelte) | Selected: coral tint and a 1.5 px coral ring | Selected; unselected; focus; disabled |
| Name field (Setup.svelte) | Your 50 px avatar with a coral pencil badge beside the name; tapping it opens the avatar builder | Hover; pressed; focus |
| Avatar builder (new AvatarBuilder.svelte) | The top bar as on Setup, its chip showing your saved avatar; a 128 px preview with a coral ring and glow, and round Undo and Random buttons; a tab bar styled like Seg.svelte; choice cells #221F28 (light #F6F6F6), the chosen one #4A2629 (light #FFE8E7) with a coral ring; colours as pills; the coral Save avatar button | Tab chosen; choice chosen; Saved |
| Results (ResultsModal.svelte) | Today's dialog, recoloured: gold trophy, coral score and XP bar, solid panel, no blur | Win; loss; draw; level up; save failed |

## E. Interactions

| Event | What the player sees |
| --- | --- |
| 1. Hover or focus a line | A dotted coral line; the keyboard cursor is a wide translucent coral line |
| 2. Line drawn | The line grows in 200 ms (as today), glows softly, and takes the last-move ring |
| 3. Box completed | The box fills with its colour, pattern and initial; the score bumps, without overshoot |
| 4. Turn changes | The pill's half slides to the other player and takes their tint; AI thinking shows animated dots (as today) |
| 5. Extra turn | The pill reads "Your turn · +1 extra turn" until you draw |
| 6. Game over | Today's results dialog over the dimmed screen, no blur; confetti on a win (as today) |
| 7. Restart or setup | Quit or Restart → a themed confirm dialog → Home or a fresh board |
| 8. Desktop to phone | Already one column: phones get the same layout; the board shrinks by today's boardFit rule |

## F. Build notes

- **One small PR:** the values in C for both modes; delete .aurora and the old gradient; remove backdrop-filter and the per-line filter; add the line-group glow, the board frame, --board, --head-text, --on-accent, --on-p1, --on-p2 and --focus; add the extra-turn text and the last-move ring.
- **Must match the mockup:**
  - [ ] Coral only for you and for actions; slate purple for the opponent
  - [ ] Slate-purple band behind the top bar, fading to soft white (light) or deep slate (dark)
  - [ ] White initials on solid coral and slate boxes, with stripes and dots
  - [ ] One glow filter on the line group and a thin coral frame round the board
  - [ ] Results stay today's dialog, recoloured, with no blur
- **Pitfalls:** never set small text in coral on white (3.2:1); use --text or --muted. Keep the level ring's progress arc: it is a meter, not decoration.

# 3 · Cozy Paper and Notebook

A notebook on a desk: coloured-pencil lines, hatched boxes and a tally-mark score sheet, with clean digital type for everything you need to read.

## A. Mockups

Canvas row 5: Desktop game (a two-page spread), Phone game (Tweaks → moment), Setup (choices circled in pencil), Results (a scorecard with a stamp), and Avatar builder (press Play to try it).

## B. Rationale

- **Mood and audience:** nostalgic and relaxed, the game as it was played on paper at school; pass-and-play, families and older players.
- **Identity:** a kraft desk and a cream sheet (charcoal paper at night) with the formation, fibres and tooth of real paper; lines and dots printed and pressed into the paper; hatched boxes; paper-tab buttons with a pencil shadow; coral for you and indigo (cyan at night) for the other player.
- **Layout:** desktop is a spread: the score sheet (tally marks, circled score, turn note, clock, buttons) on the left page and the board on the right. Phones keep one page: score lines on top, the board, then tab buttons.
- **Type:** Kalam (handwriting) only for names, scores and headings; Atkinson Hyperlegible for every label and sentence, so nothing important is hard to read.
- **Legibility:** ownership has three cues: colour, hatch direction (single for you, cross-hatch for the opponent) and a handwritten initial with a paper halo.
- **Advantages:** the most nostalgic theme, with strong cues that don't rely on colour.
- **Trade-offs:** wobbly lines cost precision on big boards, so the wobble turns off above 6×6; textures and hand-drawn paths cost the most to build; your brief rejected a notebook look earlier (cream palette, hand-drawn style), so this goes against that rule; the dark mode becomes a chalkboard, a different feel.

## C. Tokens


| Token | Light (paper) | Dark (charcoal paper) | Used for |
| --- | --- | --- | --- |
| --desk | #E6DCC7 (kraft) | #1A1816 | Page background, with the paper tile and darker edges |
| --page | #FCF8EF | #27241F | The board: a sheet with formation, fibres and tooth |
| --graphite | #2E2B27 | #EFE8DA | Text and printed dots |
| --graphite-2 | #625A50 | #B3A994 | Secondary text |
| --p1 | #FC4422 (coral) | #FC4422 | You: printed lines, hatched boxes |
| --p1-wash | #FFE1D8 | #3E1D17 | Your boxes |
| --p2 | #4657CE (indigo) | #21BDCA (cyan) | AI or player 2 |
| --p2-wash | #E2E5FA | #133538 | Their boxes |
| --accent | #4657CE, white label | #00B58C (teal), dark label | Primary buttons (paper tabs) |
| --select-tint | #D3F2EA | #11362C | Selected options (with a tick) |
| --sel-ring | #007F62 (teal, deepened) | #00B58C | Ring and tick of the selected option |
| --ring | #00936F | #21BDCA | Level ring and XP bar |
| --gold | #B04E07 (orange, deepened) | #FF8C32 (orange) | Rank 1, highlights |
| --focus | #4657CE | #21BDCA | Focus ring (dashed) |

Computed contrast: graphite on the page 13.3:1 (12.7:1); graphite-2 6.4:1 (6.6:1); coral lines on the sheet 3.3:1 and indigo 5.6:1; at night coral 4.4:1 and cyan 6.8:1 (orange and cyan would look the same grey to players who see no colour, so coral is player 1 in both modes); white on indigo 6:1; dark labels on teal 7:1.

- **Type:** Kalam 700 for names (22–24 px), scores (28–56 px) and headings (30–50 px); Kalam 400 for notes (19–22 px); Atkinson Hyperlegible 400/700 for labels (14 px) and body text (14–15 px).
- **Spacing:** 4, 8, 12, 18, 24 px; ruled lines every 36 px on desktop and 42 px on phones.
- **Radii and borders:** 3–6 px. Buttons look like paper tabs: a 1.5 px graphite border, a 2 px offset shadow, a 4 px radius.
- **Elevation:** page `0 1px 0 #E0D6C2, 0 18px 30px -18px rgba(70,52,30,.35)`; a 14 px inset spine shadow at 25% where the pages meet.
- **Board (sp = the gap between dots):** pencil line 0.05–0.06 sp with a wobble of about 0.011 sp and a ghost stroke (0.016 sp at 40%); dot radius 0.06–0.07 sp at 88%; your hatch: 45° strokes every 0.10 sp, 0.024 sp wide, at 60%; their cross-hatch every 0.13 sp, 0.017 sp wide, at 50%; a wash under the hatching at 60%; initials 0.44–0.48 sp with a 0.07 sp paper halo, tilted by up to 5°; last move: a hand-drawn ellipse of 0.27 × 0.17 sp; preview: round pencil dots every 0.10 sp.
- **Motion:** lines draw like a pencil stroke (260 ms ease-in-out); hatching appears in two passes of 120 ms; selection circles draw in 200 ms; no bounce.

## D. Components

| Component (file) | Treatment | States | Responsive |
| --- | --- | --- | --- |
| Spread layout (Game.svelte) | Two pages: the score sheet (360 px) and the board page | – | Under 960 px the pages stack, score sheet on top |
| Score sheet (PlayerCards.svelte) | Names in Kalam, tally marks in gates of five, the active player's score circled, a pencil underline in their colour, and each player's avatar as a round sticker ringed in that colour | Active (circle and underline); inactive; thinking | Phones: two ruled rows above the board, stickers before the names; desktop: stickers in the page margin |
| Turn note | "Your turn. You closed a box, go again!" with "go again!" highlighted and a hand-drawn arrow to the board | Your turn; extra turn; thinking; game over | Phones: one line under the score rows |
| Board (Board.svelte) | Pencil lines, hatched boxes, printed dots | Idle; preview (pencil dots); keyboard cursor (dashed graphite outline); last move (ellipse) | – |
| Paper-tab buttons | Cream with a graphite border and offset shadow; the primary one is solid graphite | Hover (3 px shadow); pressed (no shadow, moves 2 px); focus (dashed outline) | Pairs at full width on phones |
| Setup choices (Setup.svelte, Seg.svelte) | Choices written on the page; the chosen one circled in orange pencil; hand-drawn checkboxes; your avatar sticker with a pencil badge beside the name opens the avatar builder | Selected (the circle draws in); unselected; focus | One column |
| Avatar builder (new AvatarBuilder.svelte) | A big sticker preview (132 px, tilted 3°, white edge and orange ring); Undo, Random and the five tabs as paper tabs, the chosen tab graphite; choices on a dashed sticker sheet, the chosen one circled in orange pencil; Save avatar as the graphite tab | Tab chosen; choice circled; Saved | Phone layout; the sheet fills the space left, so nothing scrolls |
| Results (ResultsModal.svelte) | A torn scorecard: "You win!" with a swoosh, tallies, time, a level bar with a hatched fill, an XP stamp, the leaderboard lines | Win; loss ("Tactician wins", no swoosh); draw; level up (a second stamp) | Fills the phone; centred on desktop |

## E. Interactions

| Event | What the player sees |
| --- | --- |
| 1. Hover or focus a line | Pencil dots in your colour where the line would go |
| 2. Line drawn | The line draws itself from the nearer dot like a pencil stroke (260 ms); the ellipse moves to it |
| 3. Box completed | Hatching fills the box in two quick passes, the initial appears, and a tally mark is added |
| 4. Turn changes | The circle and underline move to the opponent's name; "Tactician is thinking…" |
| 5. Extra turn | "go again!" gets the highlighter swipe |
| 6. Game over | The scorecard slides up over the board page; the stamp lands last |
| 7. Restart or setup | A paper-tab button → a confirm card styled as a sticky note |
| 8. Desktop to phone | Under 960 px the spread stacks into one page; on phones the score lines sit above the board |

## F. Build notes

- **Tokens and fonts:** as in C; Kalam (400, 700) and Atkinson Hyperlegible (400, 700), self-hosted.
- **Assets:** one paper-grain tile (at most 20 KB); the hand-drawn circles, ticks and arrows as inline SVG paths.
- **Must match the mockup:**
  - [ ] Ruled lines only on the score sheet
  - [ ] Wobble off above 6×6
  - [ ] Single hatch for you, cross-hatch for the opponent
  - [ ] Initials with a paper halo
  - [ ] Kalam never used for body text
- **Pitfalls:** draw the wobble from a fixed seed so lines don't shift between renders; hatch with SVG patterns, not hundreds of lines; put the grain tile on the page instead of using an SVG noise filter, which is slow on phones.
