import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, connectAuthEmulator, type User } from 'firebase/auth';
import { firebaseConfig, emulator } from './config';

let app: FirebaseApp | null = null;
let user: User | null = null;

export function ensureApp(): FirebaseApp {
  if (!firebaseConfig) throw new Error('Firebase is not configured');
  if (!app) {
    app = initializeApp(firebaseConfig);
    if (emulator) connectAuthEmulator(getAuth(app), 'http://127.0.0.1:9099', { disableWarnings: true });
  }
  return app;
}

/** Signs in anonymously once (a guest account tied to this browser) and returns the user. */
export async function signIn(): Promise<User> {
  if (user) return user;
  const auth = getAuth(ensureApp());
  user = await new Promise<User | null>(res => { const off = onAuthStateChanged(auth, u => { off(); res(u); }); });
  if (!user) user = (await signInAnonymously(auth)).user;
  return user;
}
