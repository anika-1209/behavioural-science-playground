import type { ExperimentDefinition } from '../types';
import { QUESTIONS, TARGET } from '../../../shared/experiments/range-quiz/logic';
import { EVERYONE, valueOf } from '../live';

const n = QUESTIONS.length;

export const live: ExperimentDefinition['live'] = (s) => {
  const value = valueOf(s, 'meanHits');
  return [
    {
      title: `Ranges that caught the answer, out of ${n}, on average`,
      bars: [
        { label: EVERYONE, value, display: value === null ? '–' : `${value} of ${n}`, max: n },
        { label: 'What 90% ranges should catch', value: TARGET, display: `${TARGET} of ${n}`, max: n },
      ],
    },
  ];
};
