import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-10.
// £100 sooner against a larger amount one week later, either starting today
// ("near") or a year from now ("far"). Shown in a fixed mixed order.
// Answers: `${horizon}-${amount}` → 'soon' | 'late'.

export type Horizon = 'near' | 'far';
export type Pick = 'soon' | 'late';

export const BASE = 100;
export const LATER = [101, 105, 110, 120, 150];
export const WHEN: Record<Horizon, { soon: string; late: string }> = {
  near: { soon: 'Today', late: 'In 1 week' },
  far: { soon: 'In 52 weeks', late: 'In 53 weeks' },
};
export const ORDER: [Horizon, number][] = [
  ['near', 110], ['far', 105], ['near', 101], ['far', 150], ['near', 120],
  ['far', 110], ['near', 150], ['far', 101], ['near', 105], ['far', 120],
];

export const keyOf = (h: Horizon, amount: number) => `${h}-${amount}`;
export const pickOf = (answers: Answers, h: Horizon, amount: number): Pick =>
  answers[keyOf(h, amount)] === 'late' ? 'late' : 'soon';

/** Amounts where the player took £100 today but waited when the same choice was a year away. */
export const presentFlips = (answers: Answers) =>
  LATER.filter((a) => pickOf(answers, 'near', a) === 'soon' && pickOf(answers, 'far', a) === 'late');
/** The unusual direction: patient today, impatient a year out. */
export const otherFlips = (answers: Answers) =>
  LATER.filter((a) => pickOf(answers, 'near', a) === 'late' && pickOf(answers, 'far', a) === 'soon');

export const wasPulled = (answers: Answers) => presentFlips(answers).length > 0;

const amounts = (n: number) => (n === 1 ? 'one amount' : `${n} amounts`);

export function whatHappened(_condition: string | null, answers: Answers): string {
  const f = presentFlips(answers);
  const o = otherFlips(answers);
  if (f.length) {
    const a = f[f.length - 1]!;
    return (
      `Your choices flipped on ${amounts(f.length)}. For example, offered £100 today or £${a} in a week, you took the £100 today. ` +
      `Offered the same £100 in 52 weeks or £${a} in 53 weeks, you chose to wait. ` +
      `Both times the wait was one week and the extra was £${a - BASE}. The only difference was whether the £100 came now. ` +
      "Many people's patience drops sharply when the earlier option is today."
    );
  }
  if (o.length) {
    return (
      `Your choices flipped on ${amounts(o.length)}, but in the unusual direction: you were more patient when the £100 was on offer today than when it was a year away. ` +
      "Most people's choices flip the other way, taking the money today but planning to wait when both payments are in the future."
    );
  }
  return (
    'You made the same choice for each amount whether the £100 came today or in a year. You resisted the pull this time. ' +
    "Many people don't: offered £100 today or a bit more in a week, they take the money now, yet when both payments are a year away they happily wait the extra week."
  );
}
