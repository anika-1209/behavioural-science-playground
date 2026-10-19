# Behavioural Science Playground

Learn cognitive biases by experiencing them first: each bias is a short interactive experiment, and the explanation is revealed only afterwards. The full product spec is in [docs/spec.md](docs/spec.md).

**Status:** v1 content complete. The primer, hub, settings and module flow are built. All ten launch biases are playable, `exp-01` to `exp-10`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest)
npm run build      # typecheck + production build + bias-name leak check
```

Stack: Vite, React 19, TypeScript, React Router. No backend; progress lives in the browser's localStorage.

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

### How the bias name stays hidden (P3-1)

- URLs use opaque ids (`/play/exp-01`) and tab titles use the teaser title.
- Teaser data and debriefs are separate files. Each debrief in `src/content/debriefs/` is loaded with a dynamic import, so it is its own chunk, fetched only when the user reaches the debrief.
- `npm run build` ends with [scripts/check-leak.mjs](scripts/check-leak.mjs), which fails the build if any bias name appears in `index.html` or the entry bundle.
- Tests also check that no teaser, intro or primer text contains a built bias's name.

## Adding a bias

Each bias needs three things. `exp-01` is the worked example.

1. **Experiment** in `src/experiments/<name>/`: a `Task` component (calls `onComplete(answers)` once, on submit), a `Result` component for the reveal, and a `whatHappened(condition, answers)` function. None of these may name the bias. Register it in [src/experiments/registry.ts](src/experiments/registry.ts).
   - Rules, stimuli and result logic go in `shared/experiments/<name>/logic.ts`, with no React or browser code, because the API imports it too. Add the experiment's summary to [shared/summaries.ts](shared/summaries.ts).
2. **Debrief** in `src/content/debriefs/exp-NN.ts`, typed as `Debrief`. Add its loader line in [src/content/debriefs/index.ts](src/content/debriefs/index.ts).
3. **Module**: set its entry in [src/content/modules.ts](src/content/modules.ts) to `status: 'ready'`.

Then run `npm test && npm run build`. The content tests check that every ready module has an experiment and a complete debrief, and that its name doesn't leak.

## Before launch

- Study details and figures in the debriefs come from general knowledge and need expert review against the original papers (P3-6).
- Open questions from the spec (platform, reviewer, classroom mode, languages) are still open.
- Hosting: the app uses browser routing, so the host must serve `index.html` for unknown paths (a single-page-app fallback).
