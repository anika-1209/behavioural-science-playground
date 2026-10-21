import { describe, expect, it } from 'vitest';
import type { Answers } from '../../types';
import {
  MAJORITY,
  ROUNDS,
  STREAK_ROUNDS,
  againstStreak,
  followedStreaks,
  runLength,
  streakOf,
  wasPulled,
  whatHappened,
  type Belief,
  type Side,
} from './logic';

/** Bets on every round: against or with the streak, and `control` on the others. */
function bets(streak: 'against' | 'with', belief: Belief = 'equal', control: Side = 'H'): Answers {
  const out: Answers = { belief };
  for (const r of ROUNDS) {
    const s = streakOf(r);
    out[r.id] = s ? (streak === 'with' ? s : s === 'H' ? 'T' : 'H') : control;
  }
  return out;
}

describe('rounds', () => {
  it('has four streak rounds, of both sides, and two without a streak', () => {
    expect(STREAK_ROUNDS).toHaveLength(4);
    expect(new Set(STREAK_ROUNDS.map(streakOf))).toEqual(new Set(['H', 'T']));
    expect(ROUNDS.filter((r) => !streakOf(r))).toHaveLength(2);
    expect(runLength(['H', 'T', 'T', 'T'])).toBe(3);
  });
});

describe('result logic', () => {
  it('reads betting against most streaks as the effect', () => {
    expect(againstStreak(bets('against'))).toBe(4);
    expect(wasPulled(bets('against'))).toBe(true);
    expect(wasPulled(bets('with'))).toBe(false);
    expect(followedStreaks(bets('with'))).toBe(true);
    expect(MAJORITY).toBe(3);
  });

  it('describes the user’s own bets and answer, and never names the bias (P3-1, P3-4)', () => {
    const against = whatHappened(null, bets('against', 'tails'));
    expect(against).toContain('streak would end on 4 of the 4');
    expect(against).toContain('you said tails was more likely');
    const following = whatHappened(null, bets('with'));
    expect(following).toContain('opposite mistake');
    const split = { ...bets('with'), [STREAK_ROUNDS[0]!.id]: streakOf(STREAK_ROUNDS[0]!) === 'H' ? 'T' : 'H', [STREAK_ROUNDS[1]!.id]: streakOf(STREAK_ROUNDS[1]!) === 'H' ? 'T' : 'H' };
    const even = whatHappened(null, split);
    expect(even).toContain('resisted');
    expect(even).toContain('equally likely after six heads, which is right');
    for (const text of [against, following, even]) expect(text.toLowerCase()).not.toContain('fallacy');
  });
});
