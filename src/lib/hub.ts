import type { BiasModule, CategoryId } from '../content/types';

export type SortKey = 'recommended' | 'alphabetical';
export type CategoryFilter = CategoryId | 'all';

export function visibleModules(modules: BiasModule[], filter: CategoryFilter, sort: SortKey): BiasModule[] {
  const list = modules.filter((m) => filter === 'all' || m.category === filter);
  return [...list].sort((a, b) =>
    sort === 'alphabetical' ? a.teaserTitle.localeCompare(b.teaserTitle) : a.beginnerRank - b.beginnerRank,
  );
}

/**
 * "Surprise me": a random playable module inside the current filter, never an
 * already-completed one unless every playable module in the filter is completed.
 */
export function pickSurprise(
  modules: BiasModule[],
  filter: CategoryFilter,
  completedIds: Set<string>,
  random: () => number = Math.random,
): BiasModule | null {
  const playable = modules.filter((m) => m.status === 'ready' && (filter === 'all' || m.category === filter));
  if (playable.length === 0) return null;
  const fresh = playable.filter((m) => !completedIds.has(m.id));
  const pool = fresh.length > 0 ? fresh : playable;
  return pool[Math.floor(random() * pool.length)] ?? pool[0]!;
}
