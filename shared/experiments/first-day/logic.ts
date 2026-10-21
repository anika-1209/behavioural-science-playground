import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-14.
// An imagined first-day form with three choices. In the `out` version every
// choice starts unselected or at "no"; in the `in` version every choice starts
// at "yes", with the pension at 5%. The pension is the choice that counts.
// Answers: pension → '0' | '3' | '5' | '8', newsletter and birthday → 'yes' | 'no'.

export type Version = 'out' | 'in';
export type YesNo = 'yes' | 'no';

export const PENSION = ['0', '3', '5', '8'] as const;
export type Pension = (typeof PENSION)[number];

export const DEFAULTS: Record<Version, { pension: Pension; newsletter: YesNo; birthday: YesNo }> = {
  out: { pension: '0', newsletter: 'no', birthday: 'no' },
  in: { pension: '5', newsletter: 'yes', birthday: 'yes' },
};

/** Share of new employees in the pension plan, before and after it became automatic (P3-6). */
export const STUDY_JOINED: Record<Version, number> = { out: 37, in: 86 };

export const versionOf = (condition: string | null): Version => (condition === 'in' ? 'in' : 'out');
export const otherVersion = (v: Version): Version => (v === 'in' ? 'out' : 'in');

export const pensionOf = (answers: Answers): Pension =>
  (PENSION as readonly string[]).includes(String(answers.pension)) ? (String(answers.pension) as Pension) : '0';

export const joined = (answers: Answers) => pensionOf(answers) !== '0';

/** How many of the three choices the player left as they were. */
export const kept = (condition: string | null, answers: Answers) => {
  const d = DEFAULTS[versionOf(condition)];
  return [pensionOf(answers) === d.pension, answers.newsletter === d.newsletter, answers.birthday === d.birthday].filter(
    Boolean,
  ).length;
};

/** Leaving the pension as it was set counts as showing the effect. */
export const wasPulled = (condition: string | null, answers: Answers) =>
  pensionOf(answers) === DEFAULTS[versionOf(condition)].pension;

const pct = (p: Pension) => (p === '0' ? 'no pension saving' : `${p}% of your pay`);

export function whatHappened(condition: string | null, answers: Answers): string {
  const v = versionOf(condition);
  const d = DEFAULTS[v];
  const k = kept(condition, answers);
  const start = v === 'in' ? 'with every choice set to "yes" and the pension at 5%' : 'with every choice set to "no" and the pension at 0%';
  const others =
    v === 'in'
      ? 'Other players got the same form with every choice set to "no" and the pension at 0%.'
      : 'Other players got the same form with every choice set to "yes" and the pension at 5%.';
  const study = `When one US company made its pension automatic, the share of new staff saving rose from ${STUDY_JOINED.out}% to ${STUDY_JOINED.in}%.`;
  if (wasPulled(condition, answers)) {
    return (
      `Your form started ${start}, and you kept ${pct(d.pension)}. You left ${k} of the 3 choices as they were. ${others} ` +
      'Most people keep whatever is pre-selected, so the people who set up a form often decide more than the people who fill it in. ' +
      study
    );
  }
  return (
    `Your form started ${start}, and you changed the pension to ${pct(pensionOf(answers))}. You left ${k} of the 3 choices as they were. ${others} ` +
    'You resisted the pull on the pension this time. Most people keep whatever is pre-selected. ' +
    study
  );
}
