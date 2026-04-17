# DevAtlas Platform

DevAtlas is a pnpm monorepo for the DevAtlas web app, API, shared packages, and engineering documentation.

## Quick Start

### Prerequisites

- Node.js 20+
- `pnpm` 9+
- Docker and Docker Compose
- PostgreSQL 15+

### Setup

```bash
git clone ssh://git@localhost:2222/admin/devatlas-platform.git
cd devatlas-platform
pnpm install
docker compose -f infra/docker/docker-compose.yml up -d
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm --filter @devatlas/api prisma migrate dev
pnpm dev
```

### Package Registry

This repository is currently configured to use the Iranian npm mirror in `.npmrc`:

```bash
registry=https://npm.devneeds.ir/
```

## Common Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start API and web in development mode |
| `pnpm build` | Build all workspace projects |
| `pnpm lint` | Run lint tasks across the monorepo |
| `pnpm test` | Run workspace tests |
| `pnpm typecheck` | Run TypeScript checks across the workspace |
| `pnpm health` | Run `typecheck` and `test` together |
| `pnpm generate:api-client` | Regenerate the API client package |
| `pnpm --filter @devatlas/api prisma:validate` | Validate the Prisma schema |
| `pnpm --filter @devatlas/api prisma:generate` | Generate Prisma client artifacts |

## Workspace Layout

- `apps/api` - NestJS API with Prisma and Swagger
- `apps/web` - Next.js App Router frontend
- `packages/api-client` - shared HTTP client utilities and generated client entrypoints
- `packages/config` - shared configuration package scaffolding
- `packages/content` - MDX/content loading, parsing, indexing, and validation pipeline
- `packages/types` - shared contracts and Zod schemas
- `packages/ui` - reusable UI components, tokens, and shared frontend primitives
- `packages/utils` - shared utility and API helper functions
- `docs` - architecture, roadmap, and engineering state documents
- `scripts` - repository maintenance scripts currently used by install/build flows

## Current Product Surface

- Web landing page with platform overview
- Guide listing page and guide detail route
- API modules for guides, tools, categories, tags, health, and database
- Prisma schema and migrations for content, taxonomy, relations, search, AI cache, and analytics tables
- Shared UI/component package and content indexing package

## Documentation

- `docs/ARCHITECTURE.md`
- `docs/ENGINEERING-STATE.md`
- `docs/ROADMAP.md`
- `docs/VISION.md`
- `docs/API Contract.md`
