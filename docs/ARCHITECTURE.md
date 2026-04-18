# DevAtlas Architecture

> Last updated: 1405/01/29 (2026-04-18)

## Overview

DevAtlas is a pnpm monorepo with two runtime applications and several shared packages.

- `apps/web` — public Next.js frontend
- `apps/api` — NestJS REST API
- `packages/*` — reusable UI, types, content, config, utility, and API client code
- `infra/docker` — local infrastructure stack (PostgreSQL, Redis)

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Frontend | Next.js (App Router) | 16.1.6 | `apps/web` |
| UI Framework | React | 19.2.4 | — |
| Styling | Tailwind CSS | 3.4.17 | shared via `@devatlas/ui` |
| Backend | NestJS | 11.x | REST API in `apps/api` |
| ORM | Drizzle ORM + Drizzle Kit | latest | replaced Prisma 6 — see Migration Note |
| Database | PostgreSQL | 15+ | local dev via Docker Compose |
| Cache | Redis | 7+ | included in local infra |
| API Docs | Swagger | — | mounted at `/docs` from NestJS |
| Monorepo | pnpm + Turborepo | — | workspace orchestration |
| Testing | Vitest | — | shared test runner across all packages |

### ORM Migration Note

Prisma was removed from the project. Prisma CLI requires network access to Prisma servers for `prisma generate` and `prisma migrate`, which is blocked from Iran due to sanctions. Drizzle ORM operates fully offline — schema definition, type inference, migration generation, and query building all happen locally without external service calls.

**Removed**: `prisma`, `@prisma/client`, `postinstall` prisma hook
**Added**: `drizzle-orm`, `drizzle-kit`, `pg`, `@types/pg`

## Repository Layout

```text
devatlas-platform/
├── apps/
│   ├── api/
│   │   ├── drizzle.config.ts
│   │   └── src/
│   │       ├── common/
│   │       │   ├── dto/
│   │       │   ├── errors/
│   │       │   ├── filters/
│   │       │   ├── http/
│   │       │   └── interceptors/
│   │       ├── config/
│   │       ├── db/
│   │       │   ├── schema/
│   │       │   │   ├── enums.ts
│   │       │   │   ├── categories.ts
│   │       │   │   ├── tags.ts
│   │       │   │   ├── guides.ts
│   │       │   │   ├── tools.ts
│   │       │   │   ├── content-relations.ts
│   │       │   │   ├── search.ts
│   │       │   │   ├── ai.ts
│   │       │   │   ├── analytics.ts
│   │       │   │   └── index.ts
│   │       │   ├── index.ts
│   │       │   └── migrate.ts
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
│       │   ├── page.tsx
│       │   ├── guides/
│       │   │   ├── page.tsx
│       │   │   └── [slug]/page.tsx
│       │   └── tools/
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
│   └── docker/
│       └── docker-compose.yml
└── scripts/

## Backend Architecture

### API Bootstrap

`apps/api/src/main.ts` configures:

- URI versioning with default version `v1`
- Global `/api` prefix
- CORS enabled for development access
- Global `ValidationPipe` with `whitelist` and `transform`
- Swagger document generation at `/docs`
- `RequestLoggerInterceptor` — request/response logging
- `TransformInterceptor` — consistent response envelope
- `HttpExceptionFilter` — centralized error handling
- Trace ID support via `apps/api/src/common/http/trace-id.ts`

### Active NestJS Modules

| Module | Status | Responsibility |
|--------|--------|---------------|
| `database` | active | Drizzle connection lifecycle via `DrizzleService` |
| `health` | active | `GET /health` endpoint |
| `guides` | active | Guide CRUD, queries, slug-based lookup |
| `tools` | active | Tool CRUD, list/query, filtering |
| `categories` | active | Category CRUD, guide/tool filtering |
| `tags` | active | Tag CRUD, guide/tool filtering |

### API Conventions

- **DTO-first**: request/response modeling in `apps/api/src/common/dto/` and per-module `dto/` folders
- **Centralized errors**: error codes and domain errors in `apps/api/src/common/errors/`
- **Response envelope**: all responses wrapped via `TransformInterceptor`
- **Trace ID**: every request tagged for debugging
- **Repository pattern**: one Drizzle repository per module for data access
- **Validation**: `class-validator` + `class-transformer` on all incoming DTOs

## Frontend Architecture

### Route Surface

| Route | Source | Status |
|-------|--------|--------|
| `/` | `apps/web/app/page.tsx` | active |
| `/guides` | `apps/web/app/guides/page.tsx` | active |
| `/guides/[slug]` | `apps/web/app/guides/[slug]/page.tsx` | active |
| `/tools` | `apps/web/app/tools/` | planned |

### Feature Organization

`apps/web/features/` is split by product area:

| Feature | Purpose |
|---------|---------|
| `home` | Landing page content and layout |
| `navigation` | Site chrome, header, sidebar |
| `guides` | List/detail pages, API adapters |
| `tools` | API data access, tool cards |
| `search` | Search query hook and UI |

### Data Flow

text
Page → Feature module → lib/api.ts → Backend API → Drizzle → PostgreSQL

- `apps/web/lib/api.ts` — API request plumbing (base URL, headers, error handling)
- Feature-level `api/` modules — fetch from backend per domain
- Page files delegate to feature modules
- Shared presentational primitives live in `packages/ui`

## Shared Packages

| Package | Role | Key Exports |
|---------|------|-------------|
| `@devatlas/api-client` | HTTP client for backend communication | typed fetch functions, endpoint definitions |
| `@devatlas/config` | Shared configuration constants | environment helpers, feature flags |
| `@devatlas/content` | MDX pipeline | loader, parser, validator, indexer, pipeline orchestrator |
| `@devatlas/types` | Domain contracts | TypeScript interfaces, Zod schemas, shared enums |
| `@devatlas/ui` | Component library | primitives, tokens, hooks, layout components |
| `@devatlas/utils` | Utilities | fetch helpers, string utils, date formatters |

## Database Architecture

### Schema Overview

10 models across 4 domains, defined in `apps/api/src/db/schema/`:

#### Content & Taxonomy (active)
| Model | Table | Description |
|-------|-------|-------------|
| `Category` | `categories` | Content categories with hierarchy support |
| `Tag` | `tags` | Flat tagging system |
| `Guide` | `guides` | Tutorial/guide content with MDX |
| `Tool` | `tools` | Developer tool listings |
| `GuideTag` | `guide_tags` | Many-to-many: guides ↔ tags |
| `ToolTag` | `tool_tags` | Many-to-many: tools ↔ tags |

#### Relations (schema ready, not yet in runtime)
| Model | Table | Description |
|-------|-------|-------------|
| `ContentRelation` | `content_relations` | Cross-entity knowledge links |

#### Search (schema ready, not yet in runtime)
| Model | Table | Description |
|-------|-------|-------------|
| `SearchDocument` | `search_documents` | Indexed content for search |
| `SearchQuery` | `search_queries` | Search query logging |

#### AI (schema ready, not yet in runtime)
| Model | Table | Description |
|-------|-------|-------------|
| `AiSummary` | `ai_summaries` | Generated content summaries |
| `AiAnswer` | `ai_answers` | Generated Q&A answers |

#### Analytics (schema ready, not yet in runtime)
| Model | Table | Description |
|-------|-------|-------------|
| `ContentView` | `content_views` | Page view tracking |

### Enums

| Enum | Values | Used By |
|------|--------|---------|
| `Difficulty` | `beginner`, `intermediate`, `advanced` | Guide |
| `ContentStatus` | `draft`, `published`, `archived` | Guide |
| `ToolTier` | `free`, `freemium`, `paid`, `enterprise` | Tool |
| `ToolPrice` | `free`, `freemium`, `paid`, `custom` | Tool |
| `ToolStatus` | `active`, `deprecated`, `beta` | Tool |
| `EntityType` | `guide`, `tool` | ContentRelation, SearchDocument |
| `RelationType` | `related`, `prerequisite`, `alternative` | ContentRelation |

## Constraints

| Constraint | Detail |
|-----------|--------|
| npm registry | Lockfile aligned to Iranian npm mirror — no direct npmjs.org access |
| ORM | Drizzle only — Prisma fully removed due to sanctions blocking CLI |
| Peer deps | Some UI stack peer dependency warnings remain — tracked, not ignored |
| Schema vs Runtime | Schema includes forward-looking tables (AI, search) not yet in runtime |
| Offline-first | All tooling must work without internet — no external service calls at build/dev time |
| Self-hostable | No vendor lock-in — entire stack runs on a single server |

## Diagrams

### Request Flow

text
Client
  │
  ▼
[Next.js SSR / CSR]
  │
  ▼
[GET/POST /api/v1/*]
  │
  ▼
[NestJS Controller]
  │
  ├── ValidationPipe (DTO)
  ├── TransformInterceptor (envelope)
  └── HttpExceptionFilter (errors)
        │
        ▼
    [Service Layer]
        │
        ▼
    [Repository (Drizzle)]
        │
        ▼
    [PostgreSQL]

### Package Dependency Graph

text
apps/web ──► @devatlas/ui
         ──► @devatlas/types
         ──► @devatlas/api-client
         ──► @devatlas/utils

apps/api ──► @devatlas/types
         ──► @devatlas/utils

@devatlas/api-client ──► @devatlas/types
@devatlas/content    ──► @devatlas/types
@devatlas/ui         ──► (standalone)
@devatlas/config     ──► (standalone)
@devatlas/utils      ──► (standalone)


---
