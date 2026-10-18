import { describe, expect, it } from 'vitest';
import type { BiasModule } from '../content/types';
import { pickSurprise, visibleModules } from './hub';

const mod = (id: string, over: Partial<BiasModule> = {}): BiasModule => ({
  id,
  teaserTitle: id,
  teaserHook: '',
  category: 'judgement',
  estMinutes: 3,
  experimentType: 'choice',
  conditions: [],
  introText: '',
  beginnerRank: 1,
  relatedBiasIds: [],
  status: 'ready',
  ...over,
});

const MODS = [
  mod('exp-01', { beginnerRank: 2, teaserTitle: 'Banana' }),
  mod('exp-02', { beginnerRank: 1, teaserTitle: 'Cherry' }),
  mod('exp-03', { beginnerRank: 3, teaserTitle: 'Apple', category: 'social' }),
  mod('exp-04', { status: 'planned' }),
];

describe('visibleModules', () => {
  it('filters by category and sorts', () => {
    expect(visibleModules(MODS, 'all', 'recommended').map((m) => m.id)).toEqual(['exp-02', 'exp-04', 'exp-01', 'exp-03']);
    expect(visibleModules(MODS, 'all', 'alphabetical')[0]?.id).toBe('exp-03');
    expect(visibleModules(MODS, 'social', 'recommended').map((m) => m.id)).toEqual(['exp-03']);
  });
});

describe('pickSurprise', () => {
  it('never returns a module outside the filter', () => {
    for (const r of [0, 0.5, 0.99]) {
      expect(pickSurprise(MODS, 'social', new Set(), () => r)?.id).toBe('exp-03');
    }
  });

  it('skips completed and planned modules', () => {
    for (const r of [0, 0.5, 0.99]) {
      expect(pickSurprise(MODS, 'judgement', new Set(['exp-01']), () => r)?.id).toBe('exp-02');
    }
  });

  it('falls back to completed modules when all are done', () => {
    const picked = pickSurprise(MODS, 'judgement', new Set(['exp-01', 'exp-02']), () => 0);
    expect(['exp-01', 'exp-02']).toContain(picked?.id);
  });

  it('returns null when nothing in the filter is playable', () => {
    expect(pickSurprise([mod('exp-09', { status: 'planned' })], 'all', new Set())).toBeNull();
  });
});
