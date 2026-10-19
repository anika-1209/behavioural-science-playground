import { describe, expect, it } from 'vitest';
import type { Answers } from '../../types';
import { LATER, ORDER, keyOf, otherFlips, presentFlips, wasPulled, whatHappened, type Horizon, type Pick } from './logic';

const fill = (near: (a: number) => Pick, far: (a: number) => Pick): Answers =>
  Object.fromEntries(ORDER.map(([h, a]: [Horizon, number]) => [keyOf(h, a), h === 'near' ? near(a) : far(a)]));

describe('order', () => {
  it('asks every amount once at each horizon', () => {
    expect(ORDER).toHaveLength(LATER.length * 2);
    for (const a of LATER) for (const h of ['near', 'far'] as const) expect(ORDER.filter(([x, y]) => x === h && y === a)).toHaveLength(1);
  });
});

describe('result logic', () => {
  it('finds flips toward the present', () => {
    const answers = fill((a) => (a >= 150 ? 'late' : 'soon'), (a) => (a >= 105 ? 'late' : 'soon'));
    expect(presentFlips(answers)).toEqual([105, 110, 120]);
    expect(otherFlips(answers)).toEqual([]);
    expect(wasPulled(answers)).toBe(true);
  });

  it('describes the user’s own choices and never names the bias (P3-1, P3-4)', () => {
    const flipped = whatHappened(null, fill(() => 'soon', () => 'late'));
    expect(flipped).toContain('£150 in a week');
    expect(whatHappened(null, fill(() => 'late', () => 'soon'))).toContain('unusual direction');
    const steady = whatHappened(null, fill(() => 'late', () => 'late'));
    expect(steady).toContain('resisted');
    for (const text of [flipped, steady]) expect(text.toLowerCase()).not.toContain('present bias');
  });
});
