---
paths:
  - "src/**/*.svelte"
  - "src/**/*.css"
  - "src/lib/theme/**"
  - "src/lib/boardFit.ts"
  - "index.html"
---

# The UI design is locked

Before you change a screen, read docs/design/ui-themes-spec.md: the "Shared spec" section and the section for the theme you are building. The board files in docs/design/mockups/ hold the exact values.

- Use only that theme's tokens: colours, fonts, sizes, radii and shadows. Don't add new ones.
- Keep the mockup layouts: top bar, player cards with avatars, turn pill, chips, board, then Quit and Restart; the "You win!" dialog over the finished board.
- Every player shows their avatar beside their name, and the AI shows the bot. Board ownership marks stay as the spec says.
- Phone screens never scroll, and touch targets are at least 44 px.
- Presentation only: leave src/lib/engine/rules.ts, the AI, Firebase paths and rules, and Board.svelte's input handling alone unless the spec marks a change as approved.
- If the spec and a mockup disagree, or something isn't covered, stop and ask.
- In every PR, list each place the result differs from its mockup.
