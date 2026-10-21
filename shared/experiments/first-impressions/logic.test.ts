import { describe, expect, it } from 'vitest';
import { TRAITS, influenceOf, whatHappened, writingScore } from './logic';

describe('versions', () => {
  it('differ only in the description of Sam', () => {
    expect(TRAITS.warm).not.toBe(TRAITS.cold);
  });
});

describe('result logic', () => {
  it('scores the note as the average of its two ratings', () => {
    expect(writingScore({ clarity: 5, organised: 6 })).toBe(5.5);
    expect(influenceOf({ influence: 'lot' })).toBe('lot');
  });

  it('describes the user’s own ratings and version, and never names the bias (P3-1, P3-4)', () => {
    const warm = whatHappened('warm', { clarity: 6, organised: 5, smart: 6, influence: 'none' });
    expect(warm).toContain('warm, friendly and patient, and you rated');
    expect(warm).toContain('5.5 out of 7');
    expect(warm).toContain('affected your rating not at all');
    const cold = whatHappened('cold', { clarity: 3, organised: 3, smart: 3, influence: 'little' });
    expect(cold).toContain('were told Sam was warm');
    for (const text of [warm, cold]) expect(text.toLowerCase()).not.toContain('halo');
  });
});
