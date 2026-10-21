import { CONTENT_VERSION, MAX_BODY, parseAnswerRequest, parseEventRequest, type StatsResponse } from '../shared/api';
import { SUMMARIES, isLive, summarise, type ExperimentSummary, type Play } from '../shared/summaries';

// The v1.5 API (spec, "Backend"). Kept free of Cloudflare-only globals so the
// tests can run it against a local SQLite database; index.ts adds edge caching.
// Nothing about the requester is stored. The only thing read is the IP address,
// as the rate limiter's key: Cloudflare counts it in memory for a minute, and
// it never reaches the database or a log.

export interface Env {
  DB: D1Database;
  /**
   * The site's origins, comma-separated, since the API is served from a
   * different domain. When set, POSTs must come from one of them: a basic
   * filter against scripted submissions.
   */
  ALLOWED_ORIGIN?: string;
  /** Cloudflare's rate limiter for POSTs (wrangler.toml). Optional so tests and local runs can skip it. */
  LIMITER?: RateLimit;
}

/** How long browsers and the edge may reuse a stats response, in seconds. */
export const STATS_MAX_AGE = 300;

/** Raw answers and events are deleted after this many months (spec, "Privacy and retention"). */
export const RETENTION_MONTHS = 12;

const day = (d: Date) => d.toISOString().slice(0, 10);

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });

const error = (status: number, message: string) => json({ error: message }, { status });

/** Whether the request comes from one of the site's origins. Always true when none are configured. */
function fromSite(req: Request, env: Env): boolean {
  if (!env.ALLOWED_ORIGIN) return true;
  const origin = req.headers.get('Origin');
  return origin !== null && env.ALLOWED_ORIGIN.split(',').some((o) => o.trim() === origin);
}

/** Reads a small JSON body. Returns undefined if it is too big, not JSON, or not sent as JSON. */
async function readJson(req: Request): Promise<unknown> {
  if (!req.headers.get('Content-Type')?.startsWith('application/json')) return undefined;
  if (Number(req.headers.get('Content-Length') ?? 0) > MAX_BODY) return undefined;
  const text = await req.text();
  if (text.length > MAX_BODY) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function corsHeaders(req: Request, env: Env): Record<string, string> {
  const origin = req.headers.get('Origin');
  if (!env.ALLOWED_ORIGIN || !origin || !fromSite(req, env)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export async function handle(req: Request, env: Env, now = new Date()): Promise<Response> {
  const cors = corsHeaders(req, env);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const res = await route(req, env, now);
  for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
  return res;
}

/** Origin check and rate limit for POSTs. Returns an error response, or null to carry on. */
async function guardPost(req: Request, env: Env): Promise<Response | null> {
  if (!fromSite(req, env)) return error(403, 'Wrong origin.');
  if (env.LIMITER) {
    const { success } = await env.LIMITER.limit({ key: req.headers.get('CF-Connecting-IP') ?? 'unknown' });
    if (!success) return error(429, 'Too many requests. Try again in a minute.');
  }
  return null;
}

async function route(req: Request, env: Env, now: Date): Promise<Response> {
  const { pathname } = new URL(req.url);
  if (req.method === 'POST' && (pathname === '/api/answers' || pathname === '/api/events')) {
    const blocked = await guardPost(req, env);
    if (blocked) return blocked;
  }

  if (pathname === '/api/answers') {
    if (req.method !== 'POST') return error(405, 'Use POST.');
    const answer = parseAnswerRequest(await readJson(req));
    if (!answer) return error(400, 'Not a valid answer.');
    await env.DB.prepare(
      'INSERT INTO answers (experiment_id, version, content_version, answers, received_on) VALUES (?, ?, ?, ?, ?)',
    )
      .bind(answer.experimentId, answer.version, answer.contentVersion, JSON.stringify(answer.answers), day(now))
      .run();
    return new Response(null, { status: 204 });
  }

  if (pathname === '/api/events') {
    if (req.method !== 'POST') return error(405, 'Use POST.');
    const event = parseEventRequest(await readJson(req));
    if (!event) return error(400, 'Not a valid event.');
    await env.DB.prepare(
      'INSERT INTO events (experiment_id, type, correct, finished_in_visit, received_on) VALUES (?, ?, ?, ?, ?)',
    )
      .bind(
        event.experimentId,
        event.type,
        event.correct === undefined ? null : event.correct ? 1 : 0,
        event.finishedInVisit ?? null,
        day(now),
      )
      .run();
    return new Response(null, { status: 204 });
  }

  const stats = pathname.match(/^\/api\/stats\/([\w-]+)$/);
  if (stats) {
    if (req.method !== 'GET') return error(405, 'Use GET.');
    const id = stats[1]!;
    if (!(id in SUMMARIES)) return error(404, 'No such experiment.');
    return json(await readStats(env.DB, id), {
      headers: { 'Cache-Control': `public, max-age=${STATS_MAX_AGE}` },
    });
  }

  return error(404, 'Not found.');
}

/** The stored summary for the current content version, or an empty one if none is stored yet. */
export async function readStats(db: D1Database, experimentId: string): Promise<StatsResponse> {
  const contentVersion = CONTENT_VERSION[experimentId]!;
  const row = await db
    .prepare('SELECT body, computed_at FROM summaries WHERE experiment_id = ? AND content_version = ?')
    .bind(experimentId, contentVersion)
    .first<{ body: string; computed_at: string }>();
  const versions: ExperimentSummary = row ? JSON.parse(row.body) : summarise(experimentId, [])!;
  return { experimentId, contentVersion, live: isLive(versions), versions, computedAt: row?.computed_at ?? null };
}

/**
 * The scheduled job: deletes raw answers and events older than the retention
 * period, then recomputes every experiment's summary from the answers left.
 */
export async function refresh(db: D1Database, now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - RETENTION_MONTHS);
  await db.batch([
    db.prepare('DELETE FROM answers WHERE received_on < ?').bind(day(cutoff)),
    db.prepare('DELETE FROM events WHERE received_on < ?').bind(day(cutoff)),
  ]);

  for (const id of Object.keys(SUMMARIES)) {
    const contentVersion = CONTENT_VERSION[id]!;
    const { results } = await db
      .prepare('SELECT version, answers FROM answers WHERE experiment_id = ? AND content_version = ?')
      .bind(id, contentVersion)
      .all<{ version: string; answers: string }>();
    const plays: Play[] = results.map((r) => ({ condition: r.version, answers: JSON.parse(r.answers) }));
    await db
      .prepare(
        `INSERT INTO summaries (experiment_id, content_version, body, computed_at) VALUES (?, ?, ?, ?)
         ON CONFLICT (experiment_id) DO UPDATE SET
           content_version = excluded.content_version, body = excluded.body, computed_at = excluded.computed_at`,
      )
      .bind(id, contentVersion, JSON.stringify(summarise(id, plays)), now.toISOString())
      .run();
  }
}
