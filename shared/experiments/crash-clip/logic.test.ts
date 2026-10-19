import { describe, expect, it } from 'vitest';
import { parseSpeed, wasPulled, whatHappened } from './logic';

describe('parseSpeed', () => {
  it('accepts whole numbers up to three digits', () => {
    expect(parseSpeed(' 30 ')).toBe(30);
    for (const bad of ['', '-5', '3.5', 'fast', '1000']) expect(parseSpeed(bad)).toBeNull();
  });
});

describe('result logic', () => {
  it('treats remembering broken glass as the effect', () => {
    expect(wasPulled({ glass: 'yes' })).toBe(true);
    expect(wasPulled({ glass: 'no' })).toBe(false);
  });

  it('describes the user’s own answers and never names the bias (P3-1, P3-4)', () => {
    expect(whatHappened('smashed', { glass: 'yes', speed: 45 })).toContain('added a detail to your memory');
    expect(whatHappened('smashed', { glass: 'no', speed: 30 })).toContain('resisted');
    expect(whatHappened('hit', { glass: 'yes', speed: 30 })).toContain('the milder word');
    expect(whatHappened('hit', { glass: 'no', speed: 25 })).toContain('more than doubled');
    for (const cond of ['smashed', 'hit']) {
      for (const glass of ['yes', 'no']) {
        const text = whatHappened(cond, { glass, speed: 33 });
        expect(text).toContain('33 mph');
        expect(text.toLowerCase()).not.toContain('misinformation');
      }
    }
  });
});
