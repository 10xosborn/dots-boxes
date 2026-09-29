import { getDatabase, ref, get, set, update, onValue, runTransaction, onDisconnect, serverTimestamp, type Unsubscribe } from 'firebase/database';
import { ensureApp, signIn } from '../firebase/app';

const rtdb = () => getDatabase(ensureApp());
import { replay, isStandard, sizeLabel, type BoardSize, type Player } from '../engine/rules';
import { roomSize, type Room } from './types';
export { roomSize, type Room };

/*
 * Realtime Database layout:
 *   rooms/{code} { host, guest, names:{host,guest}, rows, cols, n?, first, game, moves:[...], online:{uid:true}, updated }
 * `n` is also written for the standard square sizes, so rooms stay readable by older
 * versions of the game and valid under older security rules.
 * Moves are appended in a transaction that re-checks the turn, so both players
 * always agree on the game even if they tap at the same moment.
 */

const ALPH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 5 }, () => ALPH[Math.floor(Math.random() * ALPH.length)]).join('');
const roomRef = (code: string) => ref(rtdb(), `rooms/${code}`);

export async function createRoom(name: string, size: BoardSize): Promise<string> {
  const u = await signIn();
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    const res = await runTransaction(roomRef(code), (cur: Room | null) => cur ? undefined : {
      host: u.uid, guest: null, names: { host: name }, rows: size.rows, cols: size.cols,
      ...(isStandard(size) ? { n: size.rows } : {}), first: 0, game: 1, moves: [], updated: Date.now(),
    });
    if (res.committed) return code;
  }
  throw new Error('Could not create a game. Try again.');
}

/** Wrap createRoom so a refused write shows a readable message instead of PERMISSION_DENIED. */
export async function createRoomSafe(name: string, size: BoardSize): Promise<string> {
  try { return await createRoom(name, size); }
  catch (e) {
    if (e instanceof Error && /permission/i.test(e.message))
      throw new Error(isStandard(size) ? 'Could not create a game. Try again in a moment.' : 'Could not create a custom-board game right now. Try a standard size.');
    throw e;
  }
}

/**
 * Take the guest seat. `fitsScreen` is checked before the seat is claimed, so a player
 * whose screen is too small for the host's board is told why instead of joining.
 */
export async function joinRoom(code: string, name: string, fitsScreen: (s: BoardSize) => boolean): Promise<{ seat: Player }> {
  const u = await signIn();
  const snap = await get(roomRef(code));
  if (!snap.exists()) throw new Error('No game found with that code.');
  const r = snap.val() as Room;
  if (r.host === u.uid) return { seat: 0 };
  if (r.guest && r.guest !== u.uid) throw new Error('That game already has two players.');
  const size = roomSize(r);
  if (!fitsScreen(size)) throw new Error(`This game uses a ${sizeLabel(size)} board, which is too big for your screen. Ask your friend to pick a smaller board.`);
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
    const st = replay(roomSize(r), r.first, moves);
    if (st.over || st.turn !== seat || st.lines[e] >= 0) return undefined;
    return { ...r, moves: [...moves, e], updated: Date.now() };
  });
  return res.committed;
}

/** Start the next game in the room; the other player moves first. */
export async function rematch(code: string): Promise<void> {
  await runTransaction(roomRef(code), (r: Room | null) => {
    if (!r) return r;
    const st = replay(roomSize(r), r.first, r.moves ?? []);
    if (!st.over) return undefined;
    return { ...r, game: r.game + 1, first: (1 - r.first) as Player, moves: [], updated: Date.now() };
  });
}
