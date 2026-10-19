# Behavioural Science Playground

Learn cognitive biases by experiencing them first: each bias is a short interactive experiment, and the explanation is revealed only afterwards. The full product spec is in [docs/spec.md](docs/spec.md).

**Status:** v1 content complete. The primer, hub, settings and module flow are built. All ten launch biases are playable, `exp-01` to `exp-10`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest)
npm run build      # typecheck + production build + bias-name leak check
npm run dev:api    # the v1.5 API on http://localhost:8787, with a local database; `npm run dev` forwards /api to it
```

Stack: Vite, React 19, TypeScript, React Router. Progress lives in the browser's localStorage. The v1.5 API (anonymous totals, only for players who say yes) is a Cloudflare Worker with a D1 database; see "The API" below.

## Where the spec lives in the code

| Spec | Code |
| --- | --- |
| Feature 1: primer (P1-1 to P1-5) | [src/pages/Primer.tsx](src/pages/Primer.tsx), cards in [src/content/primer.ts](src/content/primer.ts) |
| First visit → primer, return visit → hub | `Home` in [src/App.tsx](src/App.tsx) |
| Feature 2: hub, filters, sort, "Surprise me" (P2-1 to P2-5) | [src/pages/Hub.tsx](src/pages/Hub.tsx), [src/components/BiasCard.tsx](src/components/BiasCard.tsx), [src/lib/hub.ts](src/lib/hub.ts) |
| Feature 3: intro → experiment → result → debrief | [src/pages/ModulePage.tsx](src/pages/ModulePage.tsx) |
| Fixed debrief structure | [src/components/DebriefView.tsx](src/components/DebriefView.tsx) |
| Content model | [src/content/types.ts](src/content/types.ts) |
| Launch catalogue (teasers) | [src/content/modules.ts](src/content/modules.ts) |
| Local, anonymous progress; condition assignment; reset | [src/lib/progress.ts](src/lib/progress.ts) |
| Settings: show bias names, extend time, reset | [src/pages/Settings.tsx](src/pages/Settings.tsx) |
| Each experiment's rules and result logic (shared with the v1.5 API) | `shared/experiments/<name>/logic.ts` |
| "How others answered" summaries, per experiment (v1.5) | [shared/summaries.ts](shared/summaries.ts) |
| Consent to share anonymous answers (v1.5): asked after the first result, changed in Settings | [src/components/ConsentPrompt.tsx](src/components/ConsentPrompt.tsx), `consent`, `played`, `sent` and `share` in [src/lib/progress.ts](src/lib/progress.ts) |
| Privacy notice | [src/pages/Privacy.tsx](src/pages/Privacy.tsx) (`/privacy`) |
| Sending answers and usage events, only after a yes | [src/lib/share.ts](src/lib/share.ts) |
| API requests, content versions and answer checks | [shared/api.ts](shared/api.ts), [shared/validate.ts](shared/validate.ts) |
| The API and the scheduled summary job | [worker/api.ts](worker/api.ts), schema in [worker/migrations/](worker/migrations/) |
| "How players here answered" panel on the result and debrief screens, once live | [src/components/OthersPanel.tsx](src/components/OthersPanel.tsx), each experiment's `live.ts` |

### How the bias name stays hidden (P3-1)

- URLs use opaque ids (`/play/exp-01`) and tab titles use the teaser title.
- Teaser data and debriefs are separate files. Each debrief in `src/content/debriefs/` is loaded with a dynamic import, so it is its own chunk, fetched only when the user reaches the debrief.
- `npm run build` ends with [scripts/check-leak.mjs](scripts/check-leak.mjs), which fails the build if any bias name appears in `index.html` or the entry bundle.
- Tests also check that no teaser, intro or primer text contains a built bias's name.

## The API

A Cloudflare Worker ([worker/](worker/), configured in [wrangler.toml](wrangler.toml)) with a D1 database:

- `POST /api/answers` stores one player's first play of an experiment. It must match that experiment's format exactly ([shared/validate.ts](shared/validate.ts)), or it gets a 400.
- `POST /api/events` stores one usage event: `started`, `finished`, `debrief-opened`, `debrief-read` or `quiz-answered`. The app holds events from before the consent question is answered in memory only, and sends them only on a yes for that experiment.
- `GET /api/stats/:experimentId` returns each version's summary and play count, cached for 5 minutes. `live` turns true once every version has 50 plays.
- Every 15 minutes, a scheduled job deletes answers and events older than 12 months and recomputes the summaries.

Rows store only the day they arrived: no IP, no device or session ID. When you change an experiment's questions, options or study figures, bump its number in `CONTENT_VERSION` ([shared/api.ts](shared/api.ts)) so the count starts fresh.

The API tests run the real migrations against Node's built-in SQLite ([worker/testDb.ts](worker/testDb.ts)), so they need no Cloudflare account.

## Adding a bias

Each bias needs three things. `exp-01` is the worked example.

1. **Experiment** in `src/experiments/<name>/`: a `Task` component (calls `onComplete(answers)` once, on submit), a `Result` component for the reveal, and a `whatHappened(condition, answers)` function. None of these may name the bias. Register it in [src/experiments/registry.ts](src/experiments/registry.ts).
   - Rules, stimuli and result logic go in `shared/experiments/<name>/logic.ts`, with no React or browser code, because the API imports it too. Add the experiment's summary to [shared/summaries.ts](shared/summaries.ts), its answer format to [shared/validate.ts](shared/validate.ts), its content version to [shared/api.ts](shared/api.ts), and a `live.ts` that turns its summary into labelled bars for the live panel.
2. **Debrief** in `src/content/debriefs/exp-NN.ts`, typed as `Debrief`. Add its loader line in [src/content/debriefs/index.ts](src/content/debriefs/index.ts).
3. **Module**: set its entry in [src/content/modules.ts](src/content/modules.ts) to `status: 'ready'`.

Then run `npm test && npm run build`. The content tests check that every ready module has an experiment and a complete debrief, and that its name doesn't leak.

## Before launch

- Study details and figures in the debriefs come from general knowledge and need expert review against the original papers (P3-6).
- Open questions from the spec (platform, reviewer, classroom mode, languages) are still open.
- Hosting: the app uses browser routing, so the host must serve `index.html` for unknown paths (a single-page-app fallback).
