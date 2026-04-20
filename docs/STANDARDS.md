# Coding Standards & Architecture Constraints

> Focused on the rules that match the current codebase.

## Naming

- TypeScript variables/functions: `camelCase`
- classes/types/enums: `PascalCase`
- database tables/columns: `snake_case`
- DTO, service, repository, controller files: `kebab-case`
- env vars: `UPPER_SNAKE_CASE`

## TypeScript Rules

- keep `strict` mode enabled
- do not introduce `any`, `@ts-ignore`, or hidden type bypasses
- prefer existing shared enums/types from `@devatlas/types`
- use workspace package imports, never another package's internal `src/` path

## NestJS Boundaries

- controllers own HTTP transport only
- services own orchestration and business rules
- repositories own Drizzle queries
- DTOs define validation and transport contracts
- avoid cross-module repository imports; communicate through modules/services

## API Conventions

- global API prefix is `/api`
- URI versioning is enabled, so public endpoints resolve under `/api/v1/*`
- success and error envelopes are centralized; do not hand-roll per controller unless the envelope contract still holds
- trace ids flow through `x-trace-id`

## Database Rules

- Drizzle schema under `apps/api/src/db/schema/` is the source of truth
- prefer one schema file per table or join table
- repositories should import from `apps/api/src/db/schema/index.ts` where practical
- keep SQL logic in repositories, not services/controllers

## Web Rules

- App Router entry points live in `apps/web/app`
- feature logic lives under `apps/web/features`
- HTTP helpers live close to the feature or in `apps/web/lib`
- preserve existing domain-first organization instead of creating parallel folders

## Shared Package Rules

- check `packages/*` before creating new helpers or types
- extend the nearest existing package instead of duplicating utilities in app code
- keep imports stable through package names such as `@devatlas/types` and `@devatlas/ui`

## Validation Expectation

For scoped changes, prefer package-local checks first:

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
pnpm lint:web
pnpm typecheck:web
pnpm test:web
```
