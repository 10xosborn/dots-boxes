# QA charters: design/08-liquid-glass (c421b05 on fix/owner-2026-10-20 da25977)

Target: production build `dist-glass-A` (built from the committed source; the commit adds docs only on top), scratchpad `serve-one.mjs` on 127.0.0.1:4173, Firebase blocked by hostname. Driver: gstack's Playwright with its headless Chromium 151.

| # | Contract | Risk | Command | Exit condition |
| --- | --- | --- | --- | --- |
| G1 | Lines, dots, initials and the keyboard ring keep 3:1 on every board (the glass is see-through; lines are thinner) | Contrast drops over the room's light; thin lines anti-alias | `line-contrast2.mjs` (6 modes), `board-contrast.mjs` (6 modes), `materials-probe.mjs cursor` | All pass |
| G2 | The results dialog and the theme sheet sit above the glass board (the board is now its own stacking context with two raised layers) | The rim or edge highlights drawn over a dialog | `glass-explore.mjs CASE=dialogs` | The topmost element at each dialog's centre and corners belongs to the dialog |
| G3 | Switching to and from Neon mid-game swaps the board's surface cleanly (no Neon rim or glass left on Tabletop or Paper, Tabletop's frame intact, Neon's glass back) | Pseudo-element rules leaking across themes | `glass-explore.mjs CASE=switch` | Computed board background and pseudo-elements match each theme |
| G4 | On the biggest board (12x12, 1920x1080) and a landscape phone, the rim and edge highlights never cover a dot | Highlights at 4 px from the edge over the outer dots | `glass-explore.mjs CASE=edges` | No dot within 3 px of a highlight line |
| G5 | No regressions: marks, spring, drag (mouse and touch), drag edges, sounds and cursor, paint, hover, resume, integrity, ids, confetti, theme tokens | Thinner lines change widths several suites assert | the suites, run in this invocation | Pass, or a failure proven stale |
