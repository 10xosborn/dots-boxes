# Dots & Boxes

A modern Dots & Boxes game: a chain-savvy AI on four board sizes, XP and levels,
a leaderboard, and online games with friends.

Built with **Svelte 5 + TypeScript + Vite**, with **Firebase** for accounts, the
worldwide leaderboard, and online play. Hosted on **GitHub Pages**.

## Project structure

```
src/
  lib/engine/      Game rules and AI (no UI code, safe to test on their own)
    rules.ts         Board geometry, legal moves, scoring, extra-turn rule
    ai-core.js       AI engine: easy / medium / hard, exact search, 3×3 opening book
    ai.worker.ts     Runs the AI in a background thread
    ai.ts            Promise-based AI client (falls back to the main thread)
  lib/data/        Storage adapter: one interface, two backends
    types.ts         DataAdapter interface and data types
    local.ts         Offline backend (this device only)
    firebase.ts      Firestore backend (worldwide leaderboard)
  lib/online/      Online rooms on Firebase Realtime Database
  lib/firebase/    Firebase config and sign-in
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

## How the AI plays

- **Easy:** takes an available box about half the time, otherwise random.
- **Medium:** always takes boxes; never gives a box its third side while a safe line exists.
- **Hard:** counts the safe-line race, uses all-but-two / all-but-four to keep control,
  opens chains in the cheapest order, and switches to exact search when the board is
  small enough. On 3×3 it plays perfectly (opening book from a full solve).

## Known limits

- Scores are checked by security rules, but a determined player could still post a fake
  time. Full protection needs a Cloud Function that replays each game's saved moves
  (the moves are already stored with every score).
