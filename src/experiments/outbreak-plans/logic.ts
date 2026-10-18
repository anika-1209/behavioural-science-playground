import type { Answers } from '../../lib/progress';

// experimentConfig + resultLogic for exp-04.
// Adapted from Tversky & Kahneman (1981): "Asian disease" became "a new disease"
// and the US became "your country". Outcomes and probabilities are unchanged.

export type Frame = 'gain' | 'loss';
export type Choice = 'sure' | 'gamble';

export const SCENARIO =
  'Your country is preparing for the outbreak of an unusual new disease, which is expected to kill 600 people. Two plans to fight it have been proposed. Scientists agree on the exact consequences of each plan.';

export const PLAN_TEXT: Record<Frame, Record<Choice, string>> = {
  gain: {
    sure: 'If Plan A is adopted, 200 people will be saved.',
    gamble:
      'If Plan B is adopted, there is a one-in-three chance that all 600 people will be saved, and a two-in-three chance that nobody will be saved.',
  },
  loss: {
    sure: 'If Plan A is adopted, 400 people will die.',
    gamble:
      'If Plan B is adopted, there is a one-in-three chance that nobody will die, and a two-in-three chance that all 600 people will die.',
  },
};

/** Share choosing the sure option in the original study. */
export const STUDY_SURE: Record<Frame, number> = { gain: 72, loss: 22 };
const MAJORITY: Record<Frame, Choice> = { gain: 'sure', loss: 'gamble' };

export const frameOf = (condition: string | null): Frame => (condition === 'loss' ? 'loss' : 'gain');
export const otherFrame = (f: Frame): Frame => (f === 'gain' ? 'loss' : 'gain');
export const choiceOf = (answers: Answers): Choice => (answers.choice === 'gamble' ? 'gamble' : 'sure');
export const planName = (c: Choice) => (c === 'sure' ? 'Plan A, the sure option' : 'Plan B, the gamble');
const shortPlan = (c: Choice) => (c === 'sure' ? 'Plan A' : 'Plan B');

/** Share of study participants who saw `frame` and made `choice`. */
export const studyShare = (frame: Frame, choice: Choice) =>
  choice === 'sure' ? STUDY_SURE[frame] : 100 - STUDY_SURE[frame];

/** Choosing what most people chose for your wording counts as showing the effect. */
export const wasPulled = (condition: string | null, answers: Answers) =>
  choiceOf(answers) === MAJORITY[frameOf(condition)];

export function whatHappened(condition: string | null, answers: Answers): string {
  const f = frameOf(condition);
  const o = otherFrame(f);
  const ch = choiceOf(answers);
  const pct = studyShare(f, ch);
  const otherPct = studyShare(o, ch);
  const yours = f === 'gain' ? 'lives saved' : 'lives lost';
  const theirs = f === 'gain' ? 'deaths' : 'lives saved';

  if (wasPulled(condition, answers)) {
    return (
      `Your plans were described in terms of ${yours}, and you chose ${planName(ch)}. ` +
      `So did ${pct}% of people who read your version in the original study. ` +
      `But when the same plans were described in terms of ${theirs}, only ${otherPct}% made that choice. ` +
      'The outcomes were identical; only the wording changed, and it changed what most people chose.'
    );
  }
  return (
    `Your plans were described in terms of ${yours}, and you chose ${planName(ch)}. ` +
    `Only ${pct}% of people who read your version in the original study made that choice. ` +
    "You resisted the pull of the wording this time. Most people don't: " +
    `when the plans were described in terms of ${theirs} instead, ${otherPct}% chose ${shortPlan(ch)}, though the outcomes were identical.`
  );
}
