import type { FirebaseOptions } from 'firebase/app';

/**
 * Firebase web app config for the "Dots and Boxes" project (Firebase console →
 * Project settings → Your apps). It is safe to commit: access is controlled by the
 * security rules in /firebase, not by hiding this.
 *
 * Set it to null and the game runs fully offline (no online play or global leaderboard).
 */
export const firebaseConfig: FirebaseOptions | null = {
  apiKey: 'AIzaSyAyQHJaBvgf6rtTRx1yJcP3PrE7eSxPI3Q',
  authDomain: 'dots-and-boxes-39e7e.firebaseapp.com',
  databaseURL: 'https://dots-and-boxes-39e7e-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'dots-and-boxes-39e7e',
  storageBucket: 'dots-and-boxes-39e7e.firebasestorage.app',
  messagingSenderId: '173931503489',
  appId: '1:173931503489:web:882cceb7e176721cefd280',
  measurementId: 'G-FNZ5STJTLK',
};
