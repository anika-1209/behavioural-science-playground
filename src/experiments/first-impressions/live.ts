import type { ExperimentDefinition } from '../types';
import { shareBar, valueOf } from '../live';

const VERSIONS = [
  { id: 'warm', label: 'Read that Sam was warm' },
  { id: 'cold', label: 'Read that Sam was cold' },
];

export const live: ExperimentDefinition['live'] = (s, condition) => [
  {
    title: "Average rating of Sam's note, out of 7",
    bars: VERSIONS.map((v) => {
      const value = valueOf(s, 'meanWriting', v.id);
      return { label: v.label, value, display: value === null ? '–' : String(value), max: 7, mine: v.id === condition };
    }),
  },
  {
    title: 'Said the description made no difference',
    bars: VERSIONS.map((v) => shareBar(v.label, valueOf(s, 'noneShare', v.id), { mine: v.id === condition })),
  },
];
