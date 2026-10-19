import { handle, refresh, type Env } from './api';

// Cloudflare Worker entry: the API, with stats responses cached at the edge,
// and the scheduled job that recomputes summaries (spec, "Backend: API").
export default {
  async fetch(req, env, ctx) {
    const isStats = req.method === 'GET' && new URL(req.url).pathname.startsWith('/api/stats/');
    if (!isStats) return handle(req, env);

    const cache = caches.default;
    const hit = await cache.match(req);
    if (hit) return hit;
    const res = await handle(req, env);
    if (res.ok) ctx.waitUntil(cache.put(req, res.clone()));
    return res;
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(refresh(env.DB));
  },
} satisfies ExportedHandler<Env>;
