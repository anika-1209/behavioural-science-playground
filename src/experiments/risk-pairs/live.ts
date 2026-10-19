import type { ExperimentDefinition } from '../types';
import { PAIRS } from '../../../shared/experiments/risk-pairs/logic';
import { shareBar, valueOf } from '../live';

export const live: ExperimentDefinition['live'] = (s) => [
  {
    title: 'Picked the cause that makes the news more often',
    bars: PAIRS.map((p) => {
      const [news, other] = p.options[0].id === p.news ? p.options : [p.options[1], p.options[0]];
      return shareBar(`${news.label} over ${other.label.toLowerCase()}`, valueOf(s, p.id), {
        note: p.control ? 'here the news cause really is more common' : undefined,
      });
    }),
  },
];
