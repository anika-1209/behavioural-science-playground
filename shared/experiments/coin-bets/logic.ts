import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-12.
// Six hypothetical bets on one toss of a fair coin: lose £10 on tails, win a
// larger or equal amount on heads. Shown in a fixed mixed order. Answers:
// `w${win}` → 'accept' | 'reject'.

export const STAKE = 10;
export const WINS = [10, 12, 15, 20, 25, 30];
export const ORDER = [20, 12, 30, 10, 25, 15];

export type Pick = 'accept' | 'reject';

export const keyOf = (win: number) => `w${win}`;

export const accepted = (answers: Answers, win: number) => answers[keyOf(win)] === 'accept';

/** Original study: people typically needed to win about twice what they could lose (P3-6). */
export const STUDY_RATIO = 2;

/**
 * The smallest win the player accepted, with every larger win accepted too.
 * Null if they turned down the largest bet.
 */
export function threshold(answers: Answers): number | null {
  let t: number | null = null;
  for (let i = WINS.length - 1; i >= 0 && accepted(answers, WINS[i]!); i--) t = WINS[i]!;
  return t;
}

/** Accepted a smaller win but turned down a larger one. */
export const inconsistent = (answers: Answers) =>
  WINS.some((w, i) => accepted(answers, w) && WINS.slice(i + 1).some((x) => !accepted(answers, x)));

/** Turned down bets that paid back half as much again as the stake, or more. */
export const wasPulled = (answers: Answers) => !accepted(answers, 15);

/** Turned-down bets where the win was larger than the stake. */
export const rejectedGood = (answers: Answers) => WINS.filter((w) => w > STAKE && !accepted(answers, w));

/** £1 → "£1", £7.5 → "£7.50". */
export const money = (x: number) => `£${Number.isInteger(x) ? x : x.toFixed(2)}`;

export function whatHappened(_condition: string | null, answers: Answers): string {
  const t = threshold(answers);
  const turned = rejectedGood(answers);
  const best = turned[turned.length - 1];
  const odd = inconsistent(answers)
    ? ' Your answers also weren\'t in a straight line: you took at least one bet while turning down a better one.'
    : '';
  if (wasPulled(answers)) {
    const need =
      t !== null
        ? `You needed a chance to win at least £${t} before you'd risk losing £${STAKE}.`
        : WINS.some((w) => accepted(answers, w))
          ? `You turned down the best bet on offer, a 50/50 chance to win £30 against losing £${STAKE}.`
          : `You turned down every bet, even a 50/50 chance to win £30 against losing £${STAKE}.`;
    return (
      `${need} On average, a bet like the £${best} one would leave you ${money((best! - STAKE) / 2)} better off each time you took it. ` +
      `The chance of losing £${STAKE} weighed more than the chance of winning more. In studies of bets like these, people typically need to be able to win about twice what they could lose.` +
      odd
    );
  }
  return (
    `You took the 50/50 bet to win £15 against losing £${STAKE}${t !== null && t < 15 ? `, and even the £${t} one` : ''}. You resisted the pull this time.` +
    odd +
    ' Many people don\'t: they turn down a 50/50 bet to win £15 or £20 against losing £10, because the possible loss looms larger than the gain.'
  );
}
