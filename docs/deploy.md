# Deploying the playground

The site runs on Cloudflare Pages and the API on a Cloudflare Worker with a D1 database, both on Cloudflare's free addresses:

- Site: `https://<project>.pages.dev`
- API: `https://bsp-api.<your-subdomain>.workers.dev`

The site and the API are on different addresses, so each needs to know the other's:

- The site is built with the API's address (`VITE_API_BASE`).
- The API only accepts answers and events sent from the site's address (`ALLOWED_ORIGIN` in [wrangler.toml](../wrangler.toml)).

Nothing in these steps is secret. The repository is public, and the D1 database id and both addresses are safe to commit.

## First deploy

You need a Cloudflare account. All commands run from the repository root.

1. **Sign in to Cloudflare from the terminal.**

   ```bash
   npx wrangler login
   ```

2. **Create the database.**

   ```bash
   npx wrangler d1 create bsp
   ```

   Copy the `database_id` it prints into [wrangler.toml](../wrangler.toml), replacing the row of zeros.

3. **Choose the site's address.** The Pages project name becomes the address: a project called `bsp` is served at `https://bsp.pages.dev`. Check the name is free by starting to create the project in step 5. If it's taken, Cloudflare suggests another.

   Put the address in `ALLOWED_ORIGIN` in [wrangler.toml](../wrangler.toml), replacing `https://REPLACE-ME.pages.dev`. Use no trailing slash.

4. **Deploy the API.**

   ```bash
   npm run deploy:api
   ```

   This creates the tables, then deploys the Worker. It prints the API's address, for example `https://bsp-api.yourname.workers.dev`. Check it answers:

   ```bash
   curl https://bsp-api.yourname.workers.dev/api/stats/exp-01
   ```

   You should see `"live":false` and empty counts.

5. **Create the site.** In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**. Pick this repository, then set:

   | Setting | Value |
   | --- | --- |
   | Project name | the name from step 3 |
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable | `VITE_API_BASE` = the API address from step 4, with no trailing slash |

   The build picks up the Node version from [.nvmrc](../.nvmrc). Unknown paths such as `/play/exp-01` serve `index.html`, because the build has no `404.html`, so the app's routing works.

6. **Commit** the `wrangler.toml` changes from steps 2 and 3, and push.

## Check it works

1. Open the site in a private window. Play one experiment and answer **Yes** to "Add your anonymous answers to the totals?".
2. Check the answer and events arrived:

   ```bash
   npx wrangler d1 execute bsp --remote --command "SELECT experiment_id, version, received_on FROM answers"
   npx wrangler d1 execute bsp --remote --command "SELECT type, COUNT(*) FROM events GROUP BY type"
   ```

3. Within 15 minutes, `/api/stats/<id>` for that experiment shows a count of 1. The live panel stays hidden until every version of the experiment has 50 plays.

If nothing arrives, open the browser's developer tools and look at the Network tab:

| What you see | Cause |
| --- | --- |
| A 403 on `/api/answers` | `ALLOWED_ORIGIN` doesn't exactly match the site's address. |
| A CORS error | Same cause as a 403. |
| Requests going to the site's own `/api/...` | `VITE_API_BASE` wasn't set when the site was built. Set it and redeploy. |

## After that

- **Site changes** deploy automatically when you push to `main`.
- **Pull request previews.** Pages builds previews at addresses like `<hash>.bsp.pages.dev`. Those addresses aren't `ALLOWED_ORIGIN`, so sharing answers doesn't work in previews. That's deliberate, so test plays never reach the totals.
- **API changes,** including new files in [worker/migrations/](../worker/migrations/), deploy with `npm run deploy:api`. It applies any new migrations first.
- **Changing an experiment's questions, options or study figures:** bump its number in `CONTENT_VERSION` ([shared/api.ts](../shared/api.ts)), then deploy both the site and the API. The API then counts that experiment from zero.
- **Tests** run on every push via GitHub Actions ([.github/workflows/ci.yml](../.github/workflows/ci.yml)). The workflow checks that the Worker bundles but doesn't deploy it.

## What protects the API

The free addresses don't offer Cloudflare's dashboard firewall or bot rules, so the Worker protects itself:

- **Format checks.** Each answer must match exactly what that experiment's screen submits. Requests must be JSON and under 4 KB.
- **Origin check.** Answers and events must come from `ALLOWED_ORIGIN`. This stops casual misuse from other websites, but not someone scripting requests directly.
- **Rate limit.** At most 30 answers and events a minute from each IP address. Cloudflare counts this in memory only. The IP is never stored in the database or logged: request logging is off in [wrangler.toml](../wrangler.toml).

Someone determined could still send fake answers within those limits. If that becomes a problem, the next steps are Cloudflare Turnstile, or moving to a domain of your own and using Cloudflare's bot rules.
