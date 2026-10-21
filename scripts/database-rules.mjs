// Builds firebase/database.rules.json, the Realtime Database security rules (the owner pastes it into the Firebase console).
//   node scripts/database-rules.mjs           write the file
//   node scripts/database-rules.mjs --check   fail if the file differs from what this script builds
//
// Server-checked turns. Rooms the game creates now carry v: 2, the player to move (turn: 0 host, 1 guest), the number of
// moves (count) and the lines drawn so far (drawn/{edge}: the seat that drew it). In those rooms the rules accept a move
// only as one update of four values, moves/{count}: edge, drawn/{edge}: seat, count: count + 1, turn: whoever moves next,
// and only from the player whose turn it is, into the next slot, on a free line of the board, with the next turn right:
// the same player again if the line closes a box (worked out from the drawn lines), the other player otherwise. Nothing
// already played can be changed or removed, and a new game in the room (a rematch) is only a clean reset after a finished
// game. Rooms from older versions of the game have no v and keep the old rules, so the site and these rules can be
// updated in either order (a copy of the game from before this change can't move in a v: 2 room once these rules are
// published: it doesn't write the new values).
//
// Edges are numbered as in src/lib/engine/rules.ts: rows×cols boxes, horizontal edges first (row r 0..rows, column c:
// r*cols + c), then vertical ones (row r, column c 0..cols: H + r*(cols+1) + c, H = (rows+1)*cols). The rules language has
// no functions or loops, so the arithmetic is written out here and inlined; a number joined to '' is a child key.
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = new URL('../firebase/database.rules.json', import.meta.url);

/** The room as it was before the write, from a rule `depth` levels below rooms/$code. */
const room = depth => ['data', 'data.parent()', 'data.parent().parent()'][depth];
/** The room as it will be after the write. */
const next = depth => ['newData', 'newData.parent()', 'newData.parent().parent()'][depth];

function exprs(depth) {
  const R = room(depth), N = next(depth);
  const v = k => `${R}.child('${k}').val()`;
  const rows = v('rows'), cols = v('cols'), count = v('count'), turn = v('turn'), game = v('game');
  const H = `(${rows} + 1) * ${cols}`;
  const E = `(${H} + ${rows} * (${cols} + 1))`;
  const drawn = x => `${R}.child('drawn').child((${x}) + '').exists()`;
  // Does edge x close a box? Each box beside it must have its other three edges drawn already.
  const hRow = x => `(${x} - ${x} % ${cols}) / ${cols}`, hCol = x => `${x} % ${cols}`;
  const vIdx = x => `(${x} - ${H})`;
  const vRow = x => `(${vIdx(x)} - ${vIdx(x)} % (${cols} + 1)) / (${cols} + 1)`, vCol = x => `${vIdx(x)} % (${cols} + 1)`;
  const left = (row, col) => `${H} + (${row}) * (${cols} + 1) + ${col}`;   // the left edge of box (row, col)
  const closes = x => `(${x} < ${H} ? `
    // horizontal: the box above (its top, left and right edges) and the box below (its bottom, left and right)
    + `(${hRow(x)} > 0 && ${drawn(`${x} - ${cols}`)} && ${drawn(left(`${hRow(x)} - 1`, hCol(x)))} && ${drawn(`${left(`${hRow(x)} - 1`, hCol(x))} + 1`)}`
    + ` || ${hRow(x)} < ${rows} && ${drawn(`${x} + ${cols}`)} && ${drawn(left(hRow(x), hCol(x)))} && ${drawn(`${left(hRow(x), hCol(x))} + 1`)})`
    // vertical: the box to the left (its top, bottom and left edges) and the box to the right (top, bottom, right)
    + ` : (${vCol(x)} > 0 && ${drawn(`(${vRow(x)}) * ${cols} + ${vCol(x)} - 1`)} && ${drawn(`(${vRow(x)} + 1) * ${cols} + ${vCol(x)} - 1`)} && ${drawn(`${x} - 1`)}`
    + ` || ${vCol(x)} < ${cols} && ${drawn(`(${vRow(x)}) * ${cols} + ${vCol(x)}`)} && ${drawn(`(${vRow(x)} + 1) * ${cols} + ${vCol(x)}`)} && ${drawn(`${x} + 1`)}))`;
  return {
    v2: `${v('v')} === 2`,
    member: `(${v('host')} === auth.uid || ${v('guest')} === auth.uid)`,
    toMove: `(${v('host')} === auth.uid && ${turn} === 0 || ${v('guest')} === auth.uid && ${turn} === 1)`,
    playing: `${count} < ${E}`,
    over: `${count} === ${E}`,
    joining: `!${R}.child('guest').exists() && ${N}.child('guest').val() === auth.uid`,
    // moves/$n: the next slot, a free line of the board, its drawn entry and the counters in the same update.
    moveOk: [
      `newData.isNumber() && newData.val() % 1 === 0 && newData.val() >= 0 && newData.val() < ${E}`,
      `$n === ${count} + ''`,
      `!${drawn('newData.val()')}`,
      `${N}.child('drawn').child(newData.val() + '').val() === ${turn}`,
      `${N}.child('count').val() === ${count} + 1`,
      `${N}.child('game').val() === ${game}`,
      `${N}.child('turn').val() === (${closes('newData.val()')} ? ${turn} : 1 - ${turn})`,
    ].join(' && '),
    // drawn/$e: only beside the move that draws it, marked with the mover's seat.
    drawnOk: `newData.val() === ${turn} && ${N}.child('moves').child(${count} + '').val() + '' === $e`,
    // turn and count: only with a move (its own rule checks the values), or reset by a rematch.
    turnOk: `${N}.child('game').val() === ${game} && ${N}.child('count').val() === ${count} + 1 || ${N}.child('game').val() === ${game} + 1 && newData.val() === ${N}.child('first').val()`,
    countOk: `${N}.child('game').val() === ${game} && newData.val() === ${count} + 1 && ${N}.child('moves').child(${count} + '').exists() || ${N}.child('game').val() === ${game} + 1 && newData.val() === 0`,
    rematch: [
      `newData.child('game').val() === ${game} + 1 && newData.child('first').val() === 1 - ${v('first')} && newData.child('v').val() === 2`,
      `newData.child('host').val() === ${v('host')} && newData.child('guest').val() === ${v('guest')}`,
      `newData.child('rows').val() === ${rows} && newData.child('cols').val() === ${cols}`,
    ].join(' && '),
  };
}

const r0 = exprs(0), r1 = exprs(1), r2 = exprs(2);
const oldMember = "data.child('host').val() === auth.uid || data.child('guest').val() === auth.uid || (!data.child('guest').exists() && newData.child('guest').val() === auth.uid)";
const v2Shape = "newData.hasChildren(['rows', 'cols', 'turn', 'count']) && (newData.child('first').val() === 0 || newData.child('first').val() === 1)"
  + " && (data.exists() && newData.child('game').val() === data.child('game').val()"
  + " || newData.child('count').val() === 0 && newData.child('turn').val() === newData.child('first').val() && !newData.child('moves').exists() && !newData.child('drawn').exists())";
const played = (rx, depth) => `auth != null && ${rx.v2} && ${rx.toMove} && ${rx.playing} && ${depth === 2 ? 'newData.exists() && !data.exists()' : 'newData.exists()'}`;

const rules = {
  rules: {
    rooms: {
      $code: {
        '.read': 'auth != null',
        // Creating a room; an old room: its players as before; a v2 room as a whole: only removing it, or a rematch after a finished game.
        '.write': `auth != null && (!data.exists() ? newData.child('host').val() === auth.uid : data.child('v').val() !== 2 ? (${oldMember}) : ${r0.member} && (!newData.exists() || ${r0.over} && ${r0.rematch}))`,
        '.validate': `!newData.exists() || (newData.hasChildren(['host', 'first', 'game']) && (newData.hasChildren(['rows', 'cols']) || newData.hasChild('n')) && (newData.child('v').val() !== 2 || ${v2Shape}))`,
        n: { '.validate': 'newData.isNumber() && newData.val() >= 3 && newData.val() <= 6' },
        rows: { '.validate': 'newData.isNumber() && newData.val() >= 1 && newData.val() <= 12' },
        cols: { '.validate': 'newData.isNumber() && newData.val() >= 1 && newData.val() <= 12' },
        v: { '.validate': 'newData.val() === 2' },
        // A v2 room's parts its players may write on their own (an old room's players may write anything, as before).
        guest: { '.write': `auth != null && ${r1.v2} && !data.exists() && newData.val() === auth.uid && data.parent().child('host').val() !== auth.uid` },
        names: { $who: { '.write': `auth != null && ${r2.v2} && ($who === 'host' ? data.parent().parent().child('host').val() === auth.uid : $who === 'guest' && (data.parent().parent().child('guest').val() === auth.uid || ${r2.joining}))` } },
        updated: { '.write': `auth != null && ${r1.v2} && (${r1.member} || ${r1.joining})` },
        online: { $uid: { '.write': `auth != null && ${r2.v2} && auth.uid === $uid && ${r2.member}` } },
        dbg: { '.write': `auth != null && ${r1.v2} && ${r1.member}` },
        moves: { $n: { '.write': played(r2, 2), '.validate': `!(${r2.v2}) || ${r2.moveOk}` } },
        drawn: { $e: { '.write': played(r2, 2), '.validate': `!(${r2.v2}) || ${r2.drawnOk}` } },
        turn: { '.write': played(r1, 1), '.validate': `(newData.val() === 0 || newData.val() === 1) && (!(${r1.v2}) || ${r1.turnOk})` },
        count: { '.write': played(r1, 1), '.validate': `newData.isNumber() && (!(${r1.v2}) || ${r1.countOk})` },
      },
    },
    presence: {
      $code: {
        '.read': "auth != null && (root.child('rooms').child($code).child('host').val() === auth.uid || root.child('rooms').child($code).child('guest').val() === auth.uid)",
        $uid: {
          '.write': "auth != null && auth.uid === $uid && (!newData.exists() || root.child('rooms').child($code).child('host').val() === auth.uid || root.child('rooms').child($code).child('guest').val() === auth.uid)",
          '.validate': 'newData.hasChildren()',
          $connection: { '.validate': 'newData.isNumber()' },
        },
      },
    },
  },
};

const text = JSON.stringify(rules, null, 2) + '\n';
if (process.argv.includes('--check')) {
  const disk = readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');
  if (disk !== text) { console.error('firebase/database.rules.json differs from what scripts/database-rules.mjs builds: run it to rebuild.'); process.exit(1); }
  console.log(`firebase/database.rules.json is up to date (${text.length} bytes).`);
} else {
  writeFileSync(FILE, text);
  console.log(`Wrote firebase/database.rules.json (${text.length} bytes).`);
}
