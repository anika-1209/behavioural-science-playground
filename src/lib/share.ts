import type { AnswerRequest, EventRequest } from '../../shared/api';
import { CONTENT_VERSION } from '../../shared/api';
import { NO_VERSION } from '../../shared/summaries';
import { progress, type ProgressStore } from './progress';

// Sends anonymous answers and usage events to the v1.5 API, only while the
// player has said yes (spec, "Backend: Consent"). Requests carry no cookies
// and nothing that identifies the browser or links one request to another.

/** Empty means the API is served from the site's own origin, under /api. */
export const API_BASE: string = import.meta.env.VITE_API_BASE ?? '';

/** Matches the API's limit; no real visit gets near it. */
const MAX_FINISHED_IN_VISIT = 200;

/** Most events held while the consent question is unanswered. */
const MAX_HELD = 50;

type Fetch = (url: string, init: RequestInit) => Promise<Response>;

export function createSharer(store: ProgressStore, doFetch: Fetch = (u, i) => fetch(u, i), base = API_BASE) {
  let flushing = false;
  // "This visit" is this page load: nothing about it is stored.
  let finishedThisVisit = 0;
  const openedThisVisit = new Set<string>();
  const readThisVisit = new Set<string>();
  // Events from before the player answers the consent question, kept in memory
  // only. A yes sends those for the experiment it covers; otherwise they're dropped.
  let held: EventRequest[] = [];

  const post = (path: string, body: AnswerRequest | EventRequest) =>
    doFetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'omit',
      keepalive: true,
    });

  const allowed = () => store.getState().consent === 'yes';

  /** Best effort: a lost event is fine, so failures are ignored. */
  function sendEvent(event: EventRequest) {
    const { consent } = store.getState();
    if (consent === 'yes') post('/api/events', event).catch(() => {});
    else if (consent === null && held.length < MAX_HELD) held.push(event);
  }

  const once = (seen: Set<string>, experimentId: string, type: 'debrief-opened' | 'debrief-read') => {
    if (seen.has(experimentId)) return;
    seen.add(experimentId);
    sendEvent({ experimentId, type });
  };

  return {
    /**
     * Call after the player answers the consent question or changes it in
     * Settings. A yes on a result screen covers `justFinished`, so its held
     * events are sent; all other held events are dropped.
     */
    consentChanged(justFinished?: string) {
      const toSend = store.getState().consent === 'yes' ? held.filter((e) => e.experimentId === justFinished) : [];
      held = [];
      for (const e of toSend) sendEvent(e);
      void this.flushAnswers();
    },

    /**
     * Sends every first play the player agreed to share that hasn't been sent.
     * Safe to call often: on start-up, after a play, after consent changes.
     */
    async flushAnswers() {
      if (flushing) return;
      flushing = true;
      try {
        for (const [id, rec] of Object.entries(store.getState().completed)) {
          if (!allowed()) return;
          if (!rec.share || store.getState().sent.includes(id)) continue;
          const body: AnswerRequest = {
            experimentId: id,
            version: rec.condition ?? NO_VERSION,
            contentVersion: rec.contentVersion ?? CONTENT_VERSION[id] ?? 0,
            answers: rec.answers,
          };
          let res: Response;
          try {
            res = await post('/api/answers', body);
          } catch {
            return; // Offline or blocked: try again next time.
          }
          // 400 means the API will never accept it (for example, the questions
          // changed since it was played), so stop trying. Other failures retry.
          if (res.ok || res.status === 400) store.markSent(id);
        }
      } finally {
        flushing = false;
      }
    },

    started(experimentId: string) {
      sendEvent({ experimentId, type: 'started' });
    },

    finished(experimentId: string) {
      finishedThisVisit = Math.min(finishedThisVisit + 1, MAX_FINISHED_IN_VISIT);
      sendEvent({ experimentId, type: 'finished', finishedInVisit: finishedThisVisit });
    },

    /** Called when a debrief is shown. Counted once per experiment per visit, like debriefRead. */
    debriefOpened(experimentId: string) {
      once(openedThisVisit, experimentId, 'debrief-opened');
    },

    /** Called when the player reaches "How to counter it". Counted once per experiment per visit. */
    debriefRead(experimentId: string) {
      once(readThisVisit, experimentId, 'debrief-read');
    },

    quizAnswered(experimentId: string, correct: boolean) {
      sendEvent({ experimentId, type: 'quiz-answered', correct });
    },
  };
}

export const sharer = createSharer(progress);
