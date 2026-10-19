import { describe, expect, it } from 'vitest';
import type { Answers } from '../../types';
import { PAIRS, moreCommon, newsPicks, score, wasPulled, whatHappened } from './logic';

const allNews: Answers = Object.fromEntries(PAIRS.map((p) => [p.id, p.news]));
const allRight: Answers = Object.fromEntries(PAIRS.map((p) => [p.id, moreCommon(p).id]));

describe('pairs', () => {
  it('has one control, where the newsworthy cause is the more common one', () => {
    const controls = PAIRS.filter((p) => p.control);
    expect(controls).toHaveLength(1);
    expect(moreCommon(controls[0]!).id).toBe(controls[0]!.news);
  });

  it('makes the newsworthy cause the rarer one in every other pair', () => {
    for (const p of PAIRS.filter((x) => !x.control)) {
      expect(moreCommon(p).id).not.toBe(p.news);
      expect(p.fact).toBeTruthy();
    }
  });
});

describe('result logic', () => {
  it('scores and counts newsworthy picks', () => {
    expect(score(allRight)).toBe(5);
    expect(score(allNews)).toBe(1); // only the control pair
    expect(newsPicks(allNews)).toHaveLength(4);
    expect(wasPulled(allNews)).toBe(true);
    expect(wasPulled(allRight)).toBe(false);
  });

  it('describes the user’s own answers and never names the bias (P3-1, P3-4)', () => {
    const pulled = whatHappened(null, allNews);
    expect(pulled).toContain('In 4 of the 4 pairs');
    expect(pulled).toContain('70 times');

    const resisted = whatHappened(null, allRight);
    expect(resisted).toContain('resisted');
    expect(resisted).toContain('which was right');

    for (const text of [pulled, resisted]) expect(text.toLowerCase()).not.toContain('availab');
  });
});
