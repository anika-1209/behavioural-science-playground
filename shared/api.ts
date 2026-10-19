import type { Answers } from './types';
import { SUMMARIES, type ExperimentSummary } from './summaries';
import { validAnswers } from './validate';

// The request and response shapes of the v1.5 API, and the checks the Worker
// applies to every request (spec, "Backend: What is sent" and "Data quality").
// Nothing here may carry a bias name (P3-1).

/**
 * Bump an experiment's number whenever its questions, options or study
 * figures change. Answers carry it, so a change starts a fresh count.
 */
export const CONTENT_VERSION: Record<string, number> = {
  'exp-01': 1,
  'exp-02': 1,
  'exp-03': 1,
  'exp-04': 1,
  'exp-05': 1,
  'exp-06': 1,
  'exp-07': 1,
  'exp-08': 1,
  'exp-09': 1,
  'exp-10': 1,
};

/** POST /api/answers: one player's first play of one experiment. */
export interface AnswerRequest {
  experimentId: string;
  /** The condition the player saw, or NO_VERSION. */
  version: string;
  contentVersion: number;
  answers: Answers;
}

export const EVENT_TYPES = ['started', 'finished', 'debrief-opened', 'debrief-read', 'quiz-answered'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** POST /api/events: one usage event. */
export interface EventRequest {
  experimentId: string;
  type: EventType;
  /** quiz-answered only. */
  correct?: boolean;
  /** finished only: experiments this browser has finished in the current visit, this one included. */
  finishedInVisit?: number;
}

/** GET /api/stats/:experimentId */
export interface StatsResponse {
  experimentId: string;
  contentVersion: number;
  /** True once every version has LIVE_MIN plays; until then the app shows study figures. */
  live: boolean;
  versions: ExperimentSummary;
  /** When the summary was last recomputed, or null if it hasn't been yet. */
  computedAt: string | null;
}

/** Largest request body the API accepts, in bytes. The longest real answer is well under 1 KB. */
export const MAX_BODY = 4096;

/** Most experiments a browser could plausibly finish in one visit. */
const MAX_FINISHED_IN_VISIT = 200;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

const hasExactly = (o: Record<string, unknown>, required: string[], optional: string[] = []) =>
  required.every((k) => k in o) && Object.keys(o).every((k) => required.includes(k) || optional.includes(k));

/** Returns the request if it is exactly a valid answer for the current content, otherwise null. */
export function parseAnswerRequest(body: unknown): AnswerRequest | null {
  if (!isRecord(body) || !hasExactly(body, ['experimentId', 'version', 'contentVersion', 'answers'])) return null;
  const { experimentId, version, contentVersion, answers } = body;
  if (typeof experimentId !== 'string' || typeof version !== 'string' || !isRecord(answers)) return null;
  const def = SUMMARIES[experimentId];
  if (!def || !def.versions.includes(version)) return null;
  if (contentVersion !== CONTENT_VERSION[experimentId]) return null;
  if (!validAnswers(experimentId, version, answers)) return null;
  return { experimentId, version, contentVersion, answers: answers as Answers };
}

/** Returns the request if it is exactly a valid usage event, otherwise null. */
export function parseEventRequest(body: unknown): EventRequest | null {
  if (!isRecord(body) || !hasExactly(body, ['experimentId', 'type'], ['correct', 'finishedInVisit'])) return null;
  const { experimentId, type, correct, finishedInVisit } = body;
  if (typeof experimentId !== 'string' || !(experimentId in SUMMARIES)) return null;
  if (!EVENT_TYPES.includes(type as EventType)) return null;

  if (type === 'quiz-answered') {
    if (typeof correct !== 'boolean' || finishedInVisit !== undefined) return null;
    return { experimentId, type, correct };
  }
  if (type === 'finished') {
    const n = finishedInVisit;
    if (correct !== undefined || typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > MAX_FINISHED_IN_VISIT) return null;
    return { experimentId, type, finishedInVisit: n };
  }
  if (correct !== undefined || finishedInVisit !== undefined) return null;
  return { experimentId, type: type as EventType };
}
