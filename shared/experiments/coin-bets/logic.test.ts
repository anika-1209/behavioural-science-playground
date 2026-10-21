import { describe, expect, it } from 'vitest';
import type { Answers } from '../../types';
import { ORDER, WINS, inconsistent, keyOf, money, threshold, wasPulled, whatHappened } from './logic';

/** Accepts every bet whose win passes `take`. */
const answer = (take: (win: number) => boolean): Answers =>
  Object.fromEntries(WINS.map((w) => [keyOf(w), take(w) ? 'accept' : 'reject']));

describe('bets', () => {
  it('asks every bet once', () => {
    expect([...ORDER].sort((a, b) => a - b)).toEqual(WINS);
  });
});

describe('result logic', () => {
  it('finds the smallest win accepted from the top down', () => {
    expect(threshold(answer((w) => w >= 20))).toBe(20);
    expect(threshold(answer(() => false))).toBeNull();
    expect(threshold(answer((w) => w === 12 || w >= 25))).toBe(25);
    expect(inconsistent(answer((w) => w === 12 || w >= 25))).toBe(true);
    expect(inconsistent(answer((w) => w >= 15))).toBe(false);
  });

  it('reads turning down the £15 bet as the effect', () => {
    expect(wasPulled(answer((w) => w >= 20))).toBe(true);
    expect(wasPulled(answer((w) => w >= 15))).toBe(false);
  });

  it('describes the user’s own bets and never names the bias (P3-1, P3-4)', () => {
    const needed = whatHappened(null, answer((w) => w >= 20));
    expect(needed).toContain('at least £20');
    expect(needed).toContain('£15 one would leave you £2.50 better off');
    expect(whatHappened(null, answer(() => false))).toContain('turned down every bet');
    expect(whatHappened(null, answer((w) => w === 12))).toContain('best bet on offer');
    const brave = whatHappened(null, answer((w) => w >= 12));
    expect(brave).toContain('and even the £12 one');
    expect(brave).toContain('resisted');
    expect(whatHappened(null, answer((w) => w === 15 || w === 30))).toContain('straight line');
    for (const text of [needed, brave]) expect(text.toLowerCase()).not.toContain('aversion');
    expect(money(7.5)).toBe('£7.50');
  });
});
