import { describe, expect, it } from 'vitest';
import type { Answers } from './types';
import { LIVE_MIN, isLive, mean, median, share, summarise, type Play } from './summaries';
import { QUESTIONS } from './experiments/range-quiz/logic';
import { ROUNDS } from './experiments/line-judge/logic';
import { LATER, keyOf } from './experiments/now-later/logic';
import { ROUNDS as FLIPS, streakOf } from './experiments/next-flip/logic';
import { WINS, keyOf as betKey } from './experiments/coin-bets/logic';
import { QUESTIONS as RECALLS } from './experiments/before-after/logic';

const plays = (condition: string | null, ...answers: Answers[]): Play[] => answers.map((a) => ({ condition, answers: a }));

describe('helpers', () => {
  it('rounds shares and means to one decimal place', () => {
    expect(share([1, 2, 3], (x) => x > 1)).toBe(66.7);
    expect(mean([1, 2, 2])).toBe(1.7);
  });
  it('takes the middle value, or the average of the middle two', () => {
    expect(median([5, 1, 3])).toBe(3);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
  it('returns null for no data', () => {
    expect(share([], () => true)).toBeNull();
    expect(mean([])).toBeNull();
    expect(median([])).toBeNull();
  });
});

describe('summarise', () => {
  it('returns null for an unknown experiment', () => {
    expect(summarise('exp-99', [])).toBeNull();
  });

  it('reports every version, even with no plays', () => {
    expect(summarise('exp-04', [])).toEqual({
      gain: { n: 0, values: { sureShare: null } },
      loss: { n: 0, values: { sureShare: null } },
    });
  });

  it('ignores plays from versions the experiment does not have', () => {
    const s = summarise('exp-04', [...plays('gain', { choice: 'sure' }), ...plays('bogus', { choice: 'sure' })])!;
    expect(Object.keys(s)).toEqual(['gain', 'loss']);
    expect(s.gain!.n).toBe(1);
  });

  it('exp-01: median guess per wheel number', () => {
    const s = summarise('exp-01', [
      ...plays('low', { estimate: 20 }, { estimate: 30 }),
      ...plays('high', { estimate: 40 }, { estimate: 50 }, { estimate: 60 }),
    ])!;
    expect(s.low).toEqual({ n: 2, values: { medianGuess: 25 } });
    expect(s.high).toEqual({ n: 3, values: { medianGuess: 50 } });
  });

  it('exp-02: share choosing the newsworthy cause, per pair', () => {
    const s = summarise('exp-02', plays(null, { p1: 'shark', p4: 'car' }, { p1: 'stings', p4: 'car' }))!;
    expect(s.all!.n).toBe(2);
    expect(s.all!.values).toMatchObject({ p1: 50, p2: 0, p4: 100 });
  });

  it('exp-03: average number of ranges that caught the answer', () => {
    const allIn: Answers = {};
    for (const q of QUESTIONS) Object.assign(allIn, { [`${q.id}_lo`]: q.answer, [`${q.id}_hi`]: q.answer });
    expect(summarise('exp-03', plays(null, allIn, {}))!.all!.values).toEqual({ meanHits: 5 });
  });

  it('exp-04: share choosing the sure plan, per wording', () => {
    const s = summarise('exp-04', [
      ...plays('gain', { choice: 'sure' }, { choice: 'sure' }, { choice: 'gamble' }, { choice: 'sure' }),
      ...plays('loss', { choice: 'gamble' }),
    ])!;
    expect(s.gain!.values.sureShare).toBe(75);
    expect(s.loss!.values.sureShare).toBe(0);
  });

  it('exp-05: share choosing the plan the third plan was worse than', () => {
    const s = summarise('exp-05', [
      ...plays('premium', { choice: 'large' }, { choice: 'small' }),
      ...plays('budget', { choice: 'small' }),
    ])!;
    expect(s.premium!.values.targetShare).toBe(50);
    expect(s.budget!.values.targetShare).toBe(100);
  });

  it('exp-06: share choosing the pricier trip', () => {
    expect(summarise('exp-06', plays(null, { choice: 'city' }, { choice: 'cabin' }))!.all!.values).toEqual({ cityShare: 50 });
  });

  it('exp-07: share who found the rule', () => {
    const s = summarise('exp-07', plays(null, { rule: 'up', tests: '' }, { rule: 'plus2', tests: '' }, { rule: 'up', tests: '' }));
    expect(s!.all!.values).toEqual({ foundShare: 66.7 });
  });

  it('exp-08: share reporting glass and median speed, per verb', () => {
    const s = summarise('exp-08', [
      ...plays('smashed', { glass: 'yes', speed: 40 }, { glass: 'no', speed: 50 }),
      ...plays('hit', { glass: 'no', speed: 30 }),
    ])!;
    expect(s.smashed!.values).toEqual({ glassShare: 50, medianSpeed: 45 });
    expect(s.hit!.values).toEqual({ glassShare: 0, medianSpeed: 30 });
  });

  it('exp-09: rounds going with the group, and share going along at least once', () => {
    const withGroup = ROUNDS.map((r) => r.group).join('');
    const neverOnce = ROUNDS.map((r) => 'ABC'[r.opts.indexOf(r.ref)]).join('');
    const s = summarise('exp-09', plays(null, { picks: withGroup }, { picks: neverOnce }))!;
    const critical = ROUNDS.filter((r) => r.critical).length;
    expect(s.all!.values).toEqual({ meanWithGroup: critical / 2, anyShare: 50 });
  });

  it('exp-10: share with at least one flip toward the present', () => {
    const flip: Answers = { [keyOf('near', LATER[0]!)]: 'soon', [keyOf('far', LATER[0]!)]: 'late' };
    const steady: Answers = {};
    expect(summarise('exp-10', plays(null, flip, steady, steady, steady))!.all!.values).toEqual({ flipShare: 25 });
  });

  it('exp-11: share of streak bets against the streak, and share saying equally likely', () => {
    const against: Answers = { belief: 'equal' };
    for (const r of FLIPS) against[r.id] = streakOf(r) === 'H' ? 'T' : 'H';
    const allHeads: Answers = { belief: 'tails', ...Object.fromEntries(FLIPS.map((r) => [r.id, 'H'])) };
    // allHeads bets against the one tails streak only: 5 of 8 streak bets are against.
    expect(summarise('exp-11', plays(null, against, allHeads))!.all!.values).toEqual({ againstShare: 62.5, equalShare: 50 });
  });

  it('exp-12: share accepting each bet', () => {
    const bold = Object.fromEntries(WINS.map((w) => [betKey(w), 'accept']));
    const wary = Object.fromEntries(WINS.map((w) => [betKey(w), w >= 20 ? 'accept' : 'reject']));
    expect(summarise('exp-12', plays(null, bold, wary))!.all!.values).toEqual({ w10: 50, w12: 50, w15: 50, w20: 100, w25: 100, w30: 100 });
  });

  it('exp-13: share whose memories drifted toward the answers, and average questions that did', () => {
    const drifted: Answers = {};
    const exact: Answers = {};
    for (const q of RECALLS) {
      Object.assign(drifted, { [`${q.id}_first`]: q.answer * 2, [`${q.id}_recall`]: q.answer * 1.5 });
      Object.assign(exact, { [`${q.id}_first`]: q.answer * 2, [`${q.id}_recall`]: q.answer * 2 });
    }
    expect(summarise('exp-13', plays(null, drifted, exact))!.all!.values).toEqual({ towardShare: 50, meanToward: 3 });
  });

  it('exp-14: share saving and share leaving the pension as set, per version', () => {
    const s = summarise('exp-14', [
      ...plays('out', { pension: '0', newsletter: 'no', birthday: 'no' }, { pension: '3', newsletter: 'no', birthday: 'no' }),
      ...plays('in', { pension: '5', newsletter: 'yes', birthday: 'yes' }),
    ])!;
    expect(s.out!.values).toEqual({ joinedShare: 50, keptShare: 50 });
    expect(s.in!.values).toEqual({ joinedShare: 100, keptShare: 100 });
  });

  it('exp-15: median price per version', () => {
    const s = summarise('exp-15', [...plays('owner', { price: 5 }, { price: 9 }), ...plays('buyer', { price: 2.5 })])!;
    expect(s.owner!.values).toEqual({ medianPrice: 7 });
    expect(s.buyer!.values).toEqual({ medianPrice: 2.5 });
  });

  it('exp-16: average note rating and share saying no influence, per version', () => {
    const s = summarise('exp-16', [
      ...plays('warm', { clarity: 6, organised: 5, smart: 6, influence: 'none' }, { clarity: 7, organised: 7, smart: 5, influence: 'little' }),
      ...plays('cold', { clarity: 4, organised: 4, smart: 3, influence: 'none' }),
    ])!;
    expect(s.warm!.values).toEqual({ meanWriting: 6.3, noneShare: 50 });
    expect(s.cold!.values).toEqual({ meanWriting: 4, noneShare: 100 });
  });
});

describe('isLive', () => {
  it('needs every version to reach the minimum', () => {
    const many = (c: string, n: number) => plays(c, ...Array.from({ length: n }, () => ({ choice: 'sure' })));
    expect(isLive(summarise('exp-04', [...many('gain', LIVE_MIN), ...many('loss', LIVE_MIN - 1)])!)).toBe(false);
    expect(isLive(summarise('exp-04', [...many('gain', LIVE_MIN), ...many('loss', LIVE_MIN)])!)).toBe(true);
  });
});
