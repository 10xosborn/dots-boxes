# QA charters: feat/drag-to-draw (6c6176f)

Base: main (3eb4981). Changed: `src/components/Board.svelte` (pointer input: press a dot and drag towards a neighbouring dot; the line snaps past halfway inside the keyboard cursor's ring; release draws it, release elsewhere draws nothing; a press on a line still previews and draws it; a tap right on a dot where several free lines meet draws nothing; one pointer at a time; the grab cursor; the hover preview in the mover's line colour), `src/lib/sound.ts` (pick, snap and cancel sounds), `src/app.css` (preview, drag line, picked-up dot's ring, grab cursor), DESIGN.md, README.

**Surface.** Browser only. The online screen uses the same Board component and `onmove` callback; online play needs the Firebase emulators (Java, about 1-2 GB), which this PC's free memory (about 1.4 GB) doesn't allow, so it is not exercised here.

**Isolation.** Production build of 6c6176f (code identical to f8f949e; the last commit is docs) served by `vite preview` at http://127.0.0.1:4173/ (LOCAL), serving `index-Bal4HcnW.js` and `index-B_pd92fR.css`. Every context aborts live Firebase hosts by hostname. Throwaway contexts seeded through localStorage.

**Driver.** gstack's own headless Chromium through gstack's bundled playwright-core 1.62.1: mouse at 1280x800; real touch on a 390x844 phone through CDP touch events (pointerType touch), and Playwright taps.

**Budget.** Full (diff-aware), 900 s, gstack-qa-deadline.

| # | Contract | Risk | Entrypoint | Exit condition |
|---|---|---|---|---|
| C0 | Orientation: Home on the default theme at phone and desktop size, no console errors | The change breaks start-up | `node qa-r1a.mjs O` | 6/6 |
| C1 | The gesture in every mode (mouse) and two modes (touch): drag right and drag down draw exactly those lines; a short drag, a drag onto a drawn line and a drag off the board draw nothing; while dragging the line and the dot's ring show, and the snapped line's ring once snapped; a tap on a line draws it; a tap right on a dot draws nothing; a tap near a dot along a line draws that line; the grab cursor; sounds pick 660, snap 990, line 520, cancel 330/262 only with Sound on | The new input loses or invents moves | `node drag-test.mjs` | 88/88 |
| C2 | Edges: a drag during the AI's turn draws nothing; a second finger is ignored and the first finger's line is drawn once; letting go outside the board draws a snapped line and nothing otherwise; the hover preview is the mover's line colour at 3:1 or more in every mode | Races and multi-touch | `node drag-edge.mjs` | all pass |
| C3 | Game integrity: a 5x5 game against Hard to the end, custom 7x7 on a phone, 12x12 on desktop, a whole 3x3 game by keyboard only, reload and restart | Keyboard play or AI turns break | `node integrity-r1a.mjs all` | 35/35 |
| C4 | Local games: reload and restart resume, Continue and Discard, Quit and Restart, pass-and-play on touch (moves now made by tapping lines: a tap right on a dot no longer draws), resumed scoring | Touch taps or resume break | `node qa-r1a.mjs all` | 31/31 |
| C5 | Board structure, the keyboard cursor ring, the hover preview, confetti, ids, odd shapes in every mode | The new layers or ring reuse break the board | `node materials-probe.mjs` | 85/85 |
| C6 | Themes and the picker in every mode, live token contrast | The CSS changes break a theme | `node themes-test.mjs` | 37/37 |
