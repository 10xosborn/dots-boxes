import {
  getDatabase, ref, get, set, update, push, onValue, runTransaction, onDisconnect, serverTimestamp,
  connectDatabaseEmulator, goOffline, goOnline, type Unsubscribe, type DatabaseReference,
} from 'firebase/database';
import { ensureApp, signIn } from '../firebase/app';
import { emulator } from '../firebase/config';

let emulated = false, held = false;
const rtdb = () => {
  const db = getDatabase(ensureApp());
  if (emulator && !emulated) {
    connectDatabaseEmulator(db, '127.0.0.1', 9000); emulated = true;
    // Emulator builds only: browser tests drop and restore the connection like a phone losing signal
    // (held down until restored: checkLink's reconnect can't bring back a network that isn't there).
    (globalThis as { __dnbNet?: object }).__dnbNet = { offline: () => { held = true; goOffline(db); }, online: () => { held = false; goOnline(db); } };
  }
  return db;
};
import { replay, isStandard, sizeLabel, type BoardSize, type Player } from '../engine/rules';
import { roomSize, type Room, type MoveTiming } from './types';
export { roomSize, type Room };

/*
 * Realtime Database layout:
 *   rooms/{code} { host, guest, names:{host,guest}, rows, cols, n?, first, game, moves:[...], online:{uid:true}, updated, dbg?,
 *                  v: 2, turn, count, drawn:{edge:seat} }
 *   presence/{code}/{uid}/{connectionId}: server time, one child per open connection
 * `n` is also written for the standard square sizes, so rooms stay readable by older
 * versions of the game and valid under older security rules.
 * Each move goes into its own slot, moves/{n}, in a transaction that only succeeds while
 * that slot is empty, so both players always agree on the game even if they tap at the
 * same moment, and a move costs one number on the wire. (Older versions of the game
 * rewrite the whole room in a transaction; both kinds of write work together.)
 * Presence lives outside the room so it never gets in the way of a move. The old
 * rooms/{code}/online flag is still written for older versions of the game.
 * `dbg` holds per-move timings, written only with ?debug=net.
 * Server-checked turns: rooms made now also carry v: 2, the player to move (turn), the number of moves (count) and
 * the lines drawn (drawn/{edge}: seat). In those rooms the database rules accept a move only as one update of
 * moves/{count}, drawn/{edge}, count and turn, from the player whose turn it is, with the next turn right (the same
 * player after closing a box); see scripts/database-rules.mjs. Rooms from older versions have no v and play as before.
 */

const ALPH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 5 }, () => ALPH[Math.floor(Math.random() * ALPH.length)]).join('');
const roomRef = (code: string) => ref(rtdb(), `rooms/${code}`);

// Any write inside rooms/{code} cancels a transaction still running there, so the old
// online flag waits until moves and rematches in flight have landed.
let inflight: Promise<unknown> = Promise.resolve();
function track<T>(p: Promise<T>): Promise<T> { inflight = Promise.all([inflight, p.catch(() => {})]); return p; }

export async function createRoom(name: string, size: BoardSize): Promise<string> {
  const u = await signIn();
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    const res = await runTransaction(roomRef(code), (cur: Room | null) => cur ? undefined : {
      host: u.uid, guest: null, names: { host: name }, rows: size.rows, cols: size.cols,
      ...(isStandard(size) ? { n: size.rows } : {}), first: 0, game: 1, moves: [], updated: Date.now(),
      v: 2, turn: 0, count: 0,
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

/**
 * Back into a room this device was playing in, after a reload or a browser restart (the anonymous
 * account survives both). Null when the room is gone or this player no longer holds that seat.
 */
export async function rejoinRoom(code: string, seat: Player): Promise<Room | null> {
  const u = await signIn();
  const snap = await get(roomRef(code));
  if (!snap.exists()) return null;
  const r = snap.val() as Room;
  return (seat === 0 ? r.host : r.guest) === u.uid ? r : null;
}

/** Subscribe to a room. */
export async function watchRoom(code: string, cb: (r: Room | null) => void): Promise<Unsubscribe> {
  await signIn();
  return onValue(roomRef(code), s => cb(s.exists() ? (s.val() as Room) : null));
}

/**
 * Mark this player present in a room for as long as this device stays connected.
 * Firebase runs an onDisconnect only once, when that connection drops, so it is set up
 * again on every reconnection (cleanup first, then the write). `onSelf` reports whether
 * this device is connected.
 */
export async function joinPresence(code: string, onSelf: (connected: boolean) => void): Promise<() => void> {
  const u = await signIn(), db = rtdb();
  const legacy = ref(db, `rooms/${code}/online/${u.uid}`);
  let mine: DatabaseReference | null = null, left = false;
  const off = onValue(ref(db, '.info/connected'), async s => {
    const up = s.val() === true;
    onSelf(up);
    if (!up || left) return;
    try { const c = push(ref(db, `presence/${code}/${u.uid}`)); await onDisconnect(c).remove(); await set(c, serverTimestamp()); mine = c; }
    catch { /* rules from before presence/ existed: the flag below still works */ }
    try { await onDisconnect(legacy).remove(); await inflight; if (!left) await set(legacy, true); }
    catch { /* the room is gone */ }
  });
  return () => { left = true; off(); if (mine) set(mine, null).catch(() => {}); set(legacy, null).catch(() => {}); };
}

/** Whether a player has a live connection in the room, or null if these rules can't tell (older rules). */
export function watchFriend(code: string, uid: string, cb: (present: boolean | null) => void): Unsubscribe {
  return onValue(ref(rtdb(), `presence/${code}/${uid}`), s => cb(s.exists()), () => cb(null));
}

/**
 * Write move number `n` (edge `e`). The caller has checked, on the n moves it has, that the game isn't over, that it's
 * this seat's turn and that the line is free; the mover's screen shows the line at once (Firebase applies the write
 * locally first). Returns false if the server refused it: the room had moved on (the board then refreshes).
 * A room with server-checked turns (`checked`: the mover's seat and who moves next) takes one update of four values,
 * which the rules check; an older room, the move alone in its own slot, in a transaction that only succeeds while that
 * slot is empty (an empty slot means the other player hasn't moved since).
 */
export async function sendMove(code: string, e: number, n: number, checked?: { seat: Player; next: Player }): Promise<boolean> {
  if (checked) {
    try { await track(update(roomRef(code), { [`moves/${n}`]: e, [`drawn/${e}`]: checked.seat, turn: checked.next, count: n + 1 })); return true; }
    catch (err) { if (err instanceof Error && /permission/i.test(err.message)) return false; throw err; }
  }
  const res = await track(runTransaction(ref(rtdb(), `rooms/${code}/moves/${n}`), (cur: number | null) => (cur === null ? e : undefined)));
  return res.committed;
}

/**
 * Prove the connection still reaches the server: read this player's own presence (nothing caches it, so the read
 * makes a round trip). Phones can lose a connection without the browser noticing (a network change, a frozen tab);
 * Firebase would then keep showing the last board it got and only notice minutes later. If no answer comes within
 * `ms`, drop the connection and open a new one: Firebase then sends the room again and resends anything unsent.
 * Resolves true if the link answered in time.
 */
let checking: Promise<boolean> | null = null, probe: Promise<void> | null = null, reconnects = 0;
export function checkLink(code: string, ms: number): Promise<boolean> {
  return (checking ??= (async () => {
    const db = rtdb(), u = await signIn();
    // One read at a time: while the link is down, later checks wait on the same read (Firebase resends it).
    probe ??= get(ref(db, `presence/${code}/${u.uid}`)).then(() => {}, () => {}).finally(() => { probe = null; });
    let timer = 0;
    const late = new Promise<false>(ok => { timer = setTimeout(() => ok(false), ms) as unknown as number; });
    const answered = await Promise.race([probe.then(() => true), late]);
    clearTimeout(timer);
    if (!answered) { reconnects++; goOffline(db); if (!held) goOnline(db); }
    return answered;
  })().finally(() => { checking = null; }));
}
/** How many times checkLink has had to reconnect (for the ?debug=net panel). */
export const reconnectCount = () => reconnects;
/** Firebase's estimate of the server clock minus this device's clock, in ms (for the ?debug=net panel). */
export function watchServerOffset(cb: (ms: number) => void): Unsubscribe {
  return onValue(ref(rtdb(), '.info/serverTimeOffset'), s => cb(Number(s.val()) || 0));
}
/** Debug timings for move n (?debug=net only), merged into rooms/{code}/dbg/{n}. */
export function markMove(code: string, n: number, fields: MoveTiming): void {
  update(ref(rtdb(), `rooms/${code}/dbg/${n}`), fields).catch(() => {});
}

/** Start the next game in the room; the other player moves first. */
export async function rematch(code: string): Promise<void> {
  await track(runTransaction(roomRef(code), (r: Room | null) => {
    if (!r) return r;
    const st = replay(roomSize(r), r.first, r.moves ?? []);
    if (!st.over) return undefined;
    const first = (1 - r.first) as Player;
    return { ...r, game: r.game + 1, first, moves: [], dbg: null, updated: Date.now(), ...(r.v === 2 ? { turn: first, count: 0, drawn: null } : {}) };
  }));
}
