import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-15.
// One mug, two versions: in `owner` the player imagines it was given to them
// and names the lowest price they'd sell it for; in `buyer` they name the most
// they'd pay for it. The effect shows only when the two groups are compared.
// Answers: price → pounds, 0–100, to the penny.

export type Version = 'owner' | 'buyer';

export const MAX_PRICE = 100;

/** Median prices in the original study, in US dollars (P3-6). */
export const STUDY_MEDIAN: Record<Version, number> = { owner: 7.12, buyer: 2.87 };

export const versionOf = (condition: string | null): Version => (condition === 'buyer' ? 'buyer' : 'owner');
export const otherVersion = (v: Version): Version => (v === 'owner' ? 'buyer' : 'owner');

/** Accepts "4", "£4", "4.50" or "£4.5". Returns null for anything else or above MAX_PRICE. */
export function parsePrice(raw: string): number | null {
  const s = raw.trim().replace(/^£/, '');
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(s)) return null;
  const n = Number(s);
  return n <= MAX_PRICE ? n : null;
}

export const priceOf = (answers: Answers) => Number(answers.price);

export const money = (x: number) => (Number.isInteger(x) ? `£${x}` : `£${x.toFixed(2)}`);
const dollars = (x: number) => `$${x.toFixed(2)}`;

export function whatHappened(condition: string | null, answers: Answers): string {
  const v = versionOf(condition);
  const p = money(priceOf(answers));
  const mine =
    v === 'owner'
      ? `You imagined the mug was yours, and said you wouldn't sell it for less than ${p}.`
      : `You imagined seeing the mug for sale, and said you'd pay at most ${p} for it.`;
  const other =
    v === 'owner'
      ? 'Other players imagined buying the same mug and said the most they would pay.'
      : 'Other players imagined the same mug was already theirs and said the lowest price they would sell it for.';
  return (
    `${mine} ${other} ` +
    "One answer can't show the effect on its own: it shows up when the two groups are compared. " +
    `In the original study, people who had just been given a mug asked a median of ${dollars(STUDY_MEDIAN.owner)} to part with it, ` +
    `while people without one offered ${dollars(STUDY_MEDIAN.buyer)} for the same mug. Owning it, even for a few minutes, made it worth more to them.`
  );
}
