import type { ExperimentSummary } from '../../shared/summaries';
import { NO_VERSION } from '../../shared/summaries';
import type { LiveBar } from './types';

// Helpers for each experiment's live.ts.

export const valueOf = (s: ExperimentSummary, key: string, version = NO_VERSION) => s[version]?.values[key] ?? null;

/** A percentage bar. Shares arrive as percentages with one decimal; they're shown whole. */
export const shareBar = (label: string, value: number | null, extra: Partial<LiveBar> = {}): LiveBar => ({
  label,
  value,
  display: value === null ? '–' : `${Math.round(value)}%`,
  max: 100,
  ...extra,
});

/** The label for an experiment with a single version. */
export const EVERYONE = 'Players here';
