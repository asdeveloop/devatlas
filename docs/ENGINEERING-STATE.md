# Engineering State

Last Updated: 2026-04-15

This document tracks the real current state of the repository after removal of the in-repo AI agent package.

## Repository Snapshot

- monorepo manager: pnpm workspaces + Turborepo
- active apps: `apps/api`, `apps/web`
- active shared packages: `api-client`, `config`, `content`, `types`, `ui`, `utils`
- package registry: `https://npm.devneeds.ir/`
- in-repo AI agent package: removed

## Web Application

Location: `apps/web`

Current state:

- Next.js App Router project is present and wired
- landing page is active at `/`
- guide listing page is active at `/guides`
- guide detail route is active at `/guides/[slug]`
- feature folders exist for `guides`, `home`, `navigation`, `search`, and `tools`
- API request helpers exist in `apps/web/lib/api.ts` and feature-level `api/` modules

Current concerns:

- dependency declarations had drifted from the lockfile and were realigned during cleanup
- search is only partially represented in the frontend as hook scaffolding, not a full search product surface

## API Application

Location: `apps/api`

Current state:

- NestJS app boots with config validation, CORS, versioning, Swagger, interceptors, and exception filter
- active modules: `database`, `health`, `guides`, `tools`, `categories`, `tags`
- request/response DTO infrastructure is established
- repository/service/controller separation exists across domain modules
- Prisma integration is active

Current concerns:

- the schema already includes forward-looking AI, analytics, and relation tables, but not all of them are necessarily surfaced through active endpoints yet
- no dedicated search module exists in the API module tree yet

## Database State

Location: `apps/api/prisma/schema.prisma`

Current state:

- Prisma schema includes content, taxonomy, junction, relation, search, AI cache, and analytics models
- migrations exist under `apps/api/prisma/migrations`
- `Guide` and `Tool` include richer status/metadata fields than the older docs previously reflected

Operational notes:

- Prisma engine preparation is handled by `scripts/prepare-prisma-engines.mjs`
- schema validation/generation scripts live in `apps/api/package.json`

## Shared Packages

### `packages/content`

Current state:

- contains MDX loader, parser, validator, indexer, and pipeline layers
- has dedicated tests for loading, parsing, schemas, indexing, and pipeline behavior

### `packages/ui`

Current state:

- large reusable component library exists
- contains shared theme tokens, hooks, and monitoring/analytics-related frontend helpers
- dependency surface is broad and still produces peer dependency warnings during install

### `packages/types`

Current state:

- shared API, content, database, and validation contracts exist
- both `.ts` and generated `.js` files are present in source folders

### `packages/utils`

Current state:

- minimal shared API helper/fetcher utilities exist
- package is active but still relatively small compared with `ui` and `content`

### `packages/api-client`

Current state:

- base HTTP client exists
- generation entrypoints are wired from the workspace root script

### `packages/config`

Current state:

- package scaffold exists
- currently lightweight compared with other shared packages

## Infrastructure and CI

### Local infrastructure

- Docker Compose assets exist under `infra/docker`
- project expects PostgreSQL for the API
- Redis remains part of the platform/infrastructure picture

### CI

Location: `.github/workflows/ci.yml`

Current pipeline runs:

- dependency installation
- `pnpm health`
- `pnpm test`
- `pnpm validate:phase1`

Current concern:

- CI uses `pnpm install --frozen-lockfile`, so dependency/version drift must be kept tightly controlled

## Documentation State

Current primary docs:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/ENGINEERING-STATE.md`
- `docs/ROADMAP.md`
- `docs/VISION.md`
- `docs/API Contract.md`

Cleanup completed:

- `docs/AI-AGENT.md` removed
- `docs/DevAtlas_AI_Agent_Execution_Plan.md` removed
- all known `ai-agent`, `aider`, and `ollama` references removed from tracked docs and config

## Immediate Engineering Reality

The project has a usable foundation across web, API, Prisma, UI, and content indexing. The biggest practical risks now are not missing scaffolding but alignment:

- keeping docs synchronized with implemented modules and routes
- keeping package manifests aligned with the lockfile and selected npm mirror
- deciding which schema elements are truly active product scope versus reserved future scope
