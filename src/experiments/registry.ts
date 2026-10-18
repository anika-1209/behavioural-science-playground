import type { ExperimentDefinition } from './types';
import wheelEstimate from './wheel-estimate';
import riskPairs from './risk-pairs';
import rangeQuiz from './range-quiz';
import outbreakPlans from './outbreak-plans';
import phonePlans from './phone-plans';
import twoTrips from './two-trips';
import ruleFinder from './rule-finder';
import crashClip from './crash-clip';

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
};

export const getExperiment = (id: string): ExperimentDefinition | undefined => EXPERIMENTS[id];
