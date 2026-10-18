import { describe, expect, it } from 'vitest';
import type { Answers } from '../../lib/progress';
import { QUESTIONS, hits, parseNumber, wasPulled, whatHappened } from './logic';

/** Ranges that catch the answer for the first `n` questions and miss the rest. */
function answersWithHits(n: number): Answers {
  const a: Answers = {};
  QUESTIONS.forEach((q, i) => {
    const [lo, hi] = i < n ? [q.answer - 1, q.answer + 1] : [q.answer + 10, q.answer + 20];
    a[`${q.id}_lo`] = lo;
    a[`${q.id}_hi`] = hi;
  });
  return a;
}

describe('parseNumber', () => {
  it('accepts plain, comma and space-separated numbers', () => {
    expect(parseNumber('8849')).toBe(8849);
    expect(parseNumber(' 384,400 ')).toBe(384400);
    expect(parseNumber('12 756')).toBe(12756);
    expect(parseNumber('343.5')).toBe(343.5);
  });
  it('rejects everything else', () => {
    for (const bad of ['', '-5', 'abc', '1e3', '12.']) expect(parseNumber(bad)).toBeNull();
  });
});

describe('result logic', () => {
  it('counts ranges that contain the answer, inclusive at both ends', () => {
    expect(hits(answersWithHits(10))).toBe(10);
    expect(hits(answersWithHits(4))).toBe(4);
    const q = QUESTIONS[0]!;
    expect(hits({ ...answersWithHits(0), [`${q.id}_lo`]: q.answer, [`${q.id}_hi`]: q.answer })).toBe(1);
  });

  it('treats 7 or fewer hits as showing the effect', () => {
    expect(wasPulled(answersWithHits(7))).toBe(true);
    expect(wasPulled(answersWithHits(8))).toBe(false);
  });

  it('describes the user’s own result and never names the bias (P3-1, P3-4)', () => {
    const pulled = whatHappened(null, answersWithHits(4));
    expect(pulled).toContain('4 did');
    expect(pulled).toContain(QUESTIONS[4]!.about); // first miss is quoted
    expect(whatHappened(null, answersWithHits(8))).toContain('close to the 9');
    expect(whatHappened(null, answersWithHits(10))).toContain('resisted');
    for (const n of [0, 4, 8, 10]) expect(whatHappened(null, answersWithHits(n)).toLowerCase()).not.toContain('overconfiden');
  });
});
