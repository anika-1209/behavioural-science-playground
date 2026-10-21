import { ANCHOR } from './experiments/wheel-estimate/logic';
import { PAIRS } from './experiments/risk-pairs/logic';
import { QUESTIONS } from './experiments/range-quiz/logic';
import { MENU, versionOf } from './experiments/phone-plans/logic';
import { MAX_TESTS, RULES } from './experiments/rule-finder/logic';
import { COLOURS } from './experiments/crash-clip/logic';
import { ROUNDS } from './experiments/line-judge/logic';
import { ORDER, keyOf } from './experiments/now-later/logic';
import { ROUNDS as FLIPS, BELIEFS } from './experiments/next-flip/logic';
import { WINS, keyOf as betKey } from './experiments/coin-bets/logic';

// Spec "Data quality": answers must match the experiment's fixed format
// exactly, or the API rejects them. Each rule mirrors what the Task submits.

type Check = (v: unknown) => boolean;
type Shape = Record<string, Check>;

const oneOf =
  (...values: unknown[]): Check =>
  (v) =>
    values.includes(v);

const wholeNumber =
  (min: number, max: number): Check =>
  (v) =>
    typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;

/** The range quiz accepts any non-negative number, decimals included (see parseNumber). */
const rangeNumber: Check = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1e12;

const pattern =
  (re: RegExp): Check =>
  (v) =>
    typeof v === 'string' && re.test(v);

const matches = (shape: Shape, answers: Record<string, unknown>) => {
  const keys = Object.keys(shape);
  return (
    Object.keys(answers).length === keys.length && keys.every((k) => k in answers && shape[k]!(answers[k]))
  );
};

const triple = '-?\\d{1,4},-?\\d{1,4},-?\\d{1,4}';

const SHAPES: Record<string, (version: string) => Shape> = {
  'exp-01': (v) => ({
    anchor: oneOf(ANCHOR[v]),
    higherLower: oneOf('higher', 'lower'),
    estimate: wholeNumber(0, 100),
  }),
  'exp-02': () => Object.fromEntries(PAIRS.map((p) => [p.id, oneOf(...p.options.map((o) => o.id))])),
  'exp-03': () =>
    Object.fromEntries(QUESTIONS.flatMap((q) => [[`${q.id}_lo`, rangeNumber], [`${q.id}_hi`, rangeNumber]])),
  'exp-04': () => ({ choice: oneOf('sure', 'gamble') }),
  'exp-05': (v) => ({ choice: oneOf(...MENU[versionOf(v)]) }),
  'exp-06': () => ({ choice: oneOf('city', 'cabin') }),
  'exp-07': () => ({
    tests: pattern(new RegExp(`^${triple}(\\|${triple}){0,${MAX_TESTS - 1}}$`)),
    rule: oneOf(...RULES.map((r) => r.id)),
  }),
  'exp-08': () => ({
    colour: oneOf(...COLOURS),
    speed: wholeNumber(0, 999),
    light: oneOf('yes', 'no'),
    glass: oneOf('yes', 'no'),
  }),
  'exp-09': () => ({ picks: pattern(new RegExp(`^[ABC]{${ROUNDS.length}}$`)) }),
  'exp-10': () => Object.fromEntries(ORDER.map(([h, a]) => [keyOf(h, a), oneOf('soon', 'late')])),
  'exp-11': () => ({
    ...Object.fromEntries(FLIPS.map((r) => [r.id, oneOf('H', 'T')])),
    belief: oneOf(...BELIEFS.map((b) => b.id)),
  }),
  'exp-12': () => Object.fromEntries(WINS.map((w) => [betKey(w), oneOf('accept', 'reject')])),
};

/** Extra rules that span more than one answer. */
const CROSS: Record<string, (answers: Record<string, unknown>) => boolean> = {
  // The Task won't accept a low number above the high one.
  'exp-03': (a) => QUESTIONS.every((q) => (a[`${q.id}_lo`] as number) <= (a[`${q.id}_hi`] as number)),
};

/** True if `answers` is exactly what the experiment's Task would submit for `version`. */
export function validAnswers(experimentId: string, version: string, answers: Record<string, unknown>): boolean {
  const shape = SHAPES[experimentId];
  if (!shape || !matches(shape(version), answers)) return false;
  return CROSS[experimentId]?.(answers) ?? true;
}
