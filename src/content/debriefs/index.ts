import type { Debrief } from '../types';

// Each debrief is a separate dynamic import, so Vite emits it as its own chunk
// and the bias name is not in the bundle a user downloads before the reveal (P3-1).
// Add one line here per built module.
const LOADERS: Record<string, () => Promise<{ default: Debrief }>> = {
  'exp-01': () => import('./exp-01'),
  'exp-02': () => import('./exp-02'),
  'exp-03': () => import('./exp-03'),
  'exp-04': () => import('./exp-04'),
  'exp-05': () => import('./exp-05'),
};

export const hasDebrief = (id: string) => id in LOADERS;

const cache = new Map<string, Debrief>();

export async function loadDebrief(id: string): Promise<Debrief> {
  const hit = cache.get(id);
  if (hit) return hit;
  const load = LOADERS[id];
  if (!load) throw new Error(`No debrief for module ${id}`);
  const mod = await load();
  cache.set(id, mod.default);
  return mod.default;
}

export const builtDebriefIds = () => Object.keys(LOADERS);
