// Per-user progress, kept in this browser only (P2-2, spec "Privacy").
// No sign-in, no network. Every storage call is wrapped because localStorage
// can be missing or throw (private windows, blocked site data).

import type { Answers } from '../../shared/types';

export type { Answers };

export interface CompletedRecord {
  condition: string | null;
  answers: Answers;
  completedAt: string;
  quiz?: { answerId: string; correct: boolean };
}

export interface Settings {
  /** P2-3: show bias names on uncompleted hub cards (for educators and revision). */
  showBiasNames: boolean;
  /** Spec accessibility: timed experiments give more time. */
  extendTime: boolean;
}

export interface ProgressState {
  version: 1;
  seenPrimer: boolean;
  /** Condition assigned per module, kept so a user always sees the same variant. */
  conditions: Record<string, string>;
  completed: Record<string, CompletedRecord>;
  settings: Settings;
}

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const KEY = 'bsp-progress';

export const emptyState = (): ProgressState => ({
  version: 1,
  seenPrimer: false,
  conditions: {},
  completed: {},
  settings: { showBiasNames: false, extendTime: false },
});

function browserStore(): KeyValueStore | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function createProgressStore(backing: KeyValueStore | null = browserStore()) {
  let state = read();
  const listeners = new Set<() => void>();

  function read(): ProgressState {
    try {
      const raw = backing?.getItem(KEY);
      if (!raw) return emptyState();
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      if (parsed.version !== 1) return emptyState();
      const base = emptyState();
      return { ...base, ...parsed, settings: { ...base.settings, ...parsed.settings } };
    } catch {
      return emptyState();
    }
  }

  function write(next: ProgressState) {
    state = next;
    try {
      backing?.setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage full or blocked: progress lives for this session only.
    }
    listeners.forEach((l) => l());
  }

  return {
    getState: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    markPrimerSeen() {
      if (!state.seenPrimer) write({ ...state, seenPrimer: true });
    },

    /** Returns the module's condition, assigning one at random the first time (roughly 50/50 for two). */
    conditionFor(moduleId: string, options: string[], random: () => number = Math.random): string | null {
      if (options.length === 0) return null;
      const existing = state.conditions[moduleId];
      if (existing && options.includes(existing)) return existing;
      const picked = options[Math.floor(random() * options.length)] ?? options[0]!;
      write({ ...state, conditions: { ...state.conditions, [moduleId]: picked } });
      return picked;
    },

    /** Called when the experiment is submitted; unlocks the debrief (P3-5). */
    complete(moduleId: string, condition: string | null, answers: Answers, now = new Date()) {
      write({
        ...state,
        completed: {
          ...state.completed,
          [moduleId]: { condition, answers, completedAt: now.toISOString() },
        },
      });
    },

    recordQuiz(moduleId: string, answerId: string, correct: boolean) {
      const rec = state.completed[moduleId];
      if (!rec) return;
      write({
        ...state,
        completed: { ...state.completed, [moduleId]: { ...rec, quiz: { answerId, correct } } },
      });
    },

    updateSettings(patch: Partial<Settings>) {
      write({ ...state, settings: { ...state.settings, ...patch } });
    },

    /** P2-5. Keeps settings and the primer flag; clears answers and completions. */
    reset() {
      write({ ...emptyState(), seenPrimer: state.seenPrimer, settings: state.settings });
    },
  };
}

export type ProgressStore = ReturnType<typeof createProgressStore>;

export const progress = createProgressStore();
