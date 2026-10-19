import type { ExperimentDefinition } from '../types';
import { EVERYONE, shareBar, valueOf } from '../live';

export const live: ExperimentDefinition['live'] = (s) => [
  {
    title: 'Took £100 today, but waited when the same choice was a year away, at least once',
    bars: [shareBar(EVERYONE, valueOf(s, 'flipShare'))],
  },
];
