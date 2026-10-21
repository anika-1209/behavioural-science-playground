import { describe, expect, it } from 'vitest';
import type { Answers } from './types';
import { CONTENT_VERSION, parseAnswerRequest, parseEventRequest } from './api';
import { SUMMARIES } from './summaries';
import { QUESTIONS } from './experiments/range-quiz/logic';
import { PAIRS } from './experiments/risk-pairs/logic';
import { ROUNDS } from './experiments/line-judge/logic';
import { ORDER, keyOf } from './experiments/now-later/logic';
import { ROUNDS as FLIPS } from './experiments/next-flip/logic';
import { WINS, keyOf as betKey } from './experiments/coin-bets/logic';
import { QUESTIONS as RECALLS } from './experiments/before-after/logic';

const recalls: Answers = {};
for (const q of RECALLS) Object.assign(recalls, { [`${q.id}_first`]: 500, [`${q.id}_recall`]: 450.5 });

const ranges: Answers = {};
for (const q of QUESTIONS) Object.assign(ranges, { [`${q.id}_lo`]: 1, [`${q.id}_hi`]: 1e6 });
const now: Answers = Object.fromEntries(ORDER.map(([h, a]) => [keyOf(h, a), 'late']));

/** One answer per experiment and version, exactly as each Task submits it. */
const VALID: [string, string, Answers][] = [
  ['exp-01', 'low', { anchor: 10, higherLower: 'higher', estimate: 25 }],
  ['exp-01', 'high', { anchor: 65, higherLower: 'lower', estimate: 45 }],
  ['exp-02', 'all', Object.fromEntries(PAIRS.map((p) => [p.id, p.news]))],
  ['exp-03', 'all', ranges],
  ['exp-04', 'gain', { choice: 'sure' }],
  ['exp-04', 'loss', { choice: 'gamble' }],
  ['exp-05', 'premium', { choice: 'large-third' }],
  ['exp-05', 'budget', { choice: 'small-third' }],
  ['exp-06', 'all', { choice: 'cabin' }],
  ['exp-07', 'all', { tests: '8,10,12|1,2,3|-5,0,9999', rule: 'up' }],
  ['exp-08', 'smashed', { colour: 'red', speed: 40, light: 'no', glass: 'yes' }],
  ['exp-08', 'hit', { colour: 'blue', speed: 0, light: 'yes', glass: 'no' }],
  ['exp-09', 'all', { picks: ROUNDS.map((r) => r.group).join('') }],
  ['exp-10', 'all', now],
  ['exp-11', 'all', { ...Object.fromEntries(FLIPS.map((r) => [r.id, 'T'])), belief: 'equal' }],
  ['exp-12', 'all', Object.fromEntries(WINS.map((w) => [betKey(w), w >= 20 ? 'accept' : 'reject']))],
  ['exp-13', 'all', recalls],
  ['exp-14', 'out', { pension: '0', newsletter: 'no', birthday: 'no' }],
  ['exp-14', 'in', { pension: '5', newsletter: 'yes', birthday: 'no' }],
  ['exp-15', 'owner', { price: 7.5 }],
  ['exp-15', 'buyer', { price: 3 }],
  ['exp-16', 'warm', { clarity: 6, organised: 5, smart: 6, influence: 'none' }],
  ['exp-16', 'cold', { clarity: 3, organised: 4, smart: 4, influence: 'little' }],
];

const req = (experimentId: string, version: string, answers: Answers, extra = {}) => ({
  experimentId,
  version,
  contentVersion: CONTENT_VERSION[experimentId],
  answers,
  ...extra,
});

describe('parseAnswerRequest', () => {
  it('covers every experiment and version', () => {
    const covered = new Set(VALID.map(([id, v]) => `${id}/${v}`));
    for (const [id, def] of Object.entries(SUMMARIES)) for (const v of def.versions) expect(covered).toContain(`${id}/${v}`);
  });

  it.each(VALID)('accepts a real %s answer (%s)', (id, v, answers) => {
    expect(parseAnswerRequest(req(id, v, answers))).toEqual(req(id, v, answers));
  });

  it.each(VALID)('rejects a %s answer (%s) with an extra or missing field', (id, v, answers) => {
    expect(parseAnswerRequest(req(id, v, { ...answers, name: 'x' }))).toBeNull();
    const [first] = Object.keys(answers);
    const { [first!]: _, ...missing } = answers;
    expect(parseAnswerRequest(req(id, v, missing))).toBeNull();
  });

  it('rejects unknown experiments, versions and content versions', () => {
    const a = { choice: 'sure' };
    expect(parseAnswerRequest(req('exp-99', 'gain', a))).toBeNull();
    expect(parseAnswerRequest(req('exp-04', 'all', a))).toBeNull();
    expect(parseAnswerRequest({ ...req('exp-04', 'gain', a), contentVersion: 0 })).toBeNull();
  });

  it('rejects extra top-level fields, such as anything identifying', () => {
    expect(parseAnswerRequest(req('exp-04', 'gain', { choice: 'sure' }, { deviceId: 'abc' }))).toBeNull();
  });

  it('rejects values the Task could not have submitted', () => {
    const bad: [string, string, Answers][] = [
      ['exp-01', 'low', { anchor: 65, higherLower: 'higher', estimate: 25 }], // other version's wheel
      ['exp-01', 'low', { anchor: 10, higherLower: 'higher', estimate: 101 }],
      ['exp-01', 'low', { anchor: 10, higherLower: 'higher', estimate: '25' }],
      ['exp-03', 'all', { ...ranges, q1_lo: 10, q1_hi: 5 }], // low above high
      ['exp-03', 'all', { ...ranges, q1_lo: -1 }],
      ['exp-05', 'premium', { choice: 'small-third' }], // not on this version's menu
      ['exp-07', 'all', { tests: '', rule: 'up' }],
      ['exp-07', 'all', { tests: Array(13).fill('1,2,3').join('|'), rule: 'up' }],
      ['exp-08', 'hit', { colour: 'pink', speed: 30, light: 'no', glass: 'no' }],
      ['exp-08', 'hit', { colour: 'red', speed: 30.5, light: 'no', glass: 'no' }],
      ['exp-09', 'all', { picks: 'ABC' }],
      ['exp-10', 'all', { ...now, [keyOf('near', 101)]: 'maybe' }],
      ['exp-11', 'all', { ...Object.fromEntries(FLIPS.map((r) => [r.id, 'T'])), belief: 'probably' }],
      ['exp-12', 'all', { ...Object.fromEntries(WINS.map((w) => [betKey(w), 'accept'])), w15: 'yes' }],
      ['exp-13', 'all', { ...recalls, q1_recall: -5 }],
      ['exp-14', 'in', { pension: '4', newsletter: 'yes', birthday: 'no' }],
      ['exp-15', 'owner', { price: 101 }],
      ['exp-15', 'owner', { price: 4.555 }],
      ['exp-16', 'warm', { clarity: 8, organised: 5, smart: 6, influence: 'none' }],
    ];
    for (const [id, v, a] of bad) expect(parseAnswerRequest(req(id, v, a)), `${id} ${JSON.stringify(a)}`).toBeNull();
  });

  it('rejects things that are not objects', () => {
    for (const body of [null, undefined, 'x', 1, [], { answers: [] }]) expect(parseAnswerRequest(body)).toBeNull();
  });
});

describe('parseEventRequest', () => {
  it('accepts each event type with only its own fields', () => {
    expect(parseEventRequest({ experimentId: 'exp-01', type: 'started' })).toEqual({ experimentId: 'exp-01', type: 'started' });
    expect(parseEventRequest({ experimentId: 'exp-01', type: 'debrief-read' })).not.toBeNull();
    expect(parseEventRequest({ experimentId: 'exp-01', type: 'debrief-opened' })).not.toBeNull();
    expect(parseEventRequest({ experimentId: 'exp-01', type: 'finished', finishedInVisit: 2 })).not.toBeNull();
    expect(parseEventRequest({ experimentId: 'exp-01', type: 'quiz-answered', correct: false })).not.toBeNull();
  });

  it('rejects missing, extra or out-of-range fields', () => {
    const bad = [
      { experimentId: 'exp-01', type: 'finished' },
      { experimentId: 'exp-01', type: 'finished', finishedInVisit: 0 },
      { experimentId: 'exp-01', type: 'finished', finishedInVisit: 1.5 },
      { experimentId: 'exp-01', type: 'quiz-answered' },
      { experimentId: 'exp-01', type: 'quiz-answered', correct: 'yes' },
      { experimentId: 'exp-01', type: 'started', correct: true },
      { experimentId: 'exp-01', type: 'started', sessionId: 'abc' },
      { experimentId: 'exp-01', type: 'clicked' },
      { experimentId: 'exp-99', type: 'started' },
    ];
    for (const b of bad) expect(parseEventRequest(b), JSON.stringify(b)).toBeNull();
  });
});
