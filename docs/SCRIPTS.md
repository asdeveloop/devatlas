// filepath: docs/SCRIPTS.md
# Canonical Scripts Reference

**Last Updated:** 1405/01/29 (2026-04-18)

## Convention

Every package in the monorepo MUST implement these 4 canonical scripts:

| Script | Purpose | Turbo-orchestrated |
|---|---|---|
| `build` | Production build | ✅ |
| `lint` | Static analysis, zero warnings | ✅ |
| `test` | Run tests (single pass, no watch) | ✅ |
| `typecheck` | TypeScript type checking | ✅ |

Optional scripts are package-specific and documented below.

## Root Scripts

| Script | Command | When to use |
|---|---|---|
| `build` | `turbo run build` | Build all packages |
| `dev` | `turbo run dev` | Start all dev servers |
| `lint` | `turbo run lint` | Lint all packages |
| `lint:report` | `eslint . -f github` | CI only — GitHub-formatted output |
| `test` | `turbo run test` | Run all tests |
| `typecheck` | `turbo run typecheck` | Type-check all packages |
| `health` | `pnpm typecheck && pnpm lint && pnpm test` | Full validation gate |
| `postinstall` | `node scripts/prepare-prisma-engines.mjs` | Auto — prepares Prisma engines after install |
| `combine` | `node scripts/combine-files.js` | Dev utility — combines source for AI context |
| `generate:api-client` | `pnpm --filter @devatlas/api-client generate` | Regenerate API client from OpenAPI spec |

## Per-Package Scripts

### `apps/api`

| Script | Command |
|---|---|
| `build` | `tsc --project tsconfig.build.json --outDir dist --rootDir src --incremental false` |
| `dev` | `nest start --watch` |
| `lint` | `eslint src --ext .ts --max-warnings=0` |
| `test` | `vitest run --passWithNoTests --config vitest.config.ts` |
| `typecheck` | `tsc --noEmit` |
| `prisma:generate` | Generate Prisma client from schema |
| `prisma:validate` | Validate Prisma schema |
| `prisma:migrate:dev` | Create + apply dev migration |
| `prisma:migrate:deploy` | Apply migrations in production |

### `apps/web`

| Script | Command |
|---|---|
| `build` | `node ../../scripts/link-next-eslint.mjs && next build` |
| `dev` | `next dev` |
| `lint` | `eslint . --max-warnings=0` |
| `test` | `vitest run --passWithNoTests --config vitest.config.ts` |
| `typecheck` | `tsc --noEmit` |

### `packages/ui`

| Script | Command |
|---|---|
| `build` | `tsup` (configured via `tsup.config.ts`) |
| `dev` | `tsup --watch` |
| `lint` | `eslint src --ext .ts,.tsx --max-warnings=0` |
| `test` | `vitest run --passWithNoTests --config vitest.config.ts` |
| `typecheck` | `tsc --noEmit` |

### `packages/types`

| Script | Command |
|---|---|
| `build` | `tsup src/index.ts --dts --format esm,cjs --clean` |
| `lint` | `eslint src --ext .ts --max-warnings=0` |
| `test` | `vitest run --passWithNoTests` |
| `typecheck` | `tsc --noEmit` |

### `packages/api-client`

| Script | Command |
|---|---|
| `build` | `tsup src/index.ts --dts --format esm,cjs --clean` |
| `generate` | `openapi-generator-cli generate -c openapitools.json` |
| `lint` | `eslint src --ext .ts --max-warnings=0` |
| `test` | `vitest run --passWithNoTests` |
| `typecheck` | `tsc --noEmit` |

## Rules

1. `test` MUST use `vitest run` (not watch mode) — CI and turbo require single-pass execution
2. `lint` MUST include `--max-warnings=0` — no warnings allowed
3. `typecheck` MUST use `tsc --noEmit` — never emit during type checking
4. `build` MUST NOT include lint or test — those are separate pipeline stages
5. No dead or temporary scripts (e.g., `validate:phase1`) — remove when done

## Removed Scripts

| Script | Was in | Reason |
|---|---|---|
| `validate:phase1` | root | Temporary, replaced by `health` |
| `prepare:prisma` | root | Duplicate of `postinstall` |
