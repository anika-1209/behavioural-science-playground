import { describe, expect, it } from 'vitest';
import { fetchStats } from './hooks';

const ok = (body: unknown) => async () => new Response(JSON.stringify(body), { status: 200 });

describe('fetchStats', () => {
  it('fetches once per experiment and returns the stats', async () => {
    let calls = 0;
    const body = { experimentId: 'exp-a1', contentVersion: 1, live: true, versions: {}, computedAt: null };
    const doFetch = (async (...args: Parameters<typeof fetch>) => {
      calls++;
      expect(args[0]).toBe('https://api.test/api/stats/exp-a1');
      expect(args[1]?.credentials).toBe('omit');
      return ok(body)();
    }) as typeof fetch;
    expect(await fetchStats('exp-a1', doFetch, 'https://api.test')).toEqual(body);
    expect(await fetchStats('exp-a1', doFetch, 'https://api.test')).toEqual(body);
    expect(calls).toBe(1);
  });

  it('returns null when the API is unreachable, errors, or answers for another experiment', async () => {
    const down = (async () => {
      throw new TypeError('Failed to fetch');
    }) as typeof fetch;
    expect(await fetchStats('exp-b1', down)).toBeNull();
    expect(await fetchStats('exp-b2', (async () => new Response('', { status: 500 })) as typeof fetch)).toBeNull();
    expect(await fetchStats('exp-b3', ok({ experimentId: 'exp-zz', live: true }) as typeof fetch)).toBeNull();
  });
});
