import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-11.
// Six rounds: the recent tosses of a fair coin, then a bet on the next toss
// with no "equally likely" option. Four rounds end in a streak, two don't.
// Then one direct question about a streak, so the result can set what the
// player says against how they bet. No study figure is shown: there is no
// single trustworthy one for this set-up (P3-6). Answers: r1…r6 → 'H' | 'T',
// belief → 'heads' | 'tails' | 'equal'.

export type Side = 'H' | 'T';
export type Belief = 'heads' | 'tails' | 'equal';

export interface Round {
  id: string;
  /** Tosses so far, oldest first. */
  tosses: Side[];
}

const seq = (s: string) => s.split('') as Side[];

export const ROUNDS: Round[] = [
  { id: 'r1', tosses: seq('HTTHT') },
  { id: 'r2', tosses: seq('THHHH') },
  { id: 'r3', tosses: seq('HTHHT') },
  { id: 'r4', tosses: seq('HTTTTT') },
  { id: 'r5', tosses: seq('TTHHH') },
  { id: 'r6', tosses: seq('HHHHHH') },
];

/** A run of this many identical tosses at the end counts as a streak. */
export const STREAK_MIN = 3;

export const BELIEFS: { id: Belief; label: string }[] = [
  { id: 'heads', label: 'Heads' },
  { id: 'tails', label: 'Tails' },
  { id: 'equal', label: 'Equally likely' },
];

export const sideName = (s: Side) => (s === 'H' ? 'heads' : 'tails');

/** Length of the run of identical tosses at the end. */
export function runLength(tosses: Side[]): number {
  const last = tosses[tosses.length - 1];
  let n = 0;
  for (let i = tosses.length - 1; i >= 0 && tosses[i] === last; i--) n++;
  return n;
}

export const streakOf = (r: Round): Side | null =>
  runLength(r.tosses) >= STREAK_MIN ? r.tosses[r.tosses.length - 1]! : null;

export const STREAK_ROUNDS = ROUNDS.filter((r) => streakOf(r));

export const betOf = (answers: Answers, r: Round): Side => (answers[r.id] === 'T' ? 'T' : 'H');

/** Streak rounds where the player bet the streak would end. */
export const againstStreak = (answers: Answers) =>
  STREAK_ROUNDS.filter((r) => betOf(answers, r) !== streakOf(r)).length;

export const withStreak = (answers: Answers) => STREAK_ROUNDS.length - againstStreak(answers);

export const beliefOf = (answers: Answers): Belief =>
  answers.belief === 'heads' || answers.belief === 'tails' ? answers.belief : 'equal';

/** Betting against most streaks counts as showing the effect. */
export const MAJORITY = Math.ceil((STREAK_ROUNDS.length + 1) / 2);

export const wasPulled = (answers: Answers) => againstStreak(answers) >= MAJORITY;

/** The other direction: expecting streaks to continue. */
export const followedStreaks = (answers: Answers) => withStreak(answers) >= MAJORITY;

const ofStreaks = (n: number) => `${n} of the ${STREAK_ROUNDS.length} rounds that ended in a streak`;

export function whatHappened(_condition: string | null, answers: Answers): string {
  const against = againstStreak(answers);
  const belief = beliefOf(answers);
  const said =
    belief === 'equal'
      ? 'When asked directly, you said heads and tails were equally likely after six heads, which is right. '
      : `When asked directly, you said ${belief} was more likely after six heads. In fact each toss is still 50/50. `;
  if (wasPulled(answers)) {
    return (
      `You bet that the streak would end on ${ofStreaks(against)}. ` +
      said +
      'A coin has no memory, so a run of heads makes tails no more likely. Yet a long streak makes the other side feel "due". ' +
      'Casino records show roulette players betting the same way after a colour comes up several times in a row.'
    );
  }
  if (followedStreaks(answers)) {
    return (
      `You bet that the streak would continue on ${ofStreaks(withStreak(answers))}. ` +
      said +
      'Expecting a streak to carry on is the opposite mistake, and it is less common with coins. ' +
      'Most people lean the other way and bet that a long run is about to end.'
    );
  }
  return (
    `You split your bets evenly across the streak rounds. You resisted the pull this time. ` +
    said +
    'Most people don\'t: after a long run of heads, they tend to bet on tails, as if the coin had to even things out.'
  );
}
