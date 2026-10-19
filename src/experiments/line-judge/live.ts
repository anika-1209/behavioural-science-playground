import type { ExperimentDefinition } from '../types';
import { CRITICAL_COUNT } from '../../../shared/experiments/line-judge/logic';
import { EVERYONE, shareBar, valueOf } from '../live';

export const live: ExperimentDefinition['live'] = (s) => {
  const mean = valueOf(s, 'meanWithGroup');
  return [
    { title: 'Went with the wrong group answer at least once', bars: [shareBar(EVERYONE, valueOf(s, 'anyShare'))] },
    {
      title: `Rounds going with the wrong group answer, out of ${CRITICAL_COUNT}, on average`,
      bars: [{ label: EVERYONE, value: mean, display: mean === null ? '–' : `${mean} of ${CRITICAL_COUNT}`, max: CRITICAL_COUNT }],
    },
  ];
};
