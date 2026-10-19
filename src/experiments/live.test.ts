import { describe, expect, it } from 'vitest';
import { EXPERIMENTS } from './registry';
import { SUMMARIES, type ExperimentSummary } from '../../shared/summaries';
import { loadDebrief } from '../content/debriefs';

/** A live summary for `id` with every value set to `x`. */
function filled(id: string, x: number): ExperimentSummary {
  const def = SUMMARIES[id]!;
  return Object.fromEntries(
    def.versions.map((v) => [
      v,
      { n: 60, values: Object.fromEntries(Object.keys(def.summarise([], v)).map((k) => [k, x])) },
    ]),
  );
}

const ids = Object.keys(EXPERIMENTS);

describe('live views', () => {
  it.each(ids)('%s shows every value it is given', (id) => {
    const groups = EXPERIMENTS[id]!.live(filled(id, 3), SUMMARIES[id]!.versions[0]!);
    expect(groups.length).toBeGreaterThan(0);
    for (const g of groups) {
      expect(g.bars.length).toBeGreaterThan(0);
      for (const b of g.bars) {
        expect(b.value, `${id} ${b.label}`).not.toBeNull();
        expect(b.display).not.toBe('–');
        expect(b.value!).toBeLessThanOrEqual(b.max);
      }
    }
  });

  it.each(ids)('%s marks the player\'s own version, when there is more than one', (id) => {
    const versions = SUMMARIES[id]!.versions;
    for (const v of versions) {
      for (const g of EXPERIMENTS[id]!.live(filled(id, 3), v)) {
        const mine = g.bars.filter((b) => b.mine).length;
        expect(mine).toBe(versions.length > 1 && g.bars.length === versions.length ? 1 : 0);
      }
    }
  });

  it.each(ids)('%s shows a dash for missing values', (id) => {
    const empty = Object.fromEntries(
      SUMMARIES[id]!.versions.map((v) => [v, { n: 0, values: SUMMARIES[id]!.summarise([], v) }]),
    );
    for (const g of EXPERIMENTS[id]!.live(empty, null)) {
      for (const b of g.bars) if (b.value === null) expect(b.display).toBe('–');
    }
  });

  it.each(ids)('%s does not name its bias (P3-1)', async (id) => {
    const name = (await loadDebrief(id)).biasName.toLowerCase();
    const text = EXPERIMENTS[id]!.live(filled(id, 3), null)
      .flatMap((g) => [g.title, ...g.bars.flatMap((b) => [b.label, b.note ?? '', b.display])])
      .join(' ')
      .toLowerCase();
    expect(text).not.toContain(name);
  });
});
