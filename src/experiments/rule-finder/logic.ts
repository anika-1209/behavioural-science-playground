import type { Answers } from '../../lib/progress';

// experimentConfig + resultLogic for exp-07 (Wason's 2-4-6 task).
// Answers: `tests` is "a,b,c|a,b,c|…" in the order run, `rule` is the chosen rule id.
// Players pick from a list rather than writing the rule, so the right answer is
// visible as an option; scores will likely be higher than in Wason (1960).

export type Triple = [number, number, number];

export const MAX_TESTS = 12;
export const SEED: Triple = [2, 4, 6];

export const fitsRule = (t: Triple) => t[0] < t[1] && t[1] < t[2];

export interface RuleOption {
  id: string;
  text: string;
  test: (t: Triple) => boolean;
}

export const RULES: RuleOption[] = [
  { id: 'plus2', text: 'Each number is 2 more than the one before', test: (t) => t[1] - t[0] === 2 && t[2] - t[1] === 2 },
  {
    id: 'even2',
    text: 'Even numbers going up by 2',
    test: (t) => t.every((n) => n % 2 === 0) && t[1] - t[0] === 2 && t[2] - t[1] === 2,
  },
  { id: 'sum', text: 'The third number is the first two added together', test: (t) => t[0] + t[1] === t[2] },
  { id: 'mean', text: 'The middle number is halfway between the other two', test: (t) => t[1] * 2 === t[0] + t[2] },
  { id: 'up', text: 'Any three numbers that go up', test: fitsRule },
];
export const CORRECT = 'up';

/** Triples that follow the real rule but break each wrong option. */
export const COUNTER: Record<string, Triple> = { plus2: [1, 2, 3], even2: [1, 3, 5], sum: [3, 7, 20], mean: [1, 2, 10] };

export function parseWhole(raw: string): number | null {
  const s = raw.trim();
  return /^-?\d{1,4}$/.test(s) ? Number(s) : null;
}

export const encodeTests = (tests: Triple[]) => tests.map((t) => t.join(',')).join('|');

export function testsOf(answers: Answers): Triple[] {
  const raw = String(answers.tests ?? '');
  if (!raw) return [];
  return raw.split('|').map((part) => part.split(',').map(Number) as Triple);
}

export const ruleOf = (answers: Answers) => RULES.find((r) => r.id === answers.rule) ?? RULES[0]!;
export const formatTriple = (t: Triple) => t.join(', ');

export const noCount = (tests: Triple[]) => tests.filter((t) => !fitsRule(t)).length;

/** Choosing a rule other than the real one counts as showing the effect. */
export const wasPulled = (answers: Answers) => ruleOf(answers).id !== CORRECT;

export function whatHappened(_condition: string | null, answers: Answers): string {
  const tests = testsOf(answers);
  const rule = ruleOf(answers);
  const n = tests.length;
  const no = noCount(tests);
  const yes = n - no;
  const sets = n === 1 ? '1 set' : `${n} sets`;

  if (rule.id === CORRECT) {
    const tried =
      no === 0
        ? `Every one of your ${sets} followed the rule, but you still chose the broadest answer.`
        : `${no} of your ${sets} didn't follow the rule. Those are the tests that teach you something, because they can prove an idea wrong.`;
    return (
      `You found the rule: any three numbers that go up. ${tried} You resisted the pull this time. ` +
      "Most people don't: in Wason's original study, only about one in five found the rule at their first attempt."
    );
  }

  // A test where the chosen rule and the real rule disagree already held the answer.
  const telling = tests.find((t) => rule.test(t) !== fitsRule(t));
  let seen: string;
  if (telling) {
    seen = fitsRule(telling)
      ? `You tested ${sets} of numbers. One of them, ${formatTriple(telling)}, followed the rule even though it breaks the rule you chose, so the evidence against your idea was already there.`
      : `You tested ${sets} of numbers. One of them, ${formatTriple(telling)}, fits the rule you chose but didn't follow the real one, so the evidence against your idea was already there.`;
  } else if (no === 0) {
    seen = `You tested ${sets} of numbers and every one followed the rule, so you never saw a "doesn't follow". Each test could only confirm your idea, never break it.`;
  } else {
    seen = `You tested ${sets} of numbers. ${yes} followed the rule and ${no} didn't, but none of them could tell your idea apart from the real rule.`;
  }
  return (
    `${seen} You chose "${rule.text.toLowerCase()}", but the real rule was broader: any three numbers that go up. ` +
    `A test like ${formatTriple(COUNTER[rule.id]!)} follows the rule while breaking your idea. ` +
    "In Wason's original study, most people made the same kind of mistake."
  );
}
