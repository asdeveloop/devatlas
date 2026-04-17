# DevAtlas Architecture

## Overview

DevAtlas is a pnpm monorepo with two runtime applications and several shared packages.

- `apps/web` serves the public Next.js frontend
- `apps/api` serves the NestJS REST API
- `packages/*` contains reusable UI, types, content, config, utility, and API client code
- `infra/docker` contains the local infrastructure stack

## Current Tech Stack

| Layer | Current Technology | Notes |
|---|---|---|
| Frontend | Next.js 16.1.6, React 19.2.4 | App Router project in `apps/web` |
| Backend | NestJS 11 | REST API in `apps/api` |
| Data access | Prisma 6 | PostgreSQL datasource |
| Database | PostgreSQL 15+ | Local dev via Docker Compose |
| Caching / infra | Redis | Included in local infra plan |
| Styling | Tailwind CSS 3.4.17 | Web app uses Tailwind + shared UI package |
| Docs / API spec | Swagger | Mounted from NestJS at `/docs` |
| Monorepo | pnpm + Turborepo | Workspace orchestration |
| Testing | Vitest | Shared test runner across packages |

## Repository Layout

```text
devatlas-platform/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── common/
│   │       ├── config/
│   │       ├── main.ts
│   │       └── modules/
│   │           ├── categories/
│   │           ├── database/
│   │           ├── guides/
│   │           ├── health/
│   │           ├── tags/
│   │           └── tools/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── features/
│       │   ├── guides/
│       │   ├── home/
│       │   ├── navigation/
│       │   ├── search/
│       │   └── tools/
│       ├── hooks/
│       └── lib/
├── packages/
│   ├── api-client/
│   ├── config/
│   ├── content/
│   ├── types/
│   ├── ui/
│   └── utils/
├── docs/
├── infra/
└── scripts/
```

## Backend Architecture

### API bootstrap

`apps/api/src/main.ts` configures:

- URI versioning with default version `v1`
- global `/api` prefix
- CORS enabled for open development access
- global validation pipe with whitelist and transform
- Swagger document generation
- request logging interceptor
- response transform interceptor
- HTTP exception filter

### Active NestJS modules

| Module | Status | Responsibility |
|---|---|---|
| `database` | active | Prisma connection lifecycle |
| `health` | active | health endpoint |
| `guides` | active | guide CRUD, queries, mapping |
| `tools` | active | tool CRUD and list/query flows |
| `categories` | active | category CRUD and filtering |
| `tags` | active | tag CRUD and filtering |

### API conventions in codebase

- DTO-first request and response modeling under `apps/api/src/common/dto` and module `dto/` folders
- centralized error codes and domain errors under `apps/api/src/common/errors`
- consistent response envelope via `TransformInterceptor`
- trace id support via `apps/api/src/common/http/trace-id.ts`
- Prisma repositories per module for data access

## Frontend Architecture

### Current route surface

| Route | Source | Status |
|---|---|---|
| `/` | `apps/web/app/page.tsx` | active |
| `/guides` | `apps/web/app/guides/page.tsx` | active |
| `/guides/[slug]` | `apps/web/app/guides/[slug]/page.tsx` | active |

### Feature organization

`apps/web/features` is split by product area:

- `home` for landing content
- `navigation` for site chrome
- `guides` for list/detail pages and API adapters
- `tools` for API data access used on the landing page
- `search` for query hook scaffolding

### Frontend data flow

- `apps/web/lib/api.ts` contains API request plumbing
- feature-level `api/` modules fetch from the backend
- page files delegate to feature modules where possible
- shared presentational primitives live in `packages/ui`

## Shared Packages

| Package | Current Role |
|---|---|
| `@devatlas/api-client` | shared HTTP client and generated API entrypoints scaffold |
| `@devatlas/config` | shared config package scaffold |
| `@devatlas/content` | MDX loading, parsing, validation, indexing, and pipeline orchestration |
| `@devatlas/types` | shared domain contracts and Zod validation schemas |
| `@devatlas/ui` | reusable component library, tokens, hooks, and shared UI primitives |
| `@devatlas/utils` | shared fetch/api helpers and utility exports |

## Database Architecture

The Prisma schema currently includes both implemented and forward-looking tables.

### Content and taxonomy

- `Category`
- `Tag`
- `Guide`
- `Tool`
- `GuideTag`
- `ToolTag`

### Additional schema already present

- `ContentRelation`
- `SearchDocument`
- `AiSummary`
- `AiAnswer`
- `SearchQuery`
- `ContentView`

### Key enums already defined

- `Difficulty`
- `ContentStatus`
- `ToolTier`
- `ToolPrice`
- `ToolStatus`
- `EntityType`
- `RelationType`

## Build and Workspace Conventions

- root orchestration uses `turbo.json`
- install-time Prisma engine preparation runs from `scripts/prepare-prisma-engines.mjs`
- web build links Next.js ESLint integration via `scripts/link-next-eslint.mjs`
- package registry is pinned in `.npmrc` to `https://npm.devneeds.ir/`

## Current Constraints

- the lockfile and workspace are currently aligned to the Iranian npm mirror
- some package peer dependency warnings remain in the UI stack and should be handled deliberately, not silently ignored in product planning
- the project still mixes “current implementation” and “planned schema” in Prisma and docs, so execution work should keep implementation status explicit
