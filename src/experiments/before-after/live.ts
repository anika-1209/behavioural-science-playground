import type { ExperimentDefinition } from '../types';
import { EVERYONE, shareBar, valueOf } from '../live';
import { QUESTIONS } from '../../../shared/experiments/before-after/logic';

export const live: ExperimentDefinition['live'] = (s) => {
  const mean = valueOf(s, 'meanToward');
  return [
    {
      title: 'Remembered answers closer to the real ones more often than not',
      bars: [shareBar(EVERYONE, valueOf(s, 'towardShare'))],
    },
    {
      title: `Questions where memory moved toward the real answer, out of ${QUESTIONS.length}`,
      bars: [{ label: `${EVERYONE}, on average`, value: mean, display: mean === null ? '–' : String(mean), max: QUESTIONS.length }],
    },
  ];
};
