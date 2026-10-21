import type { ExperimentDefinition, LiveBar } from '../types';
import { valueOf } from '../live';
import { money } from '../../../shared/experiments/mug-price/logic';

const VERSIONS = [
  { id: 'owner', label: 'Imagined owning it: lowest price to sell' },
  { id: 'buyer', label: 'Imagined buying it: most they would pay' },
];

export const live: ExperimentDefinition['live'] = (s, condition) => {
  const values = VERSIONS.map((v) => valueOf(s, 'medianPrice', v.id));
  const max = Math.max(10, ...values.map((x) => x ?? 0));
  const bars: LiveBar[] = VERSIONS.map((v, i) => ({
    label: v.label,
    value: values[i]!,
    display: values[i] === null ? '–' : money(values[i]!),
    max,
    mine: v.id === condition,
  }));
  return [{ title: 'Median price', bars }];
};
