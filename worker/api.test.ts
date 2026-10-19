import { describe, expect, it } from 'vitest';
import { handle, readStats, refresh, type Env } from './api';
import { testDb } from './testDb';
import { CONTENT_VERSION, MAX_BODY } from '../shared/api';
import { LIVE_MIN } from '../shared/summaries';

const NOW = new Date('2026-10-19T12:00:00Z');

function setup(extra: Partial<Env> = {}) {
  const { d1, raw } = testDb();
  const env: Env = { DB: d1, ...extra };
  const call = (path: string, init: RequestInit = {}) => handle(new Request(`https://bsp.test${path}`, init), env, NOW);
  const post = (path: string, body: unknown, headers: Record<string, string> = {}) =>
    call(path, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...headers } });
  return { env, raw, call, post };
}

const answer = (choice: 'sure' | 'gamble', version = 'gain') => ({
  experimentId: 'exp-04',
  version,
  contentVersion: CONTENT_VERSION['exp-04'],
  answers: { choice },
});

describe('POST /api/answers', () => {
  it('stores a valid answer with only the day it arrived', async () => {
    const { post, raw } = setup();
    const res = await post('/api/answers', answer('sure'));
    expect(res.status).toBe(204);
    expect(raw.prepare('SELECT * FROM answers').all()).toEqual([
      { id: 1, experiment_id: 'exp-04', version: 'gain', content_version: 1, answers: '{"choice":"sure"}', received_on: '2026-10-19' },
    ]);
  });

  it('rejects invalid answers and stores nothing', async () => {
    const { post, call, raw } = setup();
    expect((await post('/api/answers', { ...answer('sure'), answers: { choice: 'maybe' } })).status).toBe(400);
    expect((await call('/api/answers', { method: 'POST', body: 'not json', headers: { 'Content-Type': 'application/json' } })).status).toBe(400);
    expect((await call('/api/answers', { method: 'POST', body: JSON.stringify(answer('sure')) })).status).toBe(400); // not sent as JSON
    expect((await post('/api/answers', { ...answer('sure'), pad: 'x'.repeat(MAX_BODY) })).status).toBe(400);
    expect((await call('/api/answers')).status).toBe(405);
    expect(raw.prepare('SELECT COUNT(*) AS n FROM answers').get()).toEqual({ n: 0 });
  });
});

describe('POST /api/events', () => {
  it('stores each event type', async () => {
    const { post, raw } = setup();
    for (const e of [
      { experimentId: 'exp-01', type: 'started' },
      { experimentId: 'exp-01', type: 'finished', finishedInVisit: 3 },
      { experimentId: 'exp-01', type: 'debrief-opened' },
      { experimentId: 'exp-01', type: 'debrief-read' },
      { experimentId: 'exp-01', type: 'quiz-answered', correct: true },
    ]) {
      expect((await post('/api/events', e)).status).toBe(204);
    }
    expect(raw.prepare('SELECT type, correct, finished_in_visit FROM events ORDER BY id').all()).toEqual([
      { type: 'started', correct: null, finished_in_visit: null },
      { type: 'finished', correct: null, finished_in_visit: 3 },
      { type: 'debrief-opened', correct: null, finished_in_visit: null },
      { type: 'debrief-read', correct: null, finished_in_visit: null },
      { type: 'quiz-answered', correct: 1, finished_in_visit: null },
    ]);
  });

  it('rejects invalid events', async () => {
    const { post } = setup();
    expect((await post('/api/events', { experimentId: 'exp-01', type: 'started', ip: '1.2.3.4' })).status).toBe(400);
  });
});

describe('GET /api/stats/:experimentId', () => {
  it('returns an empty summary before the first refresh', async () => {
    const { call } = setup();
    const res = await call('/api/stats/exp-04');
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=300');
    expect(await res.json()).toEqual({
      experimentId: 'exp-04',
      contentVersion: 1,
      live: false,
      versions: { gain: { n: 0, values: { sureShare: null } }, loss: { n: 0, values: { sureShare: null } } },
      computedAt: null,
    });
  });

  it('serves the summary the scheduled job computed', async () => {
    const { post, call, env } = setup();
    await post('/api/answers', answer('sure'));
    await post('/api/answers', answer('gamble'));
    await post('/api/answers', answer('gamble', 'loss'));
    expect((await (await call('/api/stats/exp-04')).json()).versions.gain.n).toBe(0); // not recomputed per request
    await refresh(env.DB, NOW);
    const body = await (await call('/api/stats/exp-04')).json();
    expect(body.versions).toEqual({ gain: { n: 2, values: { sureShare: 50 } }, loss: { n: 1, values: { sureShare: 0 } } });
    expect(body.computedAt).toBe(NOW.toISOString());
  });

  it('turns live once every version has enough answers', async () => {
    const { raw, env } = setup();
    const insert = raw.prepare("INSERT INTO answers (experiment_id, version, content_version, answers, received_on) VALUES ('exp-04', ?, 1, '{\"choice\":\"sure\"}', '2026-10-19')");
    for (let i = 0; i < LIVE_MIN; i++) insert.run('gain');
    for (let i = 0; i < LIVE_MIN - 1; i++) insert.run('loss');
    await refresh(env.DB, NOW);
    expect((await readStats(env.DB, 'exp-04')).live).toBe(false);
    insert.run('loss');
    await refresh(env.DB, NOW);
    expect((await readStats(env.DB, 'exp-04')).live).toBe(true);
  });

  it('404s for unknown experiments and paths', async () => {
    const { call } = setup();
    expect((await call('/api/stats/exp-99')).status).toBe(404);
    expect((await call('/api/nothing')).status).toBe(404);
  });
});

describe('scheduled refresh', () => {
  it('deletes answers and events older than 12 months, and ignores old content versions', async () => {
    const { raw, env } = setup();
    raw.exec(`
      INSERT INTO answers (experiment_id, version, content_version, answers, received_on) VALUES
        ('exp-04', 'gain', 1, '{"choice":"sure"}', '2025-10-18'),
        ('exp-04', 'gain', 1, '{"choice":"sure"}', '2025-10-19'),
        ('exp-04', 'gain', 0, '{"choice":"gamble"}', '2026-01-01');
      INSERT INTO events (experiment_id, type, received_on) VALUES ('exp-04', 'started', '2025-10-18'), ('exp-04', 'started', '2026-10-19');
    `);
    await refresh(env.DB, NOW);
    expect(raw.prepare('SELECT received_on FROM answers ORDER BY id').all()).toEqual([
      { received_on: '2025-10-19' },
      { received_on: '2026-01-01' },
    ]);
    expect(raw.prepare('SELECT COUNT(*) AS n FROM events').get()).toEqual({ n: 1 });
    expect((await readStats(env.DB, 'exp-04')).versions.gain).toEqual({ n: 1, values: { sureShare: 100 } });
  });
});

describe('CORS', () => {
  it('allows only the configured origin', async () => {
    const { call } = setup({ ALLOWED_ORIGIN: 'https://play.example' });
    const ok = await call('/api/stats/exp-01', { headers: { Origin: 'https://play.example' } });
    expect(ok.headers.get('Access-Control-Allow-Origin')).toBe('https://play.example');
    const other = await call('/api/stats/exp-01', { headers: { Origin: 'https://evil.example' } });
    expect(other.headers.get('Access-Control-Allow-Origin')).toBeNull();
    const pre = await call('/api/answers', { method: 'OPTIONS', headers: { Origin: 'https://play.example' } });
    expect(pre.status).toBe(204);
  });

  it('sends no CORS headers when the API shares the site origin', async () => {
    const { call } = setup();
    const res = await call('/api/stats/exp-01', { headers: { Origin: 'https://play.example' } });
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
});
