import type { FirebaseOptions } from 'firebase/app';

/**
 * Firebase web app config for the "Dots and Boxes" project (Firebase console →
 * Project settings → Your apps). It is safe to commit: access is controlled by the
 * security rules in /firebase, not by hiding this.
 */
const live: FirebaseOptions = {
  apiKey: 'AIzaSyAyQHJaBvgf6rtTRx1yJcP3PrE7eSxPI3Q',
  authDomain: 'dots-and-boxes-39e7e.firebaseapp.com',
  databaseURL: 'https://dots-and-boxes-39e7e-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'dots-and-boxes-39e7e',
  storageBucket: 'dots-and-boxes-39e7e.firebasestorage.app',
  messagingSenderId: '173931503489',
  appId: '1:173931503489:web:882cceb7e176721cefd280',
  measurementId: 'G-FNZ5STJTLK',
};

/**
 * Dev only: `npm run dev:emulator` (Vite mode "emulator") talks to the local Firebase
 * emulators (`npm run emulators`) under a demo project, so tests never touch live data.
 * Production builds never set the flag.
 */
export const emulator = import.meta.env.VITE_FIREBASE_EMULATOR === '1';

/** Set it to null and the game runs fully offline (no online play or global leaderboard). */
export const firebaseConfig: FirebaseOptions | null = emulator
  ? { apiKey: 'demo-key', projectId: 'demo-dnb', authDomain: 'demo-dnb.firebaseapp.com', databaseURL: 'https://demo-dnb-default-rtdb.firebaseio.com', appId: 'demo-app' }
  : live;
