import type { ExperimentDefinition } from '../types';
import { shareBar, valueOf } from '../live';

const VERSIONS = [
  { id: 'out', label: 'Form started at 0%' },
  { id: 'in', label: 'Form started at 5%' },
];

export const live: ExperimentDefinition['live'] = (s, condition) => [
  {
    title: 'Saving into the pension',
    bars: VERSIONS.map((v) => shareBar(v.label, valueOf(s, 'joinedShare', v.id), { mine: v.id === condition })),
  },
  {
    title: 'Left the pension as it was set',
    bars: VERSIONS.map((v) => shareBar(v.label, valueOf(s, 'keptShare', v.id), { mine: v.id === condition })),
  },
];
