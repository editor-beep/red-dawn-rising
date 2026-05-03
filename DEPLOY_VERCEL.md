# Deploying Red Dawn Rising to Vercel

The game is a pure static React + Vite build. The repo root contains a
`vercel.json` that tells Vercel exactly what to build and serve.

## One-time setup

1. Push this repo to GitHub (or GitLab / Bitbucket).
2. Go to https://vercel.com/new and import the repo.
3. **Do not change any of the framework / build settings in the Vercel UI.**
   Leave them blank — `vercel.json` controls everything.
4. Click **Deploy**.

That's it. Vercel will:

- Detect pnpm from `pnpm-lock.yaml`
- Run `pnpm install --frozen-lockfile`
- Build only the `@workspace/red-dawn-rising` artifact
- Serve `artifacts/red-dawn-rising/dist/public/` as the site root
- Rewrite all non-asset paths to `index.html` so client-side routing works

## What about the other artifacts?

The `api-server` and `mockup-sandbox` artifacts are dev-only and are
excluded via `.vercelignore`. The game is frontend-only and does not
need a backend.

## Environment variables

None required. `vercel.json` hardcodes the two build-time env vars
(`BASE_PATH=/` and `PORT=3000`) that the Vite config expects.

## Custom domain

Once deployed, add your domain in **Project Settings → Domains** in the
Vercel dashboard. No code changes needed.
