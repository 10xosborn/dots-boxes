import { getDatabase, ref, get, set, update, onValue, runTransaction, onDisconnect, serverTimestamp, type Unsubscribe } from 'firebase/database';
import { ensureApp, signIn } from '../firebase/app';

const rtdb = () => getDatabase(ensureApp());
import { replay, type Player } from '../engine/rules';

/*
 * Realtime Database layout:
 *   rooms/{code} { host, guest, names:{host,guest}, n, first, game, moves:[...], online:{uid:true}, updated }
 * Moves are appended in a transaction that re-checks the turn, so both players
 * always agree on the game even if they tap at the same moment.
 */
export interface Room {
  host: string; guest?: string | null;
  names: { host: string; guest?: string };
  n: number; first: Player; game: number; moves?: number[];
  online?: Record<string, boolean>;
}

const ALPH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 5 }, () => ALPH[Math.floor(Math.random() * ALPH.length)]).join('');
const roomRef = (code: string) => ref(rtdb(), `rooms/${code}`);

export async function createRoom(name: string, n: number): Promise<string> {
  const u = await signIn();
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    const res = await runTransaction(roomRef(code), cur => cur ? undefined : {
      host: u.uid, guest: null, names: { host: name }, n, first: 0, game: 1, moves: [], updated: Date.now(),
    });
    if (res.committed) return code;
  }
  throw new Error('Could not create a game. Try again.');
}

export async function joinRoom(code: string, name: string): Promise<{ seat: Player }> {
  const u = await signIn();
  const snap = await get(roomRef(code));
  if (!snap.exists()) throw new Error('No game found with that code.');
  const r = snap.val() as Room;
  if (r.host === u.uid) return { seat: 0 };
  if (r.guest && r.guest !== u.uid) throw new Error('That game already has two players.');
  if (!r.guest) await update(roomRef(code), { guest: u.uid, 'names/guest': name, updated: serverTimestamp() });
  return { seat: 1 };
}

/** Subscribe to a room. Also marks this player online and clears that on disconnect. */
export async function watchRoom(code: string, cb: (r: Room | null) => void): Promise<Unsubscribe> {
  const u = await signIn();
  const me = ref(rtdb(), `rooms/${code}/online/${u.uid}`);
  await set(me, true); onDisconnect(me).remove();
  const off = onValue(roomRef(code), s => cb(s.exists() ? (s.val() as Room) : null));
  return () => { off(); set(me, null).catch(() => {}); };
}

/** Append a move if it is legal and it is this seat's turn. Returns false if rejected. */
export async function sendMove(code: string, seat: Player, e: number, expectLen: number): Promise<boolean> {
  const res = await runTransaction(roomRef(code), (r: Room | null) => {
    if (!r) return r; // not cached yet: Firebase retries with the server value
    const moves = r.moves ?? [];
    if (moves.length !== expectLen) return undefined;
    const st = replay(r.n, r.first, moves);
    if (st.over || st.turn !== seat || st.lines[e] >= 0) return undefined;
    return { ...r, moves: [...moves, e], updated: Date.now() };
  });
  return res.committed;
}

/** Start the next game in the room; the other player moves first. */
export async function rematch(code: string): Promise<void> {
  await runTransaction(roomRef(code), (r: Room | null) => {
    if (!r) return r;
    const st = replay(r.n, r.first, r.moves ?? []);
    if (!st.over) return undefined;
    return { ...r, game: r.game + 1, first: (1 - r.first) as Player, moves: [], updated: Date.now() };
  });
}
