# Grid Rivals: Dots & Boxes

A modern Dots & Boxes game: a chain-savvy AI on four standard board sizes plus custom
boards, XP and levels, a leaderboard, and online games with friends.

Built with **Svelte 5 + TypeScript + Vite**, with **Firebase** for accounts, the
worldwide leaderboard, and online play. Hosted on **GitHub Pages**.

## Project structure

```
src/
  lib/engine/      Game rules and AI (no UI code, safe to test on their own)
    rules.ts         Board geometry (any rows × cols), legal moves, scoring, extra-turn rule
    ai-core.js       AI engine: easy / medium / hard, exact search, 3×3 opening book
    ai.worker.ts     Runs the AI in a background thread
    ai.ts            Promise-based AI client (falls back to the main thread)
  lib/data/        Storage adapter: one interface, two backends
    types.ts         DataAdapter interface and data types
    local.ts         Offline backend (this device only)
    firebase.ts      Firestore backend (worldwide leaderboard)
  lib/online/      Online rooms on Firebase Realtime Database
  lib/firebase/    Firebase config and sign-in
  lib/boardFit.ts  Which board sizes fit the player's screen
  lib/progression.ts  XP, levels, stats
  lib/state/       App-wide state (Svelte runes)
  components/      Board, player cards, results, controls
  screens/         Home, Setup, Game, Online, Leaderboard, Stats, Settings
firebase/          Security rules to paste into the Firebase console
```

## Run it locally

```bash
npm install
npm run dev      # development server
npm run check    # type-check
npm run build    # production build in dist/
```

## Connect Firebase (turns on online play and the worldwide leaderboard)

Without this the game still works fully, saving results on the player's device.

1. Create a project at https://console.firebase.google.com
2. **Authentication** → Sign-in method → enable **Anonymous**.
   Then Settings → Authorized domains → add `<your-username>.github.io`.
3. **Firestore Database** → Create database → then Rules → paste `firebase/firestore.rules` → Publish.
4. **Realtime Database** → Create database → then Rules → paste `firebase/database.rules.json` → Publish.
5. Project settings → Your apps → add a **Web app** → copy the `firebaseConfig`
   object into `src/lib/firebase/config.ts` (make sure it includes `databaseURL`).

The web config is not a secret. Access is controlled by the security rules.

## Deploy

Pushing to `main` builds and publishes automatically via `.github/workflows/deploy.yml`.
One-time setup: repo **Settings → Pages → Source → GitHub Actions**.

## Custom boards

Besides the four standard squares (3×3 to 6×6), players can pick **Custom** and set rows and
columns separately, from 1×1 up to 12×12.

- **Screen limit:** the size picker only offers boards whose dots are at least 40 px apart
  on the current screen, so lines stay tappable: about 7×7 (or 10×6) on a phone, 9×12 on a
  1280×800 laptop, and 12×12 on a large monitor. The board shrinks automatically if the
  screen gets smaller, for example when a phone is rotated.
- **Server limit:** the Firebase rules reject anything bigger than 12×12, so editing the
  page can't create a 1000×1000 game.
- **Online:** a friend whose screen can't fit the host's board is told why instead of joining.
- **Scoring:** custom games count toward stats and XP, but only the four standard sizes have
  leaderboards and fastest-win records. Boards under 9 boxes earn proportionally less XP.

After changing `firebase/firestore.rules` or `firebase/database.rules.json`, paste them into
the Firebase console again and publish. The rules accept both the current data format and the
one from before custom boards, so the game and the rules can be updated in either order.

## How the AI plays

- **Easy:** takes an available box about half the time, otherwise random.
- **Medium:** always takes boxes; never gives a box its third side while a safe line exists.
- **Hard:** counts the safe-line race, uses all-but-two / all-but-four to keep control,
  opens chains in the cheapest order, and switches to exact search when the board is
  small enough (with a time limit, so moves stay quick on slow phones). On 3×3 it plays
  perfectly (opening book from a full solve). It works on every rows × cols shape.

## Known limits

- Scores are checked by security rules, but a determined player could still post a fake
  time. Full protection needs a Cloud Function that replays each game's saved moves
  (the moves are already stored with every score).
