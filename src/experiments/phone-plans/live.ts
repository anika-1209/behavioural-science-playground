import type { ExperimentDefinition } from '../types';
import { MENU, PLANS, TARGET, planLabel, versionOf, type Version } from '../../../shared/experiments/phone-plans/logic';
import { shareBar, valueOf } from '../live';

const VERSIONS = Object.keys(MENU) as Version[];

export const live: ExperimentDefinition['live'] = (s, condition) => [
  {
    title: 'Chose the main plan that the third plan was worse than',
    bars: VERSIONS.map((v) =>
      shareBar(`Third plan worse than ${planLabel(TARGET[v])}`, valueOf(s, 'targetShare', v), {
        mine: v === versionOf(condition),
        note: `chose ${PLANS[TARGET[v]].gb} GB`,
      }),
    ),
  },
];
