// Realtime Database rules, checked against the local emulator: `npm run test:rules`.
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';

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
