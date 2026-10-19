import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-03.
// Questions with fixed, well-established answers. Answers are stored as
// `${id}_lo` and `${id}_hi`.

export interface RangeQuestion {
  id: string;
  text: string;
  unit: string;
  /** Row label on the result chart. */
  short: string;
  /** Used in "What just happened": "your range for {about} was …". */
  about: string;
  answer: number;
}

export const QUESTIONS: RangeQuestion[] = [
  { id: 'q1', text: 'How tall is Mount Everest?', unit: 'metres', short: 'Everest height', about: 'the height of Mount Everest', answer: 8849 },
  { id: 'q2', text: 'In what year was Wolfgang Amadeus Mozart born?', unit: 'year', short: 'Mozart born', about: "Mozart's birth year", answer: 1756 },
  { id: 'q3', text: 'How many bones are in an adult human body?', unit: 'bones', short: 'Bones in the body', about: 'the number of bones in the body', answer: 206 },
  { id: 'q4', text: 'What is the average distance from the Earth to the Moon?', unit: 'kilometres', short: 'Earth to Moon', about: 'the distance to the Moon', answer: 384400 },
  { id: 'q5', text: 'In what year was the Eiffel Tower completed?', unit: 'year', short: 'Eiffel Tower built', about: 'the year the Eiffel Tower was completed', answer: 1889 },
  { id: 'q6', text: 'In what year did the Great Fire of London happen?', unit: 'year', short: 'Great Fire of London', about: 'the year of the Great Fire of London', answer: 1666 },
  { id: 'q7', text: "What is the Earth's diameter at the equator?", unit: 'kilometres', short: "Earth's diameter", about: "the Earth's diameter", answer: 12756 },
  { id: 'q8', text: 'How fast does sound travel through air at 20 °C?', unit: 'metres per second', short: 'Speed of sound', about: 'the speed of sound', answer: 343 },
  { id: 'q9', text: 'In what year was William Shakespeare born?', unit: 'year', short: 'Shakespeare born', about: "Shakespeare's birth year", answer: 1564 },
  { id: 'q10', text: 'How many chemical elements are in the periodic table?', unit: 'elements', short: 'Chemical elements', about: 'the number of chemical elements', answer: 118 },
];

/** Ranges held with 90% confidence should catch about 9 answers in 10. */
export const TARGET = 9;

/** Accepts "8,000", "8 000" or "343.5". Returns null for anything else. */
export function parseNumber(raw: string): number | null {
  const s = raw.trim().replace(/[,\s]/g, '');
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
}

export const rangeOf = (q: RangeQuestion, answers: Answers): [number, number] => [
  Number(answers[`${q.id}_lo`]),
  Number(answers[`${q.id}_hi`]),
];

export function isInside(q: RangeQuestion, answers: Answers) {
  const [lo, hi] = rangeOf(q, answers);
  return lo <= q.answer && q.answer <= hi;
}

export const hits = (answers: Answers) => QUESTIONS.filter((q) => isInside(q, answers)).length;

/** Seven or fewer hits out of ten counts as showing the effect. */
export const wasPulled = (answers: Answers) => hits(answers) <= 7;

export const formatValue = (n: number, q: RangeQuestion) => (q.unit === 'year' ? String(n) : n.toLocaleString('en-GB'));

export function whatHappened(_condition: string | null, answers: Answers): string {
  const h = hits(answers);
  if (h <= 7) {
    const miss = QUESTIONS.find((q) => !isInside(q, answers))!;
    const [lo, hi] = rangeOf(miss, answers);
    const unit = miss.unit === 'year' ? '' : ` ${miss.unit}`;
    return (
      `You were 90% sure of every range, so about ${TARGET} of your 10 should have caught the true answer. ${h} did. ` +
      `For example, your range for ${miss.about} was ${formatValue(lo, miss)} to ${formatValue(hi, miss)}${unit}. ` +
      `The answer is ${formatValue(miss.answer, miss)}. Your ranges were narrower than what you actually knew.`
    );
  }
  const most =
    "Most people do much worse: in tests like this, people's 90% ranges usually catch the answer far fewer than 9 times in 10.";
  if (h === 8) {
    return `8 of your 10 ranges caught the true answer. That's close to the ${TARGET} you'd expect from ranges you were 90% sure of, so you were only slightly too sure. ${most}`;
  }
  return `${h} of your 10 ranges caught the true answer, which matches the ${TARGET} in 10 you'd expect from ranges you were 90% sure of. You resisted the pull this time. Most people don't: in tests like this, people's 90% ranges usually catch the answer far fewer than 9 times in 10.`;
}
