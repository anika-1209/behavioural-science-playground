import type { ExperimentDefinition } from './types';
import wheelEstimate from './wheel-estimate';
import riskPairs from './risk-pairs';
import rangeQuiz from './range-quiz';
import outbreakPlans from './outbreak-plans';

// Module id → experiment. Add one line per built module.
export const EXPERIMENTS: Record<string, ExperimentDefinition> = {
  'exp-01': wheelEstimate,
  'exp-02': riskPairs,
  'exp-03': rangeQuiz,
  'exp-04': outbreakPlans,
};

export const getExperiment = (id: string): ExperimentDefinition | undefined => EXPERIMENTS[id];
