import type { ExperimentDefinition } from '../types';
import { shareBar, valueOf } from '../live';
import { STAKE, WINS, keyOf } from '../../../shared/experiments/coin-bets/logic';

export const live: ExperimentDefinition['live'] = (s) => [
  {
    title: `Took each bet (lose £${STAKE} on tails)`,
    bars: WINS.map((w) => shareBar(`Win £${w} on heads`, valueOf(s, keyOf(w)))),
  },
];
