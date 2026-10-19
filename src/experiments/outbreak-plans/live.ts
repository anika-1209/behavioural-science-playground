import type { ExperimentDefinition } from '../types';
import { shareBar, valueOf } from '../live';

export const live: ExperimentDefinition['live'] = (s, condition) => [
  {
    title: 'Chose Plan A, the sure option',
    bars: [
      shareBar('Described as lives saved', valueOf(s, 'sureShare', 'gain'), { mine: condition !== 'loss' }),
      shareBar('Described as lives lost', valueOf(s, 'sureShare', 'loss'), { mine: condition === 'loss' }),
    ],
  },
];
