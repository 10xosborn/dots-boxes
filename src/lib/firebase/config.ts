import type { FirebaseOptions } from 'firebase/app';

/**
 * Paste your Firebase web app config here (Firebase console → Project settings →
 * Your apps → SDK setup and configuration → Config). It is safe to commit:
 * access is controlled by the security rules in /firebase, not by hiding this.
 *
 * Leave it as null and the game runs fully offline (no online play or global leaderboard).
 */
export const firebaseConfig: FirebaseOptions | null = null;
