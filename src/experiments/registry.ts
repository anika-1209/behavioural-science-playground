import type { ExperimentDefinition } from './types';
import wheelEstimate from './wheel-estimate';
import riskPairs from './risk-pairs';
import rangeQuiz from './range-quiz';
import outbreakPlans from './outbreak-plans';
import phonePlans from './phone-plans';
import twoTrips from './two-trips';
import ruleFinder from './rule-finder';
import crashClip from './crash-clip';
import lineJudge from './line-judge';
import nowLater from './now-later';
import nextFlip from './next-flip';
import coinBets from './coin-bets';
import beforeAfter from './before-after';
import firstDay from './first-day';
import mugPrice from './mug-price';
import firstImpressions from './first-impressions';

// Module id → experiment. Add one line per built module.
export const EXPERIMENTS: Record<string, ExperimentDefinition> = {
  'exp-01': wheelEstimate,
  'exp-02': riskPairs,
  'exp-03': rangeQuiz,
  'exp-04': outbreakPlans,
  'exp-05': phonePlans,
  'exp-06': twoTrips,
  'exp-07': ruleFinder,
  'exp-08': crashClip,
  'exp-09': lineJudge,
  'exp-10': nowLater,
  'exp-11': nextFlip,
  'exp-12': coinBets,
  'exp-13': beforeAfter,
  'exp-14': firstDay,
  'exp-15': mugPrice,
  'exp-16': firstImpressions,
};

export const getExperiment = (id: string): ExperimentDefinition | undefined => EXPERIMENTS[id];
