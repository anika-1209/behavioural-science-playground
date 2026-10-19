import type { ExperimentDefinition } from '../types';
import { ANCHOR } from '../../../shared/experiments/wheel-estimate/logic';
import { valueOf } from '../live';

export const live: ExperimentDefinition['live'] = (s, condition) => [
  {
    title: 'Middle guess, by the number the wheel showed',
    bars: Object.entries(ANCHOR).map(([v, n]) => {
      const value = valueOf(s, 'medianGuess', v);
      return { label: `Wheel showed ${n}`, value, display: value === null ? '–' : `${value}%`, max: 100, mine: v === condition };
    }),
  },
];
