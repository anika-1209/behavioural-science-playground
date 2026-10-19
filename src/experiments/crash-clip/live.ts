import type { ExperimentDefinition } from '../types';
import { VERB_TEXT, verbOf, type Verb } from '../../../shared/experiments/crash-clip/logic';
import { shareBar, valueOf } from '../live';

const VERBS: Verb[] = ['smashed', 'hit'];
const label = (v: Verb) => `Asked "${VERB_TEXT[v]}"`;

export const live: ExperimentDefinition['live'] = (s, condition) => {
  const mine = verbOf(condition);
  const speeds = VERBS.map((v) => valueOf(s, 'medianSpeed', v));
  // Speeds get their own scale, with room above the faster group.
  const max = Math.max(60, ...speeds.map((x) => (x ?? 0) * 1.2));
  return [
    {
      title: 'Said they saw broken glass',
      bars: VERBS.map((v) => shareBar(label(v), valueOf(s, 'glassShare', v), { mine: v === mine })),
    },
    {
      title: 'Middle speed estimate',
      bars: VERBS.map((v, i) => ({
        label: label(v),
        value: speeds[i]!,
        display: speeds[i] === null ? '–' : `${speeds[i]} mph`,
        max,
        mine: v === mine,
      })),
    },
  ];
};
