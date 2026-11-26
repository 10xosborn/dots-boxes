# Charters: the owner's four restyled theme modes (design/05-four-modes, 4d3b6cc)

Scope (diff-aware against `main`): `src/app.css` (four mode blocks, page and board surfaces, board layers, Neon hover),
`src/components/Board.svelte` and `HeroBoard.svelte` (new SVG filters and layers; input handling unchanged),
`src/lib/theme/themes.ts` (bars, previews, Neon blurb), `index.html` (pre-paint colours), two new texture tiles and two
removed, DESIGN.md and the UI spec. Restyled: Tabletop at night, Cozy Paper at night, Dark Neon, White Neon. Untouched:
Tabletop and Paper by day.

Isolation: the production build served from this machine (`serve-one.mjs`, `serve-two.mjs` for main beside it), Firebase
blocked by hostname (nothing reaches the live database), throwaway browser profiles. Driver: gstack's playwright-core and
headless Chromium from scripts (Aside is macOS-only; the browse daemon restarts on Windows, per CLAUDE.md).

## Browser (REPORT_DIR/browser), Full mode, 900 s guard

| # | Contract | Risk | Entry and inputs | Exit condition | Command |
|---|---|---|---|---|---|
| B1 | Board play in every mode: drags draw exactly their line, short or off-board drags and drags onto drawn lines draw nothing, taps on lines draw, a tap right on a dot draws nothing, rings and sounds | New SVG layers over the board (halos, reflections, tiles) could catch input or hide rings | Pass-and-play 4x4, mouse 1280x800 in all six modes, CDP touch on 390x844 in five | every check passes | `drag-test-themes.mjs` |
| B2 | Switching through all six modes with the theme sheet leaves no colours behind; a reload keeps the mode; the browser bar matches the page | Token fall-back between modes; pre-paint map out of date | One phone session, game in progress | each mode's page, board, line and bar colours are its own; violet only in Dark Neon | `theme-switch.mjs` |
| B3 | Dots and both players' lines at least 3:1 against the board, from pixels; initials legible | Glass, glow cores and translucent tiles | 5x5 game in each restyled mode, phone at 2x | every median and every stroke-body sample at 3:1 or more | `board-contrast.mjs` |
| B4 | Violet appears only in Dark Neon | The owner's done-criterion | Home, game, board, picker on a phone; game on desktop; all six modes | 4x4-block violet share near 0 outside Dark Neon | `four-modes-shots.mjs` + `violet-check.mjs` |
| B5 | No backdrop-filter on the Neon board; each mode's textures within 50 KB | The owner's rules | A game in each of the six modes | computed backdrop-filter none; requested tile sizes | `dr-checks.mjs` |
| B6 | Neon's room: lights drift with Animations on, hold still with it off and during a drag, never catch a tap; the board is opaque static glass; frosted cards at night only; no aurora or glass in Tabletop or Paper | The Neon restyle touched the room and the board | Neon both modes, Tabletop and Paper | every check passes | `aurora-glass2.mjs` |
| B7 | Tabletop and Paper by day are pixel-identical to main | "Leave every other theme and mode untouched" | Home, Setup, game, result, Settings; branch vs main `cff945c` | 0 pixels differ, apart from Neon's own row in Settings and the game clock | `day-diff.mjs` (serve-two) |
| B8 | Game integrity (Hard to the end, phone 7x7, desktop 12x12, keyboard only, reload, restart) | Adjacent | as in R1a | 35 checks | `integrity-r1a.mjs` |
| B9 | Local games' resume | Adjacent | as in R1a | 31 checks | `qa-r1a.mjs` |

## Functional (REPORT_DIR/functional), repository commands

| # | Contract | Command | Expectation |
|---|---|---|---|
| F1 | Type check | `npm run check` | exit 0, 0 errors, 0 warnings |
| F2 | Production build | `npm run build` | exit 0 |
| F3 | Each restyled mode sets every colour token in its own block (no fall-back) | `node token-audit2.mjs <repo>` | exit 0, "none" for all four |
| F4 | Firebase rules tests | `npm run test:rules` | not applicable: no rules, data or online change (presentation only) |
