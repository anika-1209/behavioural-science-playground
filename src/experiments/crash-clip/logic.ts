import type { Answers } from '../../lib/progress';

// experimentConfig + resultLogic for exp-08.
// Adapted from Loftus & Palmer (1974). The verb in the speed question is the only
// difference between versions. The original asked about broken glass a week
// later; here it comes a minute after the clip, so the effect is likely weaker.

export type Verb = 'smashed' | 'hit';

export const VERB_TEXT: Record<Verb, string> = { smashed: 'smashed into', hit: 'hit' };
/** Share saying "yes" to broken glass a week later in the original study. */
export const GLASS_YES: Record<Verb, number> = { smashed: 32, hit: 14 };
/** Mean speed estimates (mph) in the original study's first experiment. */
export const SPEED: Record<Verb, number> = { smashed: 40.5, hit: 34 };

export const CLIP_MS = 4400;

export const verbOf = (condition: string | null): Verb => (condition === 'hit' ? 'hit' : 'smashed');
export const sawGlass = (answers: Answers) => answers.glass === 'yes';

/** Remembering broken glass that wasn't there counts as showing the effect. */
export const wasPulled = (answers: Answers) => sawGlass(answers);

export function parseSpeed(raw: string): number | null {
  const s = raw.trim();
  return /^\d{1,3}$/.test(s) ? Number(s) : null;
}

export function whatHappened(condition: string | null, answers: Answers): string {
  const v = verbOf(condition);
  const saw = sawGlass(answers);
  const gap = Math.round(SPEED.smashed - SPEED.hit);
  const speed =
    ` You estimated the cars were going ${answers.speed} mph. In the original study, people asked with "smashed" ` +
    `gave speeds about ${gap} mph higher on average than people asked with "hit".`;

  if (v === 'smashed') {
    return saw
      ? 'You were asked how fast the cars were going when they "smashed into" each other. Later you said you saw broken glass. There was none in the clip. ' +
          `In the original study, ${GLASS_YES.smashed}% of people asked with "smashed" reported broken glass, compared with ${GLASS_YES.hit}% of those asked with "hit". ` +
          'The word in the question added a detail to your memory.' +
          speed
      : 'You were asked how fast the cars were going when they "smashed into" each other, but you correctly said there was no broken glass. You resisted the pull this time. ' +
          `In the original study, ${GLASS_YES.smashed}% of people asked with "smashed" reported broken glass that wasn't there, compared with ${GLASS_YES.hit}% of those asked with "hit".` +
          speed;
  }
  return saw
    ? 'You were asked about cars that "hit" each other, the milder word, yet you said you saw broken glass. There was none in the clip. ' +
        `Some people remember details that weren't there even after a neutral question: ${GLASS_YES.hit}% did in the original study. ` +
        `Other players were asked about cars that "smashed into" each other, and ${GLASS_YES.smashed}% of that group in the original study reported glass.` +
        speed
    : 'You were asked about cars that "hit" each other, and you correctly said there was no broken glass. Other players were asked about cars that "smashed into" each other. ' +
        `In the original study, that one word more than doubled the share of people who remembered broken glass that wasn't there: ${GLASS_YES.smashed}% against ${GLASS_YES.hit}%.` +
        speed;
}
