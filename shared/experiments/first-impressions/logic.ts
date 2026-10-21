import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-16.
// A short profile of Sam, a trainee teacher, then an identical note Sam wrote.
// The only difference between versions is one sentence describing Sam as warm
// or cold. Players rate the note and Sam's intelligence (1–7), then say whether
// the description affected their rating. The effect shows only when the two
// groups are compared. Answers: clarity, organised, smart → 1–7;
// influence → 'none' | 'little' | 'lot'.

export type Version = 'warm' | 'cold';
export type Influence = 'none' | 'little' | 'lot';

export const TRAIT_WORDS: Record<Version, string> = {
  warm: 'warm, friendly and patient',
  cold: 'cold, distant and impatient',
};

export const TRAITS: Record<Version, string> = {
  warm: `Colleagues describe Sam as ${TRAIT_WORDS.warm}.`,
  cold: `Colleagues describe Sam as ${TRAIT_WORDS.cold}.`,
};

export const NOTE = [
  'Dear parents and carers,',
  'Year 9 will visit the Science Museum on Friday 14 March. The coach leaves school at 8:45am and returns by 4pm. Students should bring a packed lunch, a water bottle and a coat, as we will be walking between buildings.',
  'The trip costs £12, which can be paid through the school app by Monday. If your child has any medical needs, please let me know before the trip.',
  'Thanks,',
  'Sam',
];

export const RATINGS = [
  { id: 'clarity', question: 'How clearly is the note written?', low: 'Very unclear', high: 'Very clear' },
  { id: 'organised', question: 'How well organised is the note?', low: 'Very poorly', high: 'Very well' },
  { id: 'smart', question: 'How intelligent do you think Sam is?', low: 'Not at all', high: 'Very' },
] as const;

export const SCALE = [1, 2, 3, 4, 5, 6, 7];

export const INFLUENCE: { id: Influence; label: string }[] = [
  { id: 'none', label: 'Not at all' },
  { id: 'little', label: 'A little' },
  { id: 'lot', label: 'A lot' },
];

export const versionOf = (condition: string | null): Version => (condition === 'cold' ? 'cold' : 'warm');

/** Average of the two ratings of the note itself. */
export const writingScore = (answers: Answers) => (Number(answers.clarity) + Number(answers.organised)) / 2;

export const influenceOf = (answers: Answers): Influence =>
  answers.influence === 'little' || answers.influence === 'lot' ? answers.influence : 'none';

export function whatHappened(condition: string | null, answers: Answers): string {
  const v = versionOf(condition);
  const score = writingScore(answers);
  const said = INFLUENCE.find((i) => i.id === influenceOf(answers))!.label.toLowerCase();
  return (
    `You read that colleagues found Sam ${TRAIT_WORDS[v]}, and you rated Sam's note ${score} out of 7 for how well it was written. ` +
    `Other players read the same note, word for word, but were told Sam was ${TRAIT_WORDS[v === 'warm' ? 'cold' : 'warm']}. ` +
    `You said the description affected your rating ${said}. ` +
    "One rating can't show the effect on its own: it shows up when the two groups are compared. In studies like this, people who are told someone is warm rate their work and their other qualities more highly, and usually say the description made no difference."
  );
}
