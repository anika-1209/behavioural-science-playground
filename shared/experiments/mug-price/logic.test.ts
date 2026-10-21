import { describe, expect, it } from 'vitest';
import { money, parsePrice, whatHappened } from './logic';

describe('prices', () => {
  it('accepts pounds and pence, with or without £', () => {
    expect(parsePrice('4')).toBe(4);
    expect(parsePrice('£4.50')).toBe(4.5);
    expect(parsePrice('101')).toBeNull();
    expect(parsePrice('4.555')).toBeNull();
    expect(parsePrice('-1')).toBeNull();
    expect(money(4.5)).toBe('£4.50');
  });
});

describe('result logic', () => {
  it('describes the user’s own answer and version, and never names the bias (P3-1, P3-4)', () => {
    const owner = whatHappened('owner', { price: 8 });
    expect(owner).toContain("wouldn't sell it for less than £8");
    expect(owner).toContain('Other players imagined buying');
    const buyer = whatHappened('buyer', { price: 2.5 });
    expect(buyer).toContain('pay at most £2.50');
    for (const text of [owner, buyer]) {
      expect(text).toContain("One answer can't show the effect on its own");
      expect(text.toLowerCase()).not.toContain('endowment');
    }
  });
});
