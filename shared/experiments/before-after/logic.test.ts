import { describe, expect, it } from 'vitest';
import type { Answers } from '../../types';
import { QUESTIONS, count, driftOf, parseNumber, wasPulled, whatHappened } from './logic';

/** First answers off by `off`; recalled answers from `recall(first, real)`. */
function play(recall: (first: number, real: number) => number, off = 100): Answers {
  const out: Answers = {};
  for (const q of QUESTIONS) {
    out[`${q.id}_first`] = q.answer + off;
    out[`${q.id}_recall`] = recall(q.answer + off, q.answer);
  }
  return out;
}

describe('questions', () => {
  it('has six with unique ids', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(6);
  });

  it('parses numbers with commas or spaces', () => {
    expect(parseNumber('1,345')).toBe(1345);
    expect(parseNumber('1 345')).toBe(1345);
    expect(parseNumber('-3')).toBeNull();
  });
});

describe('result logic', () => {
  it('reads recalled answers that move toward the real one as the effect', () => {
    const toward = play((f, r) => (f + r) / 2);
    expect(driftOf(QUESTIONS[0]!, toward)).toBe('toward');
    expect(count(toward, 'toward')).toBe(6);
    expect(wasPulled(toward)).toBe(true);
    expect(wasPulled(play((f) => f))).toBe(false);
    expect(wasPulled(play((f) => f + 50))).toBe(false);
  });

  it('describes the user’s own answers and never names the bias (P3-1, P3-4)', () => {
    const toward = whatHappened(null, play((f, r) => (f + r) / 2));
    expect(toward).toContain('you first said 446 for the length of the River Thames, but remembered saying 396');
    const exact = whatHappened(null, play((f) => f));
    expect(exact).toContain('every one of your first answers exactly');
    const mixed = whatHappened(null, play((f) => f + 50));
    expect(mixed).toContain('resisted');
    for (const text of [toward, exact, mixed]) expect(text.toLowerCase()).not.toContain('hindsight');
  });
});
