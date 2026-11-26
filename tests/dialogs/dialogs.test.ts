// The themed confirm's question-and-answer logic and the scorecard's tally marks: `npx vitest run tests/dialogs`.
import { describe, expect, it } from 'vitest';
import { ask, answer, confirmState } from '../../src/lib/confirm.svelte';
import { mark, marks, tallyW } from '../../src/lib/tally';

describe('the themed confirm', () => {
  const q = { title: 'Quit this game?', text: "It won't count.", action: 'Quit', safe: 'Keep playing' };
  it('shows the question until it is answered, then resolves with the answer', async () => {
    const yes = ask(q);
    expect(confirmState.q).toEqual(q);
    answer(true);
    expect(confirmState.q).toBeNull();
    await expect(yes).resolves.toBe(true);
    const no = ask(q); answer(false);
    await expect(no).resolves.toBe(false);
  });
  it('a newer question answers the open one with the safe choice', async () => {
    const first = ask(q), second = ask({ ...q, title: 'Restart this game?' });
    await expect(first).resolves.toBe(false);
    expect(confirmState.q?.title).toBe('Restart this game?');
    answer(true);
    await expect(second).resolves.toBe(true);
  });
  it('answering with nothing open does nothing (a game ending with no question up)', () => {
    expect(() => answer(false)).not.toThrow();
    expect(confirmState.q).toBeNull();
  });
});

describe('tally marks', () => {
  it('draw gates of five, the fifth stroke across the four', () => {
    expect(mark(0)).toBe('M2.6 3L3.5 23');
    expect(mark(4)).toBe('M0 19L25 6');
    expect(mark(5)).toBe('M33.6 3L34.5 23');
    expect(tallyW(4)).toBe(24.3);
    expect(tallyW(5)).toBe(27);
    expect(tallyW(0)).toBe(0);
  });
  it('wrap onto a second row when asked: the fifth gate of four to a row starts the next row, 30 px down', () => {
    expect(mark(20, 4)).toBe('M2.6 33L3.5 53');
    expect(mark(19, 4)).toBe('M93 19L118 6');
    expect(marks(25, 4).split('M')).toHaveLength(26);
  });
});
