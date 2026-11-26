# QA charters: design/01-themes (e28e7aa)

Base: main (3b3de84). Changed: `src/lib/theme/themes.ts` (the three themes: names, previews, browser bar colours), `src/lib/state/app.svelte.ts` (saved `skin` setting, applied as `data-skin`), `index.html` (Google Fonts link gone; inline script applies the saved theme before the first paint), `src/main.ts` and `src/assets/` (self-hosted fonts and texture tiles), `src/app.css` (every theme's tokens and backgrounds; aurora, frosted glass and line glow removed), `src/components/Board.svelte` and `HeroBoard.svelte` (theme colour tokens only; input handling untouched), `TopBar.svelte` (theme button and per-theme brand mark), `ThemeSheet.svelte` and `ThemeChoices.svelte` (the picker), `src/screens/Settings.svelte` (Theme panel), `src/App.svelte` (aurora removed), README.

**Surface.** Browser only (no rules, data-layer or engine change).

**Isolation.** Production build of e28e7aa served by `vite preview` at http://127.0.0.1:4173/ (LOCAL). Every context aborts live Firebase hosts by hostname, so the app runs on its local adapter and nothing reaches the live project; the fonts are self-hosted now, so no Google Fonts requests either. Throwaway browser contexts, each seeded through its own localStorage.

**Driver.** gstack's own headless Chromium through gstack's bundled playwright-core (phone 390x844 with touch at 2x, desktop 1280x800 with mouse), as in the earlier runs: the `$B` daemon restarts on Windows and can't block Firebase.

**Budget.** Full (diff-aware), 900 s, gstack-qa-deadline.

| # | Contract | Risk | Entrypoint | Exit condition |
|---|---|---|---|---|
| C1 | Every theme and mode (Tabletop, Neon, Paper; light and dark) renders Home, a game in progress, Settings and the picker at phone and desktop size with no sideways scroll; the live tokens meet contrast (text and muted text 4.5:1; lines, boxes, initials and focus 3:1) | A theme that is unreadable or half applied | `node themes-test.mjs` | part 1 passes |
| C2 | The picker: the top-bar button names the current theme; it opens with focus on the current theme; arrow keys apply at once; a tap applies, saves and recolours the browser bar; light and dark switch inside it; Esc, Done and a tap on the backdrop close it and focus returns; a reload paints the saved theme before the app starts; settings saved before themes existed load as Tabletop and keep their mode | The choice can't be made, is lost, or flashes | `node themes-test.mjs` | part 2 passes |
| C3 | The screens C1 doesn't visit, in every theme and mode, phone and desktop: Home with the offline banner and the Continue card, the results dialog after a win, Setup and its Custom steppers, Leaderboard, My stats, Online; the self-hosted fonts load | A screen left in old colours or fonts | `node themes-screens.mjs` | all pass |
| C4 | Local games unaffected: Home, resume after a reload and a browser restart, Continue and Discard, Quit and Restart, pass-and-play on touch, resumed scoring | Regression from the Board, TopBar or app-state changes | `node qa-r1a.mjs O`, `node qa-r1a.mjs all` | all pass |
