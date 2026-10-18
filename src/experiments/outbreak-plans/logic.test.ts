import { describe, expect, it } from 'vitest';
import { PLAN_TEXT, studyShare, wasPulled, whatHappened } from './logic';

describe('plans', () => {
  it('describes the same outcomes in both wordings', () => {
    expect(PLAN_TEXT.gain.sure).toContain('200 people will be saved');
    expect(PLAN_TEXT.loss.sure).toContain('400 people will die');
    for (const f of ['gain', 'loss'] as const) expect(PLAN_TEXT[f].gamble).toContain('one-in-three');
  });
});

describe('result logic', () => {
  it('uses the original study shares', () => {
    expect(studyShare('gain', 'sure')).toBe(72);
    expect(studyShare('loss', 'gamble')).toBe(78);
  });

  it('reads the majority choice for each wording as the effect', () => {
    expect(wasPulled('gain', { choice: 'sure' })).toBe(true);
    expect(wasPulled('gain', { choice: 'gamble' })).toBe(false);
    expect(wasPulled('loss', { choice: 'gamble' })).toBe(true);
    expect(wasPulled('loss', { choice: 'sure' })).toBe(false);
  });

  it('describes the user’s own choice and never names the bias (P3-1, P3-4)', () => {
    expect(whatHappened('gain', { choice: 'sure' })).toContain('only 22%');
    expect(whatHappened('loss', { choice: 'gamble' })).toContain('only 28%');
    const resisted = whatHappened('gain', { choice: 'gamble' });
    expect(resisted).toContain('resisted');
    expect(resisted).toContain('78% chose Plan B');
    for (const cond of ['gain', 'loss']) {
      for (const choice of ['sure', 'gamble']) {
        expect(whatHappened(cond, { choice }).toLowerCase()).not.toContain('fram');
      }
    }
  });
});
