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
- `GuidesModule`
- `ToolsModule`
- `CategoriesModule`
- `TagsModule`
- `HealthModule`

### API Module Shape

Each active domain follows the Nest module split below:

- controller: HTTP transport only
- service: orchestration and domain decisions
- repository: Drizzle queries
- dto: request and response shapes
- tests: service-level tests close to the module

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

There is no routed `/tools` page yet, although tool fetching utilities already exist under `apps/web/features/tools/api/`.

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

- `drizzle-kit push` still depends on a valid `DATABASE_URL` in the execution environment
- repo-wide `test`/full health still depends on broader runtime validation beyond the API/types migration slice
