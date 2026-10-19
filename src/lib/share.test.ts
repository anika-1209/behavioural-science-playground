import { describe, expect, it } from 'vitest';
import { createProgressStore, type KeyValueStore } from './progress';
import { createSharer } from './share';

function memory(): KeyValueStore {
  const data = new Map<string, string>();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

function setup(respond: (url: string) => Promise<Response> = async () => new Response(null, { status: 204 })) {
  const store = createProgressStore(memory());
  const calls: { url: string; init: RequestInit; body: unknown }[] = [];
  const sharer = createSharer(
    store,
    (url, init) => {
      calls.push({ url, init, body: JSON.parse(String(init.body)) });
      return respond(url);
    },
    'https://api.test',
  );
  const tick = () => new Promise((r) => setTimeout(r, 0));
  return { store, sharer, calls, tick };
}

describe('sharing answers', () => {
  it('sends nothing until the player says yes', async () => {
    const { store, sharer, calls } = setup();
    store.complete('exp-04', 'gain', { choice: 'sure' });
    sharer.started('exp-04');
    sharer.finished('exp-04');
    await sharer.flushAnswers();
    expect(calls).toEqual([]);
  });

  it('sends nothing after no', async () => {
    const { store, sharer, calls } = setup();
    store.complete('exp-04', 'gain', { choice: 'sure' });
    store.setConsent('no', 'exp-04');
    store.complete('exp-06', null, { choice: 'city' });
    sharer.finished('exp-06');
    await sharer.flushAnswers();
    expect(calls).toEqual([]);
  });

  it('sends the experiment just finished after yes, once', async () => {
    const { store, sharer, calls } = setup();
    store.complete('exp-04', 'gain', { choice: 'sure' });
    store.setConsent('yes', 'exp-04');
    await sharer.flushAnswers();
    await sharer.flushAnswers();
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe('https://api.test/api/answers');
    expect(calls[0]!.init.credentials).toBe('omit');
    expect(calls[0]!.body).toEqual({ experimentId: 'exp-04', version: 'gain', contentVersion: 1, answers: { choice: 'sure' } });
    expect(store.getState().sent).toEqual(['exp-04']);
  });

  it('sends experiments with no versions as "all"', async () => {
    const { store, sharer, calls } = setup();
    store.setConsent('yes');
    store.complete('exp-06', null, { choice: 'cabin' });
    await sharer.flushAnswers();
    expect(calls[0]!.body).toMatchObject({ experimentId: 'exp-06', version: 'all' });
  });

  it('never sends a replay', async () => {
    const { store, sharer, calls } = setup();
    store.complete('exp-04', 'gain', { choice: 'sure' });
    store.setConsent('yes');
    store.complete('exp-04', 'gain', { choice: 'gamble' });
    await sharer.flushAnswers();
    expect(calls).toEqual([]);
  });

  it('keeps an answer for later when offline', async () => {
    let online = false;
    const { store, sharer, calls } = setup(async () => {
      if (!online) throw new TypeError('Failed to fetch');
      return new Response(null, { status: 204 });
    });
    store.setConsent('yes');
    store.complete('exp-04', 'gain', { choice: 'sure' });
    await sharer.flushAnswers();
    expect(store.getState().sent).toEqual([]);
    online = true;
    await sharer.flushAnswers();
    expect(store.getState().sent).toEqual(['exp-04']);
    expect(calls).toHaveLength(2);
  });

  it('stops retrying an answer the API rejects, but retries server errors', async () => {
    let status = 500;
    const { store, sharer } = setup(async () => new Response(null, { status }));
    store.setConsent('yes');
    store.complete('exp-04', 'gain', { choice: 'sure' });
    await sharer.flushAnswers();
    expect(store.getState().sent).toEqual([]);
    status = 400;
    await sharer.flushAnswers();
    expect(store.getState().sent).toEqual(['exp-04']);
  });
});

describe('usage events', () => {
  it('sends each event type after yes', async () => {
    const { store, sharer, calls, tick } = setup();
    store.setConsent('yes');
    sharer.started('exp-01');
    sharer.finished('exp-01');
    sharer.finished('exp-02');
    sharer.debriefRead('exp-01');
    sharer.debriefRead('exp-01'); // once per visit
    sharer.quizAnswered('exp-01', true);
    await tick();
    expect(calls.map((c) => [c.url, c.body])).toEqual([
      ['https://api.test/api/events', { experimentId: 'exp-01', type: 'started' }],
      ['https://api.test/api/events', { experimentId: 'exp-01', type: 'finished', finishedInVisit: 1 }],
      ['https://api.test/api/events', { experimentId: 'exp-02', type: 'finished', finishedInVisit: 2 }],
      ['https://api.test/api/events', { experimentId: 'exp-01', type: 'debrief-read' }],
      ['https://api.test/api/events', { experimentId: 'exp-01', type: 'quiz-answered', correct: true }],
    ]);
  });

  it('counts finishes in the visit even before yes', async () => {
    const { store, sharer, calls, tick } = setup();
    sharer.finished('exp-01');
    store.setConsent('yes');
    sharer.finished('exp-02');
    await tick();
    expect(calls.map((c) => c.body)).toEqual([{ experimentId: 'exp-02', type: 'finished', finishedInVisit: 2 }]);
  });

  it('ignores failed events', async () => {
    const { store, sharer, tick } = setup(async () => {
      throw new TypeError('Failed to fetch');
    });
    store.setConsent('yes');
    expect(() => sharer.started('exp-01')).not.toThrow();
    await tick();
  });
});

describe('events from before the consent question is answered', () => {
  it('a yes sends the held events for the experiment it covers, and drops the rest', async () => {
    const { store, sharer, calls, tick } = setup();
    sharer.started('exp-01'); // quit without finishing
    sharer.started('exp-04');
    sharer.finished('exp-04');
    store.complete('exp-04', 'gain', { choice: 'sure' });
    await tick();
    expect(calls).toEqual([]); // nothing leaves the browser before the answer
    store.setConsent('yes', 'exp-04');
    sharer.consentChanged('exp-04');
    await tick();
    expect(calls.map((c) => c.body)).toEqual([
      { experimentId: 'exp-04', type: 'started' },
      { experimentId: 'exp-04', type: 'finished', finishedInVisit: 1 },
      { experimentId: 'exp-04', version: 'gain', contentVersion: 1, answers: { choice: 'sure' } },
    ]);
  });

  it('a no drops them', async () => {
    const { store, sharer, calls, tick } = setup();
    sharer.started('exp-04');
    store.setConsent('no', 'exp-04');
    sharer.consentChanged('exp-04');
    store.setConsent('yes');
    sharer.consentChanged();
    await tick();
    expect(calls).toEqual([]);
  });

  it('a yes from Settings drops them, since it covers only later plays', async () => {
    const { store, sharer, calls, tick } = setup();
    sharer.started('exp-04');
    store.setConsent('yes');
    sharer.consentChanged();
    await tick();
    expect(calls).toEqual([]);
  });

  it('holds nothing once the player has said no', async () => {
    const { store, sharer, calls, tick } = setup();
    store.setConsent('no');
    sharer.started('exp-04');
    store.setConsent('yes', 'exp-04');
    sharer.consentChanged('exp-04');
    await tick();
    expect(calls).toEqual([]);
  });
});

describe('debrief-opened', () => {
  it('is sent once per experiment per visit, like debrief-read', async () => {
    const { store, sharer, calls, tick } = setup();
    store.setConsent('yes');
    sharer.debriefOpened('exp-03');
    sharer.debriefOpened('exp-03');
    await tick();
    expect(calls.map((c) => c.body)).toEqual([{ experimentId: 'exp-03', type: 'debrief-opened' }]);
  });
});
