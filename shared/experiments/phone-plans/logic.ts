import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-05.
// Two main plans for everyone, plus a third plan that is worse in every way than
// one of them: the 40 GB plan in the `premium` version, the 10 GB plan in `budget`.
// Design follows Huber, Payne & Puto (1982). No study figures are shown (no
// trustworthy one exists for this set-up); live data can replace that later.

export type Version = 'premium' | 'budget';
export type PlanId = 'small' | 'large' | 'large-third' | 'small-third';

export const PLANS: Record<PlanId, { gb: number; price: number }> = {
  small: { gb: 10, price: 10 },
  large: { gb: 40, price: 20 },
  'large-third': { gb: 30, price: 22 },
  'small-third': { gb: 6, price: 12 },
};

/** Plans in the order shown, cheapest first. */
export const MENU: Record<Version, PlanId[]> = {
  premium: ['small', 'large', 'large-third'],
  budget: ['small', 'small-third', 'large'],
};
export const TARGET: Record<Version, PlanId> = { premium: 'large', budget: 'small' };
const COMPETITOR: Record<Version, PlanId> = { premium: 'small', budget: 'large' };
export const THIRD: Record<Version, PlanId> = { premium: 'large-third', budget: 'small-third' };

export const versionOf = (condition: string | null): Version => (condition === 'budget' ? 'budget' : 'premium');
export const otherVersion = (v: Version): Version => (v === 'premium' ? 'budget' : 'premium');
export const choiceOf = (answers: Answers): PlanId =>
  String(answers.choice) in PLANS ? (answers.choice as PlanId) : 'small';

export const planLabel = (id: PlanId) => `${PLANS[id].gb} GB for £${PLANS[id].price}`;
const desc = (id: PlanId) => `the ${planLabel(id)} plan`;

/** Choosing the plan the third plan was worse than counts as showing the effect. */
export const wasPulled = (condition: string | null, answers: Answers) =>
  choiceOf(answers) === TARGET[versionOf(condition)];

export function whatHappened(condition: string | null, answers: Answers): string {
  const v = versionOf(condition);
  const t = TARGET[v];
  const th = THIRD[v];
  const ch = choiceOf(answers);
  const beaten = `Your third plan, ${desc(th)}, was worse than ${desc(t)} in every way: it cost more and gave you less data.`;
  const others =
    `Other players saw a different third plan, one that was worse than ${desc(TARGET[otherVersion(v)])} instead. ` +
    'In studies like this, adding a plan that is clearly beaten by one option, but not by the other, raises the share of people choosing the option that beats it.';

  if (ch === t) return `${beaten} Next to it, ${desc(t)} looked like a clear win, and you chose it. ${others}`;
  if (ch === COMPETITOR[v]) {
    return `${beaten} It was there to make ${desc(t)} look good, but you chose ${desc(ch)}. You resisted the pull this time. Many people don't. ${others}`;
  }
  return (
    `You chose ${desc(th)}. It was worse than ${desc(t)} in every way: it cost more and gave you less data. ` +
    `A plan like that is rarely chosen. Its job is to make the plan that beats it look good. ${others}`
  );
}
