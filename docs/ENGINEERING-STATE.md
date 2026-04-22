# Engineering State

> Snapshot of the repository based on the current code layout.

## Active Now

- Drizzle is the active ORM in `apps/api`.
- Nest modules for `ai`, `guides`, `tools`, `categories`, `tags`, `search`, `content-relations`, `health`, and `database` are wired in `apps/api/src/app.module.ts`.
- Global API wrappers for success, error handling, logging, and trace ids are active in bootstrap.
- API health endpoints now expose `/api/v1/health`, `/api/v1/health/live`, and `/api/v1/health/ready` with in-memory request metrics on the full health report.
- Web routes are live for `/`, `/guides`, `/guides/[slug]`, `/tools`, and `/tools/[slug]`.
- Root scripts include local verification helpers: `agent:context`, `agent:verify`, `doctor`, and `health`.

## Current Packages

- apps: `@devatlas/api`, `@devatlas/web`
- shared: `@devatlas/api-client`, `@devatlas/config`, `@devatlas/content`, `@devatlas/types`, `@devatlas/ui`, `@devatlas/utils`

## Verification Surface

Primary package-level commands available now:

```bash
pnpm verify:api
pnpm verify:web
pnpm build:api
pnpm build:web
```

Lower-cost checks:

```bash
pnpm agent:context repo
pnpm agent:verify api
pnpm agent:verify web
pnpm doctor
pnpm health
```

Latest executed checks:

- `node scripts/agent-verify.mjs api lint typecheck test` ✅
- `node scripts/agent-verify.mjs web lint typecheck test build` ✅
- `pnpm lint` ✅ across the monorepo
- `pnpm --filter @devatlas/api test -- src/modules/__tests__/api-contract.spec.ts` ✅

## Known Shape Of Runtime

### API
- prefix: `/api/v1`
- swagger: `/docs`
- health check hits the DB with `SELECT 1`
- liveness probe is available at `/api/v1/health/live`
- readiness probe is available at `/api/v1/health/ready`
- full health payload includes in-memory request metrics (totals, status classes, duration buckets, per-route summaries)
- guides use `PATCH`/`DELETE` by `:id`
- tools/categories/tags use slug-based update/delete routes
- guide list/detail DTOs now match the current category/tag-enriched response shape

### Web
- app routes exist for `/`, `/guides`, `/guides/[slug]`, `/tools`, `/tools/[slug]`
- guide feature owns the routed pages plus API adapters
- tool feature owns the tools listing/detail integration

### Known Gaps

- local PostgreSQL validation completed against the `devatlas` database using the generated Drizzle migration SQL
- observability baseline is partial: trace ids, structured request logging, request metrics, and health/live/ready probes are present; external exporters/alerts are still pending
- repo-wide `test`/`build` still need a broader validation pass when the next cross-package batch is ready

## Documentation Sync Notes

These docs were updated to remove stale references to:

- Prisma as the active ORM
- outdated package names like `@devatlas/shared-types`
- older script examples that do not match the current `package.json` files
