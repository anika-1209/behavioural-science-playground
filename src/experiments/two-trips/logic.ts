import type { Answers } from '../../lib/progress';

// experimentConfig + resultLogic for exp-06.
// Adapted from Arkes & Blumer (1985): the ski trips became Edinburgh (£200) and
// a lakeside cabin (£100) the player expects to enjoy more. The paper's figure
// (usually reported as 54%) is shown only as "more than half" until checked (P3-6).

export type Trip = 'city' | 'cabin';

export const choiceOf = (answers: Answers): Trip => (answers.choice === 'cabin' ? 'cabin' : 'city');

/** Choosing the pricier trip you expected to enjoy less counts as showing the effect. */
export const wasPulled = (answers: Answers) => choiceOf(answers) === 'city';

export function whatHappened(_condition: string | null, answers: Answers): string {
  if (wasPulled(answers)) {
    return (
      'You chose Edinburgh, the £200 trip, even though you expected to enjoy the cabin more. ' +
      'Both trips were already paid for and neither could be refunded, so the £300 was gone whichever you picked. ' +
      "The bigger price made Edinburgh feel like the one you couldn't waste. In the original study, more than half of students made the same choice."
    );
  }
  return (
    'You chose the cabin, the trip you expected to enjoy more, and let the £200 booking go. ' +
    'Both trips were already paid for, so the £300 was gone whichever you picked. ' +
    "You resisted the pull this time. Most people don't: in the original study, more than half of students chose the more expensive trip they expected to enjoy less."
  );
}
