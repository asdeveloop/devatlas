# DevAtlas Architecture

> Synced with current repository structure and code paths.

## Overview

DevAtlas is a `pnpm` monorepo with two runtime apps and six shared workspace packages.

- `apps/api` — NestJS REST API
- `apps/web` — Next.js App Router frontend
- `packages/*` — shared client, config, content, types, UI, and utility packages
- `scripts/` — repo health and agent-oriented tooling

## Current Repository Layout

```text
apps/
  api/
    src/
      app.module.ts
      main.ts
      common/
      config/
      db/
      modules/
  web/
    app/
    features/
    lib/
packages/
  api-client/
  config/
  content/
  types/
  ui/
  utils/
scripts/
docs/
```

## API Runtime

### Bootstrap

`apps/api/src/main.ts` currently configures:

- global prefix: `/api`
- URI versioning with default `v1`
- permissive CORS
- global `ValidationPipe`
- Swagger UI at `/docs`
- `RequestLoggerInterceptor`
- `TransformInterceptor`
- `HttpExceptionFilter`

### Registered Modules

`apps/api/src/app.module.ts` imports:

- `DatabaseModule`
- `AiModule`
- `GuidesModule`
- `ToolsModule`
- `CategoriesModule`
- `TagsModule`
- `SearchModule`
- `ContentRelationsModule`
- `HealthModule`

### API Module Shape

Each active domain follows the Nest module split below:

- controller: HTTP transport only
- service: orchestration and domain decisions
- repository: Drizzle queries
- dto: request and response shapes
- tests: service-level tests close to the module

### AI Layer Preparation

The current AI slice is intentionally provider-agnostic:

- `apps/api/src/modules/ai/ai.module.ts` owns AI HTTP endpoints and orchestration
- `ai-summary.repository.ts` stores/retrieves generated summaries from `ai_summaries`
- `ai-answer.repository.ts` persists Q&A responses into `ai_answers`
- summary generation is deterministic and local for now, so the persistence and API contracts are stable before a remote provider is added
- `POST /api/v1/ai/ask` uses search retrieval plus stored summaries as the answer context

#### Provider Strategy

DevAtlas keeps the AI provider behind the service layer so the next step can swap in OpenAI, Anthropic, local models, or another provider without changing controllers, repositories, or web consumers.

- retrieval stays local in the existing search/index tables
- prompt/response generation belongs in `AiService` behind a narrow method boundary
- provider credentials and model selection should enter through config, not repository code
- `ai_summaries` and `ai_answers` remain the durable cache/audit layer regardless of provider choice

### Response and Error Model

- successful responses are wrapped by `apps/api/src/common/interceptors/transform.interceptor.ts`
- errors are normalized by `apps/api/src/common/filters/http-exception.filter.ts`
- trace ids are generated or forwarded via `x-trace-id`
- envelope shape includes `success`, `data` or `error`, optional `meta`, `traceId`, and `timestamp`

## Database Layer

### Drizzle

The active schema lives under `apps/api/src/db/schema/` and currently includes:

- taxonomy/content tables: `category.ts`, `tag.ts`, `guide.ts`, `tool.ts`
- join tables: `guide-tag.ts`, `tool-tag.ts`
- extended domain tables already present in schema: `content-relation.ts`, `search-document.ts`, `search-query.ts`, `ai-summary.ts`, `ai-answer.ts`, `content-view.ts`
- shared enums in `enums.ts`
- aggregated exports in `index.ts`

### Database Access

- `apps/api/src/modules/database/drizzle.service.ts` owns the Drizzle client
- repositories import schema from `apps/api/src/db/schema`
- controllers do not talk to Drizzle directly
- Prisma is not active in the API runtime or shared workspace code paths

## Web Runtime

### Route Surface

Current App Router entries under `apps/web/app`:

- `/` → `apps/web/app/page.tsx`
- `/guides` → `apps/web/app/guides/page.tsx`
- `/guides/[slug]` → `apps/web/app/guides/[slug]/page.tsx`
- `/tools` → `apps/web/app/tools/page.tsx`
- `/tools/[slug]` → `apps/web/app/tools/[slug]/page.tsx`

Guide and tool detail pages now pull AI summaries through the shared API client and render them as a separate summary block above the main detail content.

### Feature Organization

`apps/web/features/` is organized by domain:

- `home`
- `navigation`
- `guides`
- `search`
- `tools`

### Web Data Flow

Typical flow:

`app route -> feature page/component -> feature api helper -> apps/web/lib/api.ts -> apps/api`

## Shared Packages

- `@devatlas/api-client` — generated/typed client package surface
- `@devatlas/config` — shared config package
- `@devatlas/content` — content pipeline utilities
- `@devatlas/types` — shared enums and contracts used by API and web
- `@devatlas/ui` — reusable UI primitives/components
- `@devatlas/utils` — shared utility helpers

## Current Repo Risks

- local DB validation depends on keeping the generated Drizzle SQL and PostgreSQL schema in sync
- repo-wide `test`/full health still depends on broader runtime validation beyond the API/types migration slice
