import type { ExperimentDefinition } from '../types';
import { EVERYONE, shareBar, valueOf } from '../live';

export const live: ExperimentDefinition['live'] = (s) => [
  { title: 'Bets that a streak would end, out of all bets after a streak', bars: [shareBar(EVERYONE, valueOf(s, 'againstShare'))] },
  { title: 'Said heads and tails were equally likely after six heads', bars: [shareBar(EVERYONE, valueOf(s, 'equalShare'))] },
];
