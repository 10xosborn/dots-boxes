import {
  doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs, where,
  getCountFromServer, runTransaction, writeBatch, deleteDoc, getFirestore,
} from 'firebase/firestore';
import { ensureApp, signIn } from '../firebase/app';

const firestore = () => getFirestore(ensureApp());
import type { DataAdapter, Profile, ScoreEntry, Leaderboard, LbRow, LbView, Level } from './types';
import { LEVELS, SIZES, MIN_RATE_GAMES } from './types';

/*
 * Firestore layout (no composite indexes needed):
 *   users/{uid}                          { name }
 *   users/{uid}/scores/{id}              ScoreEntry
 *   leaderboards/{n}_{diff}/players/{uid} { uid, name, games, wins, best?, rate? }
 *     best is only present after a win, rate only after MIN_RATE_GAMES games,
 *     so orderBy() on those fields naturally skips players who don't qualify.
 */
const boardId = (n: number, d: Level) => `${n}_${d}`;
const toRow = (d: any): LbRow => ({ uid: d.uid, name: d.name, games: d.games, wins: d.wins, best: d.best ?? null, rate: d.rate ?? null });

export function firebaseAdapter(): DataAdapter {
  let profile: Profile;
  const db = () => firestore();
  const players = (n: number, d: Level) => collection(db(), 'leaderboards', boardId(n, d), 'players');

  return {
    kind: 'firebase',
    label: 'Synced online with Firebase. Your guest account is tied to this browser.',
    async init() {
      const u = await signIn();
      const snap = await getDoc(doc(db(), 'users', u.uid));
      profile = { uid: u.uid, name: snap.exists() ? snap.data().name : 'Player' };
      if (!snap.exists()) await setDoc(doc(db(), 'users', u.uid), { name: profile.name });
      return profile;
    },
    async setName(name) {
      profile = { ...profile, name };
      await setDoc(doc(db(), 'users', profile.uid), { name });
      // Keep leaderboard names in step (at most 12 boards).
      await Promise.all(SIZES.flatMap(n => LEVELS.map(async d => {
        const ref = doc(players(n, d), profile.uid);
        if ((await getDoc(ref)).exists()) await updateDoc(ref, { name });
      })));
      return profile;
    },
    async getScores() {
      const s = await getDocs(query(collection(db(), 'users', profile.uid, 'scores'), orderBy('date'), limit(2000)));
      return s.docs.map(d => d.data() as ScoreEntry);
    },
    async saveScore(e: ScoreEntry) {
      await setDoc(doc(db(), 'users', profile.uid, 'scores', e.id), e);
      if (e.custom) return; // custom boards earn XP and stats but have no leaderboard
      const ref = doc(players(e.n, e.diff), profile.uid);
      await runTransaction(db(), async tx => {
        const cur = await tx.get(ref);
        const p = cur.exists() ? cur.data() : { uid: profile.uid, name: profile.name, games: 0, wins: 0 };
        const games = p.games + 1, wins = p.wins + (e.result === 'win' ? 1 : 0);
        const next: any = { uid: profile.uid, name: profile.name, games, wins };
        const best = e.result === 'win' ? Math.min(p.best ?? Infinity, e.ms) : p.best;
        if (best !== undefined && best !== null) next.best = best;
        if (games >= MIN_RATE_GAMES) next.rate = wins / games;
        tx.set(ref, next);
      });
    },
    async getLeaderboard(n: number, diff: Level, view: LbView): Promise<Leaderboard> {
      const col = players(n, diff);
      const q = view === 'fast' ? query(col, orderBy('best'), limit(10))
        : view === 'wins' ? query(col, orderBy('wins', 'desc'), limit(10))
        : query(col, orderBy('rate', 'desc'), limit(10));
      const rows = (await getDocs(q)).docs.map(d => toRow(d.data())).filter(r => view !== 'wins' || r.wins > 0);
      const mine = await getDoc(doc(col, profile.uid));
      let me: Leaderboard['me'] = null;
      if (mine.exists()) {
        const row = toRow(mine.data());
        const idx = rows.findIndex(r => r.uid === row.uid);
        if (idx >= 0) me = { rank: idx + 1, row };
        else {
          // Outside the top 10: count how many players are ahead.
          const ahead = view === 'fast' ? (row.best === null ? null : where('best', '<', row.best))
            : view === 'wins' ? (row.wins > 0 ? where('wins', '>', row.wins) : null)
            : (row.rate === null ? null : where('rate', '>', row.rate));
          if (ahead) me = { rank: (await getCountFromServer(query(col, ahead))).data().count + 1, row };
        }
      }
      return { rows, me };
    },
    async resetMine() {
      const scores = await getDocs(collection(db(), 'users', profile.uid, 'scores'));
      for (let i = 0; i < scores.docs.length; i += 400) {
        const b = writeBatch(db()); scores.docs.slice(i, i + 400).forEach(d => b.delete(d.ref)); await b.commit();
      }
      await Promise.all(SIZES.flatMap(n => LEVELS.map(d => deleteDoc(doc(players(n, d), profile.uid)).catch(() => {}))));
    },
  };
}
