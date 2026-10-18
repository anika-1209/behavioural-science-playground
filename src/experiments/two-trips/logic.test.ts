import { describe, expect, it } from 'vitest';
import { wasPulled, whatHappened } from './logic';

describe('result logic', () => {
  it('reads choosing the pricier, less enjoyable trip as the effect', () => {
    expect(wasPulled({ choice: 'city' })).toBe(true);
    expect(wasPulled({ choice: 'cabin' })).toBe(false);
  });

  it('describes the user’s own choice and never names the bias (P3-1, P3-4)', () => {
    expect(whatHappened(null, { choice: 'city' })).toContain('You chose Edinburgh');
    expect(whatHappened(null, { choice: 'cabin' })).toContain('resisted');
    for (const choice of ['city', 'cabin']) {
      expect(whatHappened(null, { choice }).toLowerCase()).not.toContain('sunk');
    }
  });
});
