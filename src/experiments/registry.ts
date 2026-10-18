import type { ExperimentDefinition } from './types';
import wheelEstimate from './wheel-estimate';
import riskPairs from './risk-pairs';

// Module id → experiment. Add one line per built module.
export const EXPERIMENTS: Record<string, ExperimentDefinition> = {
  'exp-01': wheelEstimate,
  'exp-02': riskPairs,
};

export const getExperiment = (id: string): ExperimentDefinition | undefined => EXPERIMENTS[id];
