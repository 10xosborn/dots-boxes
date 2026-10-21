// Realtime Database rules, checked against the local emulator: `npm run test:rules`.
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { replay, legalMoves, geometry, type GameState, type Player } from '../../src/lib/engine/rules';

let env: RulesTestEnvironment;
const TIME = { '.sv': 'timestamp' };   // what serverTimestamp() sends
const room = (extra: object = {}) => ({ host: 'host', guest: 'guest', names: { host: 'Ama', guest: 'Kofi' }, rows: 4, cols: 4, n: 4, first: 0, game: 1, moves: [0], ...extra });
const db = (uid?: string) => (uid ? env.authenticatedContext(uid) : env.unauthenticatedContext()).database();

beforeAll(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-dnb', database: { rules: readFileSync('firebase/database.rules.json', 'utf8') } });
});
afterAll(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearDatabase();
  await env.withSecurityRulesDisabled(async ctx => {
    await ctx.database().ref('rooms/ROOM1').set(room());
    await ctx.database().ref('rooms/OPEN1').set(room({ guest: null, names: { host: 'Ama' } }));
  });
});

describe('rooms (unchanged)', () => {
  it('a signed-in player creates a room as its host', () => assertSucceeds(db('new').ref('rooms/NEW01').set(room({ host: 'new', guest: null }))));
  it('nobody creates a room for someone else', () => assertFails(db('new').ref('rooms/NEW02').set(room({ host: 'someone' }))));
  it('a second player takes a free guest seat', () => assertSucceeds(db('kofi').ref('rooms/OPEN1').update({ guest: 'kofi', 'names/guest': 'Kofi' })));
  it('nobody takes a seat that is already taken', () => assertFails(db('third').ref('rooms/ROOM1').update({ guest: 'third' })));
  it('a stranger cannot change a game', () => assertFails(db('third').ref('rooms/ROOM1/moves').set([0, 1])));
  it('the players can make moves', () => assertSucceeds(db('guest').ref('rooms/ROOM1/moves').set([0, 1])));
  // Since the online fix, each move is written into its own slot (rooms/{code}/moves/{n}).
  it('the players can write one move into its slot', () => assertSucceeds(db('guest').ref('rooms/ROOM1/moves/1').set(5)));
  it('a stranger cannot write a move slot', () => assertFails(db('third').ref('rooms/ROOM1/moves/1').set(5)));
  it('board sizes stay between 1 and 12', () => assertFails(db('host').ref('rooms/ROOM1/rows').set(13)));
  it('signed-out visitors cannot read rooms', () => assertFails(db().ref('rooms/ROOM1').once('value')));
});

describe('old online flag (older versions of the game keep working)', () => {
  it('the host and the guest mark themselves online and offline', async () => {
    await assertSucceeds(db('host').ref('rooms/ROOM1/online/host').set(true));
    await assertSucceeds(db('guest').ref('rooms/ROOM1/online/guest').set(true));
    await assertSucceeds(db('guest').ref('rooms/ROOM1/online/guest').remove());
  });
  it('a stranger cannot', () => assertFails(db('third').ref('rooms/ROOM1/online/third').set(true)));
});

describe('presence/{code}/{uid}/{connection}', () => {
  it('the host and the guest add connections under their own ids', async () => {
    await assertSucceeds(db('host').ref('presence/ROOM1/host').push(TIME));
    await assertSucceeds(db('guest').ref('presence/ROOM1/guest/c1').set(TIME));
    await assertSucceeds(db('guest').ref('presence/ROOM1/guest/c2').set(TIME));
  });
  it('nobody writes under the other player', () => assertFails(db('host').ref('presence/ROOM1/guest/c1').set(TIME)));
  it('a stranger cannot appear in a room they are not in', () => assertFails(db('third').ref('presence/ROOM1/third/c1').set(TIME)));
  it('no presence for a room that does not exist', () => assertFails(db('host').ref('presence/NOPE1/host/c1').set(TIME)));
  it('a connection holds a time and nothing else', async () => {
    await assertFails(db('host').ref('presence/ROOM1/host/c1').set('here'));
    await assertFails(db('host').ref('presence/ROOM1/host').set(true));
  });
  it('only the two players read a room\'s presence', async () => {
    await assertSucceeds(db('host').ref('presence/ROOM1/guest').once('value'));
    await assertSucceeds(db('guest').ref('presence/ROOM1').once('value'));
    await assertFails(db('third').ref('presence/ROOM1').once('value'));
    await assertFails(db().ref('presence/ROOM1/host').once('value'));
  });
  it('a player can always remove their own connection, even after the room is gone', async () => {
    await env.withSecurityRulesDisabled(async ctx => { await ctx.database().ref('presence/ROOM1/host/c1').set(1); await ctx.database().ref('rooms/ROOM1').remove(); });
    await assertSucceeds(db('host').ref('presence/ROOM1/host/c1').remove());
  });
  it('the cleanup for a dropped connection can be registered before the write', async () => {
    const c = db('guest').ref('presence/ROOM1/guest/c9');
    await assertSucceeds(c.onDisconnect().remove());
    await assertSucceeds(c.set(TIME));
  });
});

// ---- Server-checked turns: rooms the game creates now carry v: 2, turn, count and drawn/{edge}, and the rules check
// every move (scripts/database-rules.mjs explains the model). The game engine plays the honest side here.
const V2 = 'GAME2';
const v2room = (rows: number, cols: number, extra: object = {}) => ({ host: 'host', guest: 'guest', names: { host: 'Ama', guest: 'Kofi' }, rows, cols, first: 0, game: 1, v: 2, turn: 0, count: 0, updated: 1, ...extra });
const seat = (p: Player) => (p === 0 ? 'host' : 'guest');
/** What a copy of the game sends for edge e: the move, its drawn line, the new count and who moves next. */
function moveOf(st: GameState, e: number): Record<string, number> {
  const n = st.moves.length, g = replay({ rows: st.rows, cols: st.cols }, st.first, [...st.moves, e]);
  return { [`moves/${n}`]: e, [`drawn/${e}`]: st.turn, turn: g.turn, count: n + 1 };
}
/** A v2 room part-way through a game (written with the rules off), and that game's state. */
async function seedV2(rows: number, cols: number, moves: number[] = [], extra: object = {}): Promise<GameState> {
  const st = replay({ rows, cols }, 0, moves);
  const drawn = Object.fromEntries(st.moves.map(e => [e, st.lines[e]]));
  await env.withSecurityRulesDisabled(c => c.database().ref(`rooms/${V2}`).set(v2room(rows, cols, { moves, drawn, turn: st.turn, count: moves.length, ...extra })));
  return st;
}
const v2ref = (uid: string, path = '') => db(uid).ref(`rooms/${V2}${path ? '/' + path : ''}`);
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
/** Play a whole game through the rules, each move by the player whose turn it is; with `cheat`, first try the move with
 *  the next turn the wrong way round, which must be refused. */
async function playOut(rows: number, cols: number, cheat = 0): Promise<GameState> {
  let st = await seedV2(rows, cols);
  while (!st.over) {
    const free = legalMoves(st), e = free[Math.floor(rnd() * free.length)], m = moveOf(st, e);
    if (rnd() < cheat) await assertFails(v2ref(seat(st.turn)).update({ ...m, turn: 1 - m.turn }));
    await assertSucceeds(v2ref(seat(st.turn)).update(m));
    st = replay({ rows, cols }, 0, [...st.moves, e]);
  }
  return st;
}
// 2x2 boards: edges 0-5 horizontal (two per row), 6-11 vertical (three per row). After host 0, guest 2, host 6 it is the
// guest's turn, and edge 7 closes the top-left box (its top 0, bottom 2, left 6).
const A = [0, 2, 6];

describe('server-checked turns (rooms with v: 2)', () => {
  it('honest games play to the end on boards of every shape, extra turns and chains included', async () => {
    for (const [r, c] of [[1, 1], [1, 3], [2, 2], [3, 2], [3, 3], [2, 5]]) {
      const st = await playOut(r, c);
      const saved = (await v2ref('host').once('value')).val() as { count: number; moves: number[] };
      expect(saved.count).toBe(geometry(r, c).E);
      expect(saved.moves).toEqual(st.moves);
    }
  }, 60_000);
  it('a wrong next turn is refused all through games on 6x6 and 12x12', async () => { await playOut(6, 6, 0.3); await playOut(12, 12, 0.15); }, 180_000);
  it('a line that closes a box keeps the turn; one that closes nothing passes it', async () => {
    let st = await seedV2(2, 2, A);
    await assertFails(v2ref('guest').update({ ...moveOf(st, 7), turn: 0 }));
    await assertSucceeds(v2ref('guest').update(moveOf(st, 7)));   // turn stays with the guest
    st = replay({ rows: 2, cols: 2 }, 0, [...A, 7]);
    await assertFails(v2ref('guest').update({ ...moveOf(st, 11), turn: 1 }));
    await assertSucceeds(v2ref('guest').update(moveOf(st, 11)));   // closes nothing: the host's turn
  });
  it('a line that closes two boxes at once keeps the turn', async () => {
    const st = await seedV2(2, 2, [0, 1, 2, 3, 6, 8]);   // both top boxes wait for edge 7, and it is the host's turn
    await assertFails(v2ref('host').update({ ...moveOf(st, 7), turn: 1 }));
    await assertSucceeds(v2ref('host').update(moveOf(st, 7)));
  });
  it('nobody moves out of turn, and a stranger never moves', async () => {
    const st = await seedV2(2, 2, A);
    await assertFails(v2ref('host').update({ ...moveOf(st, 11), 'drawn/11': 0 }));
    await assertFails(v2ref('host').update(moveOf(st, 11)));
    await assertFails(v2ref('third').update(moveOf(st, 11)));
  });
  it('a move goes in the next slot, on a free line of the board', async () => {
    const st = await seedV2(2, 2, A), m = moveOf(st, 11);
    await assertFails(v2ref('guest').update({ 'moves/4': 11, 'drawn/11': 1, turn: 0, count: 4 }));   // skips slot 3
    await assertFails(v2ref('guest').update({ 'moves/2': 11, 'drawn/11': 1, turn: 0, count: 4 }));   // over a played slot
    await assertFails(v2ref('guest').update({ 'moves/3': 6, 'drawn/6': 1, turn: 0, count: 4 }));     // a drawn line
    for (const e of [12, -1, 2.5]) await assertFails(v2ref('guest').update({ 'moves/3': e, [`drawn/${e}`.replace('.', '_')]: 1, turn: 0, count: 4 }));
    await assertSucceeds(v2ref('guest').update(m));
  });
  it('the counters and the drawn lines only change with a move', async () => {
    const st = await seedV2(2, 2, A), m = moveOf(st, 11);
    await assertFails(v2ref('guest').update({ count: 4 }));
    await assertFails(v2ref('guest').update({ turn: 0 }));
    await assertFails(v2ref('guest').update({ 'drawn/11': 1 }));
    await assertFails(v2ref('guest').update({ 'moves/3': 11, turn: 0, count: 4 }));                 // no drawn line
    await assertFails(v2ref('guest').update({ ...m, 'drawn/11': 0 }));                               // drawn by the wrong seat
    await assertFails(v2ref('guest').update({ ...m, count: 5 }));
    await assertFails(v2ref('guest').update({ ...m, 'drawn/5': 1 }));                                // a second line
    await assertFails(v2ref('guest').set(5));                                                        // nothing else may replace the room
  });
  it('nothing already played can be changed or removed', async () => {
    await seedV2(2, 2, A);
    for (const [path, value] of [['moves/0', 5], ['moves/0', null], ['drawn/6', null], ['drawn/6', 0], ['first', 1], ['rows', 3], ['game', 2], ['host', 'guest'], ['turn', null], ['count', null], ['v', 1], ['v', null], ['moves', [0, 2]]] as const)
      await assertFails(v2ref('guest', path).set(value));
  });
  it('no move once the game is over; a rematch only then, and only as a clean new game', async () => {
    const over = await seedV2(1, 1, [0, 1, 2, 3]);   // the guest's fourth line closed the box: 4 of 4 lines
    expect(over.over).toBe(true);
    await assertFails(v2ref('guest').update({ 'moves/4': 0, 'drawn/0': 1, turn: 1, count: 5 }));
    const fresh = { ...v2room(1, 1), game: 2, first: 1, turn: 1, count: 0 };
    for (const bad of [{ count: 4 }, { moves: [0] }, { first: 0, turn: 0 }, { game: 3 }, { rows: 2 }, { turn: 0 }, { drawn: { 0: 1 } }, { v: null }])
      await assertFails(v2ref('host').set({ ...fresh, ...bad }));
    await assertSucceeds(v2ref('guest').set(fresh));
    await seedV2(2, 2, A);   // not over yet
    await assertFails(v2ref('host').set({ ...v2room(2, 2), game: 2, first: 1, turn: 1, count: 0 }));
  });
  it('the second player joins, and nobody else', async () => {
    await env.withSecurityRulesDisabled(c => c.database().ref(`rooms/${V2}`).set(v2room(3, 3, { guest: null, names: { host: 'Ama' } })));
    await assertFails(v2ref('host').update({ guest: 'host' }));
    await assertSucceeds(v2ref('kofi').update({ guest: 'kofi', 'names/guest': 'Kofi', updated: TIME }));
    await assertFails(v2ref('third').update({ guest: 'third', 'names/guest': 'Esi' }));
    await assertFails(v2ref('third', 'names/guest').set('Esi'));
  });
  it('the players write their names, online flags and move timings; a stranger cannot', async () => {
    await seedV2(2, 2, A);
    await assertSucceeds(v2ref('host', 'names/host').set('Ama B'));
    await assertSucceeds(v2ref('guest', 'online/guest').set(true));
    await assertSucceeds(v2ref('guest', 'online/guest').remove());
    await assertFails(v2ref('guest', 'online/host').set(true));
    await assertSucceeds(v2ref('guest', 'dbg/2').update({ by: 1, s: 1 }));
    await assertSucceeds(v2ref('host', 'updated').set(TIME));
    await assertFails(v2ref('host', 'names/guest').set('Not Kofi'));
    await assertFails(v2ref('third', 'dbg/2').set({ s: 1 }));
    await assertFails(v2ref('third', 'online/third').set(true));
  });
  it('a new room starts as a clean game', async () => {
    const ok = v2room(3, 3, { host: 'new', guest: null, names: { host: 'Esi' } });
    await assertSucceeds(db('new').ref('rooms/NEWV2').set(ok));
    for (const bad of [{ count: 1 }, { moves: [0] }, { drawn: { 0: 0 } }, { turn: 1 }, { first: 2, turn: 2 }, { turn: null }, { cols: null }])
      await assertFails(db('new').ref('rooms/NEWV3').set({ ...ok, ...bad }));
  });
  it('an older copy of the game cannot move in a v: 2 room (it writes the move alone)', async () => {
    await seedV2(2, 2, A);
    await assertFails(v2ref('guest', 'moves/3').set(11));
    await assertFails(v2ref('guest').set({ ...v2room(2, 2), moves: [...A, 11], turn: 1, count: 3 }));
  });
  it('rooms from older copies of the game keep the old rules', async () => {
    await assertSucceeds(db('guest').ref('rooms/ROOM1/moves/1').set(5));
    await assertSucceeds(db('host').ref('rooms/ROOM1').update({ game: 2, first: 1, moves: null }));
  });
});
