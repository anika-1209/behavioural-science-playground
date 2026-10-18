import { describe, expect, it } from 'vitest';
import { COUNTER, RULES, SEED, encodeTests, fitsRule, parseWhole, testsOf, wasPulled, whatHappened, type Triple } from './logic';

const answers = (tests: Triple[], rule: string) => ({ tests: encodeTests(tests), rule });

describe('rules', () => {
  it('every option fits 2, 4, 6', () => {
    for (const r of RULES) expect(r.test(SEED)).toBe(true);
  });

  it('each counter-example follows the real rule but breaks its wrong option', () => {
    for (const r of RULES.filter((x) => x.id !== 'up')) {
      const c = COUNTER[r.id]!;
      expect(fitsRule(c)).toBe(true);
      expect(r.test(c)).toBe(false);
    }
  });
});

describe('answers', () => {
  it('round-trips tests, including negatives', () => {
    const tests: Triple[] = [[1, 2, 3], [-5, 0, 5]];
    expect(testsOf({ tests: encodeTests(tests) })).toEqual(tests);
    expect(testsOf({})).toEqual([]);
  });

  it('parses whole numbers only', () => {
    expect(parseWhole(' -12 ')).toBe(-12);
    for (const bad of ['', '1.5', 'abc', '12345']) expect(parseWhole(bad)).toBeNull();
  });
});

describe('result logic', () => {
  it('treats any rule but the real one as the effect', () => {
    expect(wasPulled(answers([[8, 10, 12]], 'plus2'))).toBe(true);
    expect(wasPulled(answers([[1, 5, 9]], 'up'))).toBe(false);
  });

  it('describes the user’s own tests and never names the bias (P3-1, P3-4)', () => {
    expect(whatHappened(null, answers([[8, 10, 12], [20, 22, 24]], 'plus2'))).toContain('never saw a "doesn\'t follow"');
    expect(whatHappened(null, answers([[1, 2, 3]], 'plus2'))).toContain('One of them, 1, 2, 3');
    expect(whatHappened(null, answers([[3, 2, 1]], 'up'))).toContain('resisted');
    for (const r of RULES) {
      expect(whatHappened(null, answers([[2, 4, 6]], r.id)).toLowerCase()).not.toContain('confirmation');
    }
  });
});
