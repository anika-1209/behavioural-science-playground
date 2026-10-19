import { useEffect, useState, useSyncExternalStore } from 'react';
import { progress } from './progress';
import { loadDebrief } from '../content/debriefs';
import type { Debrief } from '../content/types';
import type { StatsResponse } from '../../shared/api';
import { API_BASE } from './share';

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

// One request per experiment per page load; summaries change every 15 minutes at most.
const statsCache = new Map<string, Promise<StatsResponse | null>>();

/** Fetches "how others answered". The request carries nothing but the experiment id. */
export function fetchStats(id: string, doFetch: typeof fetch = fetch, base = API_BASE): Promise<StatsResponse | null> {
  let p = statsCache.get(id);
  if (!p) {
    p = doFetch(`${base}/api/stats/${encodeURIComponent(id)}`, { credentials: 'omit' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: StatsResponse | null) => (d && d.experimentId === id && typeof d.live === 'boolean' ? d : null))
      .catch(() => null); // No numbers is fine: the screens fall back to study figures.
    statsCache.set(id, p);
  }
  return p;
}

/** Loads live stats once `enabled` (only after submitting, so nothing loads during the experiment). */
export function useStats(id: string, enabled: boolean) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    fetchStats(id).then((s) => live && setStats(s));
    return () => {
      live = false;
    };
  }, [id, enabled]);
  return enabled ? stats : null;
}

/** Sets the tab title; experiment pages pass the teaser title so the bias name never leaks (P3-1). */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Behavioural Science Playground` : 'Behavioural Science Playground';
  }, [title]);
}
