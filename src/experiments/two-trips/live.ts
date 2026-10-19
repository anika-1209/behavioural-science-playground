import type { ExperimentDefinition } from '../types';
import { EVERYONE, shareBar, valueOf } from '../live';

export const live: ExperimentDefinition['live'] = (s) => [
  { title: 'Chose Edinburgh, the £200 trip', bars: [shareBar(EVERYONE, valueOf(s, 'cityShare'))] },
];
