# site

Portfolio site for a series of open-source legal-AI tools. A Next.js front end
(`web/`) and a thin FastAPI service (`api/`) that will wrap the `citecheck`
engine, deployed together as one Vercel project.

This is software. It is not legal services or legal advice.

## Layout

```
web/                 Next.js 16, App Router, TypeScript (strict)
web/src/content/     MDX content, including design notes
web/src/styles/      Design tokens
api/                 FastAPI service; routing only, engine pinned in pyproject.toml
vercel.json          Vercel Services: /api/* to api, everything else to web
scripts/             One-off scripts (Stage 0 spikes)
docs/spikes/         Stage 0 spike instructions and results
.github/workflows/   CI for both services
```

## Run locally

Both together (needs the Vercel CLI):

```bash
vercel dev
```

Or separately:

```bash
cd api && uv sync && uv run uvicorn main:app --port 8000
cd web && pnpm install && API_ORIGIN=http://localhost:8000 pnpm dev
```

## Checks

```bash
cd web && pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e
cd api && uv run ruff check . && uv run ruff format --check . && uv run pytest
```

## Deploy

Import the repository into Vercel. `vercel.json` defines two services; Services
is in beta, so if the import does not detect them, set the project's framework
to "Services". After the first deploy, open `/api/health`. It should return the
engine name and version.

Fallback if Services misbehaves: deploy `api/` as a second Vercel project and
replace the `/api/(.*)` rewrite with an external rewrite to it.

## Design system

Tokens live in `web/src/styles/tokens.css`. Shared components live in
`web/src/components/ui/`. `/styleguide` shows every component and is covered
by the accessibility tests; it is not linked from navigation.
