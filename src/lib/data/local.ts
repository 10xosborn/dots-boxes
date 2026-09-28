import type { DataAdapter, Profile, ScoreEntry, Leaderboard, LbView, Level } from './types';
import { boardRow } from '../progression';
import { uid } from '../format';

/** Key-value storage: localStorage when allowed, memory otherwise (private mode, blocked storage). */
const mem = new Map<string, string>();
const canLocal = (() => { try { localStorage.setItem('__dnb', '1'); localStorage.removeItem('__dnb'); return true; } catch { return false; } })();
export const kv = {
  get(k: string) { try { return canLocal ? localStorage.getItem(k) : mem.get(k) ?? null; } catch { return mem.get(k) ?? null; } },
  set(k: string, v: string) { try { if (canLocal) localStorage.setItem(k, v); else mem.set(k, v); } catch { mem.set(k, v); } },
  json<T>(k: string, fallback: T): T { const v = this.get(k); if (!v) return fallback; try { return JSON.parse(v) as T; } catch { return fallback; } },
  persistent: canLocal,
};

/** Offline adapter: everything stays on this device. */
export function localAdapter(): DataAdapter {
  let profile: Profile;
  const scores = () => kv.json<ScoreEntry[]>('dnb:scores', []);
  return {
    kind: 'local',
    label: kv.persistent ? 'Saved on this device only.' : 'Storage is blocked here, so data lasts until you close the page.',
    async init() {
      profile = kv.json<Profile | null>('dnb:profile', null) ?? { uid: uid(), name: 'Player' };
      kv.set('dnb:profile', JSON.stringify(profile)); return profile;
    },
    async setName(name) { profile = { ...profile, name }; kv.set('dnb:profile', JSON.stringify(profile)); return profile; },
    async getScores() { return scores(); },
    async saveScore(entry) { const a = scores(); a.push(entry); if (a.length > 3000) a.splice(0, a.length - 3000); kv.set('dnb:scores', JSON.stringify(a)); },
    async getLeaderboard(n: number, diff: Level, view: LbView): Promise<Leaderboard> {
      const row = { ...boardRow(scores(), n, diff, profile.uid, profile.name) };
      const ok = view === 'fast' ? row.best !== null : view === 'wins' ? row.wins > 0 : row.rate !== null;
      return ok ? { rows: [row], me: { rank: 1, row } } : { rows: [], me: null };
    },
    async resetMine() { kv.set('dnb:scores', '[]'); },
  };
}
