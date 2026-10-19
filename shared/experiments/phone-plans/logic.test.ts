import { describe, expect, it } from 'vitest';
import { MENU, PLANS, TARGET, THIRD, wasPulled, whatHappened, type Version } from './logic';

const VERSIONS: Version[] = ['premium', 'budget'];

describe('plans', () => {
  it.each(VERSIONS)('%s: the third plan is worse than the target in every way, but not worse than the other main plan', (v) => {
    const third = PLANS[THIRD[v]];
    const target = PLANS[TARGET[v]];
    expect(third.price).toBeGreaterThan(target.price);
    expect(third.gb).toBeLessThan(target.gb);
    const other = PLANS[MENU[v].find((id) => id !== TARGET[v] && id !== THIRD[v])!];
    expect(third.price > other.price && third.gb < other.gb).toBe(false);
  });

  it.each(VERSIONS)('%s menu is sorted by price', (v) => {
    const prices = MENU[v].map((id) => PLANS[id].price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});

describe('result logic', () => {
  it('reads choosing the target as the effect', () => {
    expect(wasPulled('premium', { choice: 'large' })).toBe(true);
    expect(wasPulled('premium', { choice: 'small' })).toBe(false);
    expect(wasPulled('budget', { choice: 'small' })).toBe(true);
  });

  it('describes the user’s own choice and never names the bias (P3-1, P3-4)', () => {
    expect(whatHappened('premium', { choice: 'large' })).toContain('you chose it');
    expect(whatHappened('budget', { choice: 'large' })).toContain('resisted');
    expect(whatHappened('premium', { choice: 'large-third' })).toContain('rarely chosen');
    for (const v of VERSIONS) {
      for (const choice of MENU[v]) expect(whatHappened(v, { choice }).toLowerCase()).not.toContain('decoy');
    }
  });
});
