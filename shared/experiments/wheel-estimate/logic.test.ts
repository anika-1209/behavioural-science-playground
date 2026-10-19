import { describe, expect, it } from 'vitest';
import { parseEstimate, wasPulled, whatHappened } from './logic';

describe('parseEstimate', () => {
  it('accepts whole numbers from 0 to 100', () => {
    expect(parseEstimate('0')).toBe(0);
    expect(parseEstimate(' 28 ')).toBe(28);
    expect(parseEstimate('100')).toBe(100);
  });
  it('rejects everything else', () => {
    for (const bad of ['', '101', '-1', '2.5', 'abc', '1e2']) expect(parseEstimate(bad)).toBeNull();
  });
});

describe('result logic', () => {
  it('reads the pull relative to the midpoint between study medians', () => {
    expect(wasPulled('high', 50)).toBe(true);
    expect(wasPulled('high', 25)).toBe(false);
    expect(wasPulled('low', 20)).toBe(true);
    expect(wasPulled('low', 60)).toBe(false);
  });

  it('describes the user’s own answer and never names the bias (P3-1, P3-4)', () => {
    for (const cond of ['low', 'high']) {
      for (const estimate of [5, 30, 70]) {
        const text = whatHappened(cond, { estimate });
        expect(text).toContain(`${estimate}%`);
        expect(text.toLowerCase()).not.toContain('anchor');
      }
    }
    expect(whatHappened('high', { estimate: 25 })).toContain('resisted');
  });
});
