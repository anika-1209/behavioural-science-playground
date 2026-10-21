import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-13.
// Six estimates, then the real answers, then: "what did you answer the first
// time?" Recalled answers that drift toward the real one show the effect.
// Answers: `${id}_first` and `${id}_recall`, both numbers. Answers need expert
// review (P3-6). No study figure is shown: the classic study used a different
// design, so its numbers don't compare.

export interface Question {
  id: string;
  text: string;
  unit: string;
  /** Row label on the result table. */
  short: string;
  /** Used in "What just happened": "you first said … for {about}". */
  about: string;
  answer: number;
}

export const QUESTIONS: Question[] = [
  { id: 'q1', text: 'How long is the River Thames?', unit: 'kilometres', short: 'River Thames', about: 'the length of the River Thames', answer: 346 },
  { id: 'q2', text: 'How many keys does a standard piano have?', unit: 'keys', short: 'Piano keys', about: 'the number of piano keys', answer: 88 },
  { id: 'q3', text: 'How tall is Ben Nevis?', unit: 'metres', short: 'Ben Nevis', about: 'the height of Ben Nevis', answer: 1345 },
  { id: 'q4', text: 'In what year did Victoria become queen?', unit: 'year', short: 'Victoria queen', about: 'the year Victoria became queen', answer: 1837 },
  { id: 'q5', text: 'How many bones are in one human hand, including the wrist?', unit: 'bones', short: 'Bones in a hand', about: 'the number of bones in a hand', answer: 27 },
  { id: 'q6', text: 'In what year did the first iPhone go on sale?', unit: 'year', short: 'First iPhone', about: 'the year of the first iPhone', answer: 2007 },
];

/** Accepts "1,345", "1 345" or "346.5". Returns null for anything else. */
export function parseNumber(raw: string): number | null {
  const s = raw.trim().replace(/[,\s]/g, '');
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
}

export const firstOf = (q: Question, answers: Answers) => Number(answers[`${q.id}_first`]);
export const recallOf = (q: Question, answers: Answers) => Number(answers[`${q.id}_recall`]);

export type Drift = 'toward' | 'away' | 'same';

/** How the recalled answer moved compared with the first answer, relative to the real one. */
export function driftOf(q: Question, answers: Answers): Drift {
  const first = firstOf(q, answers);
  const recall = recallOf(q, answers);
  if (recall === first) return 'same';
  return Math.abs(recall - q.answer) < Math.abs(first - q.answer) ? 'toward' : 'away';
}

export const count = (answers: Answers, d: Drift) => QUESTIONS.filter((q) => driftOf(q, answers) === d).length;

/** More recalled answers moved toward the real answer than away from it. */
export const wasPulled = (answers: Answers) => count(answers, 'toward') > count(answers, 'away');

const qs = (n: number) => (n === 1 ? '1 question' : `${n} questions`);

export function whatHappened(_condition: string | null, answers: Answers): string {
  const toward = count(answers, 'toward');
  const away = count(answers, 'away');
  const same = count(answers, 'same');
  if (wasPulled(answers)) {
    const q = QUESTIONS.find((x) => driftOf(x, answers) === 'toward')!;
    return (
      `On ${qs(toward)}, the answer you remembered giving was closer to the real one than what you actually wrote. ` +
      `For example, you first said ${firstOf(q, answers)} for ${q.about}, but remembered saying ${recallOf(q, answers)}. The real answer is ${q.answer}. ` +
      'Once you knew the answer, it quietly reshaped your memory of what you had thought before, so you seemed to have known more than you did.'
    );
  }
  if (same === QUESTIONS.length) {
    return (
      'You remembered every one of your first answers exactly. You resisted the pull this time, helped by the short gap. ' +
      'Many people don\'t: once they know the real answer, their memory of their own guess drifts toward it, especially after days or weeks.'
    );
  }
  return (
    `Your remembered answers moved toward the real one on ${qs(toward)} and away from it on ${qs(away)}, so knowing the answers didn't pull your memory in one direction. You resisted the pull this time. ` +
    'Many people don\'t: once they know the real answer, their memory of their own guess drifts toward it.'
  );
}
