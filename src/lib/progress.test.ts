import { describe, expect, it } from 'vitest';
import { createProgressStore, type KeyValueStore } from './progress';

function memory(): KeyValueStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

describe('progress store', () => {
  it('starts empty and persists across instances (P2-2)', () => {
    const backing = memory();
    const a = createProgressStore(backing);
    expect(a.getState().completed).toEqual({});
    a.complete('exp-01', 'low', { estimate: 20 }, new Date('2026-10-17T10:00:00Z'));

    const b = createProgressStore(backing);
    expect(b.getState().completed['exp-01']).toEqual({
      condition: 'low',
      answers: { estimate: 20 },
      completedAt: '2026-10-17T10:00:00.000Z',
    });
  });

  it('keeps working when storage is unavailable', () => {
    const throwing: KeyValueStore = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); },
    };
    const s = createProgressStore(throwing);
    s.markPrimerSeen();
    expect(s.getState().seenPrimer).toBe(true);
  });

  it('assigns a condition once and keeps it', () => {
    const s = createProgressStore(memory());
    expect(s.conditionFor('exp-01', ['low', 'high'], () => 0.9)).toBe('high');
    expect(s.conditionFor('exp-01', ['low', 'high'], () => 0.1)).toBe('high');
    expect(s.conditionFor('exp-02', [], () => 0.5)).toBeNull();
  });

  it('splits two conditions roughly 50/50', () => {
    let low = 0;
    for (let i = 0; i < 2000; i++) {
      const s = createProgressStore(memory());
      if (s.conditionFor('exp-01', ['low', 'high']) === 'low') low++;
    }
    expect(low / 2000).toBeGreaterThan(0.45);
    expect(low / 2000).toBeLessThan(0.55);
  });

  it('records quiz answers only for completed modules', () => {
    const s = createProgressStore(memory());
    s.recordQuiz('exp-01', 'a', true);
    expect(s.getState().completed['exp-01']).toBeUndefined();
    s.complete('exp-01', 'low', { estimate: 20 });
    s.recordQuiz('exp-01', 'a', true);
    expect(s.getState().completed['exp-01']?.quiz).toEqual({ answerId: 'a', correct: true });
  });

  it('reset clears completions but keeps settings and the primer flag (P2-5)', () => {
    const s = createProgressStore(memory());
    s.markPrimerSeen();
    s.updateSettings({ extendTime: true });
    s.complete('exp-01', 'high', { estimate: 50 });
    s.reset();
    const st = s.getState();
    expect(st.completed).toEqual({});
    expect(st.conditions).toEqual({});
    expect(st.seenPrimer).toBe(true);
    expect(st.settings.extendTime).toBe(true);
  });

  it('notifies subscribers on change', () => {
    const s = createProgressStore(memory());
    let calls = 0;
    const off = s.subscribe(() => calls++);
    s.markPrimerSeen();
    off();
    s.updateSettings({ showBiasNames: true });
    expect(calls).toBe(1);
  });
});
