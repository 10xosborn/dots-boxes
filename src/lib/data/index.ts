import type { DataAdapter } from './types';
import { localAdapter } from './local';
import { firebaseConfig } from '../firebase/config';

export const onlineEnabled = !!firebaseConfig;

/**
 * Pick the storage backend. Firebase code is loaded only when configured,
 * so the offline build stays small. If Firebase fails (no network, rules not
 * published yet), the game falls back to offline storage instead of breaking.
 */
export async function createAdapter(): Promise<{ adapter: DataAdapter; profile: import('./types').Profile; error?: string }> {
  if (firebaseConfig) {
    try {
      const { firebaseAdapter } = await import('./firebase');
      const adapter = firebaseAdapter();
      const profile = await adapter.init();
      return { adapter, profile };
    } catch (err) {
      const adapter = localAdapter();
      return { adapter, profile: await adapter.init(), error: 'Could not reach Firebase, so results are saved on this device for now.' };
    }
  }
  const adapter = localAdapter();
  return { adapter, profile: await adapter.init() };
}
