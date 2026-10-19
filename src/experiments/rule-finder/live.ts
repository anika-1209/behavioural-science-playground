import type { ExperimentDefinition } from '../types';
import { EVERYONE, shareBar, valueOf } from '../live';

export const live: ExperimentDefinition['live'] = (s) => [
  { title: 'Found the rule', bars: [shareBar(EVERYONE, valueOf(s, 'foundShare'))] },
];
