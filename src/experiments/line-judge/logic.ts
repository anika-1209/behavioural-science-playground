import type { Answers } from '../../lib/progress';

// experimentConfig + resultLogic for exp-09 (Asch's line task).
// The "previous players" are scripted. This is an approved exception to P3-3
// (see docs/spec.md); the result screen and debrief both say so.
// Answers: `picks` is one letter per round, e.g. "BACC…".

export type Letter = 'A' | 'B' | 'C';
export const LETTERS: Letter[] = ['A', 'B', 'C'];
export const PLAYERS = ['SK', 'JM', 'AR', 'TL', 'PD'];
export const REVEAL_MS = 450;

export interface Round {
  /** Reference line length, in SVG units. */
  ref: number;
  opts: [number, number, number];
  /** The scripted answer all five players give. */
  group: Letter;
  /** On critical rounds the group answer is wrong. */
  critical?: boolean;
}

export const ROUNDS: Round[] = [
  { ref: 120, opts: [90, 120, 150], group: 'B' },
  { ref: 80, opts: [80, 110, 60], group: 'A' },
  { ref: 140, opts: [140, 110, 170], group: 'C', critical: true },
  { ref: 100, opts: [130, 75, 100], group: 'B', critical: true },
  { ref: 60, opts: [85, 60, 40], group: 'B' },
  { ref: 150, opts: [120, 180, 150], group: 'A', critical: true },
  { ref: 110, opts: [110, 140, 85], group: 'B', critical: true },
  { ref: 130, opts: [100, 160, 130], group: 'C' },
  { ref: 90, opts: [65, 90, 120], group: 'C', critical: true },
  { ref: 70, opts: [95, 50, 70], group: 'A', critical: true },
];

export const correctOf = (r: Round): Letter => LETTERS[r.opts.indexOf(r.ref)]!;
export const picksOf = (answers: Answers): string[] => String(answers.picks ?? '').split('');

const CRITICAL = ROUNDS.map((_, i) => i).filter((i) => ROUNDS[i]!.critical);
const NEUTRAL = ROUNDS.map((_, i) => i).filter((i) => !ROUNDS[i]!.critical);
export const CRITICAL_COUNT = CRITICAL.length;

export const wentWithGroup = (answers: Answers) => {
  const p = picksOf(answers);
  return CRITICAL.filter((i) => p[i] === ROUNDS[i]!.group).length;
};
const neutralRight = (answers: Answers) => {
  const p = picksOf(answers);
  return NEUTRAL.filter((i) => p[i] === correctOf(ROUNDS[i]!)).length;
};

/** Going along with the wrong group answer at least once counts as showing the effect. */
export const wasPulled = (answers: Answers) => wentWithGroup(answers) > 0;

export function whatHappened(_condition: string | null, answers: Answers): string {
  const k = wentWithGroup(answers);
  const nr = neutralRight(answers);
  const nn = NEUTRAL.length;
  const easy =
    nr === nn
      ? `When the group gave the right answer, you got all ${nn} of those rounds right, so the lines themselves weren't hard to judge.`
      : `When the group gave the right answer, you got ${nr} of ${nn} of those rounds right.`;
  const scripted =
    "The other players weren't real: their answers were scripted to test whether a unanimous group would pull you away from what you could see.";

  if (k > 0) {
    return (
      `On ${k} of the ${CRITICAL_COUNT} rounds where all five other players gave the same wrong answer, you gave it too. ${easy} ${scripted} ` +
      "In Asch's studies, people went along on about a third of rounds like these, and about three in four went along at least once."
    );
  }
  return (
    `On all ${CRITICAL_COUNT} rounds where the other five players gave the same wrong answer, you stuck with what you saw. ${easy} ${scripted} ` +
    "You resisted the pull this time. Most people don't: in Asch's studies, about three in four people went along with the group at least once."
  );
}
