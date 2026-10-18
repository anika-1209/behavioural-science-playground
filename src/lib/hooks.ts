import { useEffect, useState, useSyncExternalStore } from 'react';
import { progress } from './progress';
import { loadDebrief } from '../content/debriefs';
import type { Debrief } from '../content/types';

export function useProgress() {
  return useSyncExternalStore(progress.subscribe, progress.getState, progress.getState);
}

/** Loads a debrief chunk only when `enabled` is true, so names stay out of the page until needed. */
export function useDebrief(id: string | undefined, enabled: boolean) {
  const [debrief, setDebrief] = useState<Debrief | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id || !enabled) return;
    let live = true;
    loadDebrief(id)
      .then((d) => live && setDebrief(d))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [id, enabled]);

  return { debrief: enabled ? debrief : null, error };
}

/** Sets the tab title; experiment pages pass the teaser title so the bias name never leaks (P3-1). */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Behavioural Science Playground` : 'Behavioural Science Playground';
  }, [title]);
}
