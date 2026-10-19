import { describe, expect, it } from 'vitest';
import { MODULES } from './modules';
import { CATEGORIES } from './categories';
import { PRIMER_CARDS } from './primer';
import { builtDebriefIds, loadDebrief } from './debriefs';
import { EXPERIMENTS } from '../experiments/registry';
import { NO_VERSION, SUMMARIES } from '../../shared/summaries';

const categoryIds = new Set(CATEGORIES.map((c) => c.id));
const moduleIds = new Set(MODULES.map((m) => m.id));

describe('bias modules', () => {
  it('has unique ids', () => {
    expect(moduleIds.size).toBe(MODULES.length);
  });

  it.each(MODULES)('$id has valid teaser data', (m) => {
    expect(m.id).toMatch(/^exp-\d{2}$/); // opaque, so the URL can't leak the bias (P3-1)
    expect(categoryIds.has(m.category)).toBe(true);
    expect(m.estMinutes).toBeGreaterThanOrEqual(2);
    expect(m.estMinutes).toBeLessThanOrEqual(4); // P3-2
    expect(m.teaserTitle.trim()).not.toBe('');
    expect(m.teaserHook.trim()).not.toBe('');
    for (const r of m.relatedBiasIds) expect(moduleIds.has(r)).toBe(true);
  });

  it.each(MODULES.filter((m) => m.status === 'ready'))('$id is fully built', (m) => {
    expect(EXPERIMENTS[m.id]).toBeDefined();
    expect(builtDebriefIds()).toContain(m.id);
  });

  it.each(MODULES.filter((m) => m.status === 'ready'))('$id has a summary over its own conditions', (m) => {
    expect(SUMMARIES[m.id]?.versions).toEqual(m.conditions.length ? m.conditions : [NO_VERSION]);
  });
});

describe('debriefs', () => {
  it.each(builtDebriefIds())('%s has every mandatory field', async (id) => {
    const d = await loadDebrief(id);
    expect(d.biasName.trim()).not.toBe('');
    expect(d.definition.trim()).not.toBe('');
    expect(d.whyItHappens.length).toBeGreaterThan(0);
    expect(d.classicStudy.authors).not.toBe('');
    expect(d.classicStudy.citationUrl).toMatch(/^https:\/\//); // P3-6
    expect(d.realWorldExamples.length).toBeGreaterThanOrEqual(2);
    expect(d.realWorldExamples.length).toBeLessThanOrEqual(3);
    expect(d.counterStrategies.length).toBeGreaterThanOrEqual(1);
    if (d.quiz) {
      expect(d.quiz.options.map((o) => o.id)).toContain(d.quiz.answerId);
    }
  });

  it.each(builtDebriefIds())('%s does not leak its name into teaser text or the primer', async (id) => {
    const name = (await loadDebrief(id)).biasName.toLowerCase();
    for (const m of MODULES) {
      expect(`${m.teaserTitle} ${m.teaserHook} ${m.introText}`.toLowerCase()).not.toContain(name);
    }
    for (const c of PRIMER_CARDS) {
      expect(`${c.title} ${c.body.join(' ')}`.toLowerCase()).not.toContain(name); // P1-4
    }
  });
});

describe('primer', () => {
  it('has five cards of at most ~80 words (P1-3)', () => {
    expect(PRIMER_CARDS).toHaveLength(5);
    for (const c of PRIMER_CARDS) {
      expect(c.body.join(' ').split(/\s+/).length).toBeLessThanOrEqual(80);
    }
  });
});
