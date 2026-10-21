import type { Answers } from './types';
import * as wheel from './experiments/wheel-estimate/logic';
import * as risk from './experiments/risk-pairs/logic';
import * as range from './experiments/range-quiz/logic';
import * as outbreak from './experiments/outbreak-plans/logic';
import * as phone from './experiments/phone-plans/logic';
import * as trips from './experiments/two-trips/logic';
import * as rule from './experiments/rule-finder/logic';
import * as crash from './experiments/crash-clip/logic';
import * as line from './experiments/line-judge/logic';
import * as later from './experiments/now-later/logic';
import * as flip from './experiments/next-flip/logic';
import * as bets from './experiments/coin-bets/logic';

// "How others answered": one summary per experiment version, built from the
// experiment's own result logic so the app and the API apply the same rules
// (spec, "Backend: Summary for each experiment"). Value keys never name the bias (P3-1).

/** One stored play: the version the player saw and their answers. */
export interface Play {
  condition: string | null;
  answers: Answers;
}

export type SummaryValues = Record<string, number | null>;

export interface VersionSummary {
  /** Plays counted. The app switches from study figures to these at LIVE_MIN. */
  n: number;
  values: SummaryValues;
}

export type ExperimentSummary = Record<string, VersionSummary>;

interface SummaryDef {
  /** The experiment's conditions, or ['all'] if it has none. */
  versions: string[];
  /** `plays` all share one version; it may be empty. */
  summarise: (plays: Answers[], version: string) => SummaryValues;
}

/** Live numbers replace study figures once every version has this many plays. */
export const LIVE_MIN = 50;

/** Plays with no condition are counted under this version. */
export const NO_VERSION = 'all';

// Shares are percentages and, like means, rounded to one decimal place.
const round1 = (x: number) => Math.round(x * 10) / 10;

export function share<T>(items: T[], test: (item: T) => boolean): number | null {
  return items.length ? round1((100 * items.filter(test).length) / items.length) : null;
}

export function mean(xs: number[]): number | null {
  return xs.length ? round1(xs.reduce((a, b) => a + b, 0) / xs.length) : null;
}

export function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

const numbers = (plays: Answers[], key: string) =>
  plays.map((a) => Number(a[key])).filter((x) => Number.isFinite(x));

const NONE = [NO_VERSION];

export const SUMMARIES: Record<string, SummaryDef> = {
  // Median guess for each wheel number.
  'exp-01': {
    versions: Object.keys(wheel.ANCHOR),
    summarise: (plays) => ({ medianGuess: median(numbers(plays, 'estimate')) }),
  },
  // Share choosing the newsworthy cause, per pair (the control pair included).
  'exp-02': {
    versions: NONE,
    summarise: (plays) => Object.fromEntries(risk.PAIRS.map((p) => [p.id, share(plays, (a) => a[p.id] === p.news)])),
  },
  // Average number of ranges that caught the answer.
  'exp-03': {
    versions: NONE,
    summarise: (plays) => ({ meanHits: mean(plays.map(range.hits)) }),
  },
  // Share choosing the sure plan, per wording.
  'exp-04': {
    versions: ['gain', 'loss'],
    summarise: (plays) => ({ sureShare: share(plays, (a) => outbreak.choiceOf(a) === 'sure') }),
  },
  // Share choosing the targeted plan, per version.
  'exp-05': {
    versions: ['premium', 'budget'],
    summarise: (plays, v) => ({
      targetShare: share(plays, (a) => phone.choiceOf(a) === phone.TARGET[phone.versionOf(v)]),
    }),
  },
  // Share choosing Edinburgh.
  'exp-06': {
    versions: NONE,
    summarise: (plays) => ({ cityShare: share(plays, (a) => trips.choiceOf(a) === 'city') }),
  },
  // Share who found the rule.
  'exp-07': {
    versions: NONE,
    summarise: (plays) => ({ foundShare: share(plays, (a) => rule.ruleOf(a).id === rule.CORRECT) }),
  },
  // Share reporting broken glass, per verb; median speed per verb.
  'exp-08': {
    versions: ['smashed', 'hit'],
    summarise: (plays) => ({
      glassShare: share(plays, crash.sawGlass),
      medianSpeed: median(numbers(plays, 'speed')),
    }),
  },
  // Average rounds going with the group; share going along at least once.
  'exp-09': {
    versions: NONE,
    summarise: (plays) => ({
      meanWithGroup: mean(plays.map(line.wentWithGroup)),
      anyShare: share(plays, line.wasPulled),
    }),
  },
  // Share with at least one flip toward the present.
  'exp-10': {
    versions: NONE,
    summarise: (plays) => ({ flipShare: share(plays, later.wasPulled) }),
  },
  // Share of streak bets against the streak; share saying both sides are equally likely.
  'exp-11': {
    versions: NONE,
    summarise: (plays) => ({
      againstShare: plays.length
        ? round1((100 * plays.reduce((n, a) => n + flip.againstStreak(a), 0)) / (plays.length * flip.STREAK_ROUNDS.length))
        : null,
      equalShare: share(plays, (a) => flip.beliefOf(a) === 'equal'),
    }),
  },
  // Share accepting each bet.
  'exp-12': {
    versions: NONE,
    summarise: (plays) => Object.fromEntries(bets.WINS.map((w) => [bets.keyOf(w), share(plays, (a) => bets.accepted(a, w))])),
  },
};

/**
 * Summarises one experiment's plays, per version. Plays from versions the
 * experiment doesn't have are ignored; returns null for an unknown experiment.
 */
export function summarise(experimentId: string, plays: Play[]): ExperimentSummary | null {
  const def = SUMMARIES[experimentId];
  if (!def) return null;
  const out: ExperimentSummary = {};
  for (const v of def.versions) {
    const mine = plays.filter((p) => (p.condition ?? NO_VERSION) === v).map((p) => p.answers);
    out[v] = { n: mine.length, values: def.summarise(mine, v) };
  }
  return out;
}

/** True once every version has enough plays to show live numbers instead of study figures. */
export const isLive = (summary: ExperimentSummary) => Object.values(summary).every((s) => s.n >= LIVE_MIN);
