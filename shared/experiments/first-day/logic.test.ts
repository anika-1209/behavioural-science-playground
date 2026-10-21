import { describe, expect, it } from 'vitest';
import { DEFAULTS, joined, kept, wasPulled, whatHappened } from './logic';

describe('result logic', () => {
  it('reads keeping the pension as set as the effect, in both versions', () => {
    expect(wasPulled('in', { ...DEFAULTS.in })).toBe(true);
    expect(wasPulled('out', { ...DEFAULTS.out })).toBe(true);
    expect(wasPulled('in', { ...DEFAULTS.in, pension: '0' })).toBe(false);
    expect(wasPulled('out', { ...DEFAULTS.out, pension: '3' })).toBe(false);
  });

  it('counts the choices left as they were', () => {
    expect(kept('in', { ...DEFAULTS.in })).toBe(3);
    expect(kept('out', { pension: '5', newsletter: 'yes', birthday: 'no' })).toBe(1);
    expect(joined({ pension: '8' })).toBe(true);
  });

  it('describes the user’s own form and never names the bias (P3-1, P3-4)', () => {
    const keptIn = whatHappened('in', { ...DEFAULTS.in });
    expect(keptIn).toContain('you kept 5% of your pay');
    expect(keptIn).toContain('Other players got the same form with every choice set to "no"');
    const changed = whatHappened('out', { pension: '5', newsletter: 'no', birthday: 'no' });
    expect(changed).toContain('changed the pension to 5% of your pay');
    expect(changed).toContain('resisted');
    for (const text of [keptIn, changed]) expect(text.toLowerCase()).not.toContain('default');
  });
});
