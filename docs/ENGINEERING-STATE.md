# Engineering State

**Last Updated:** 1405/01/29 (2026-04-18)

---

## ✅ Completed

### Phase 1: Foundation & Config Drift Resolution

#### Step 1: Missing Config Files Created
- `pnpm-workspace.yaml` — workspace definition
- `.github/workflows/ci.yml` — full CI pipeline
- `vitest.config.ts` (root) — shared test config
- `apps/api/vitest.config.ts` — API test config (Node)
- `apps/web/vitest.config.ts` — Web test config (jsdom)
- `apps/api/tsconfig.build.json` — API production build
- `packages/types/tsconfig.json` — types package config
- `packages/ui/tsconfig.json` — UI package config with JSX
- `infra/docker/docker-compose.yml` — local dev stack (PostgreSQL 15, Redis 7)

#### Step 2: Dependency & Version Alignment
- All Radix UI + utility deps consolidated into `@devatlas/ui`
- UI deps removed from `apps/api` (backend has no UI)
- Test configs use local `vitest.config.ts` per package

#### Step 3: Root Dependency Normalization
- Root `package.json`: removed ALL runtime `dependencies`
- Each package owns its own deps. Root = devDependencies only.

#### Step 4: UI Package Peer Dependency Noise Reduction
- Peer range widened: `>=18.0.0 <20.0.0` for react/react-dom

#### Step 5: Canonical Scripts Documentation & Enforcement
**Created `docs/SCRIPTS.md` — single source of truth for all scripts.**

Standardization applied:
- All `test` scripts: `vitest run --passWithNoTests` (no watch mode)
- All `lint` scripts: `--max-warnings=0`
- All `typecheck` scripts: `tsc --noEmit` (consistent across packages)
- `apps/web` build: removed `&& pnpm lint` (lint is separate pipeline stage)
- `apps/web` lint: `next lint` → `eslint . --max-warnings=0` (consistent)
- Root: removed `validate:phase1` (temporary), removed `prepare:prisma` (temporary)
- Root `health`: expanded to `typecheck && lint && test`

#### Step 6: Unit Tests
- `error.factory.spec.ts` — DomainError, ErrorCodes, all ErrorFactory methods (7 tests)
- `categories.service.spec.ts` — list/get/create/update/delete + error paths (7 tests)
- `tags.service.spec.ts` — list/get/create/update/delete + error paths (7 tests)
- `tools.service.spec.ts` — list/get/create/update/delete + error paths (7 tests)
- `guides.service.spec.ts` — findAll pagination/filters, findBySlug, create with/without tags, update tag replacement, delete + error paths (11 tests)

**Total: 39 unit tests** covering all domain services and error infrastructure.
Coverage: service layer CRUD, pagination meta calculation, slug conflict, not-found errors.

> **Note:** Tests currently mock at repository layer. After Drizzle migration, mock targets change from `PrismaService` to `DrizzleService` — test rewrites tracked in Sprint Tasks 56–62.

### Dependency Ownership Matrix

| Layer | Owns |
|-------|------|
| Root (devDeps only) | turbo, typescript, eslint, vitest, tsup, commitlint, lint-staged |
| `@devatlas/ui` | Radix UI, cva, clsx, lucide-react, tailwind-merge, @base-ui/react |
| `@devatlas/types` | zod (standalone, no other runtime deps) |
| `apps/api` | NestJS, drizzle-orm, drizzle-kit, pg, zod, class-validator/transformer |
| `apps/web` | Next.js, React 19, sharp, date-fns, zod, app-specific UI libs |

### Phase 1 Metrics
| Metric | Value |
|--------|-------|
| Config files created | 9 |
| Dependencies removed from root | 40+ |
| Dependencies relocated | 52 package moves |
| Version drifts fixed | lucide-react, tailwind-merge |
| Scripts standardized | 6 packages, 28 scripts total |
| Dead scripts removed | 2 (`validate:phase1`, `prepare:prisma`) |
| Unit tests written | 39 |

---

### Phase 2: ORM Migration — Prisma → Drizzle

#### Decision Record
| Field | Value |
|-------|-------|
| Date | 1405/01/29 (2026-04-18) |
| Reason | Prisma CLI requires network access to Prisma servers (blocked from Iran by sanctions). `prisma generate`, `prisma migrate`, and `postinstall` hooks fail without VPN. |
| Decision | Replace Prisma with Drizzle ORM across entire `apps/api` codebase |
| Scope | Schema, repositories, database module, migrations, types, tests |
| Rollback | Git-based — restore `apps/api/prisma/`, reinstall `@prisma/client`, revert repository files |

#### Dependencies Change
```
REMOVED:
  prisma
  @prisma/client
  postinstall: node scripts/prepare-prisma-engines.mjs

ADDED:
  drizzle-orm
  drizzle-kit
  pg
  @types/pg

#### Migration Artifacts

| File | Purpose | Status |
|------|---------|--------|
| `apps/api/src/db/schema/enums.ts` | All 7 enums as pgEnum | ⬜ todo |
| `apps/api/src/db/schema/categories.ts` | Category model | ⬜ todo |
| `apps/api/src/db/schema/tags.ts` | Tag model | ⬜ todo |
| `apps/api/src/db/schema/guides.ts` | Guide + GuideTag | ⬜ todo |
| `apps/api/src/db/schema/tools.ts` | Tool + ToolTag | ⬜ todo |
| `apps/api/src/db/schema/content-relations.ts` | ContentRelation | ⬜ todo |
| `apps/api/src/db/schema/search.ts` | SearchDocument + SearchQuery | ⬜ todo |
| `apps/api/src/db/schema/ai.ts` | AiSummary + AiAnswer | ⬜ todo |
| `apps/api/src/db/schema/analytics.ts` | ContentView | ⬜ todo |
| `apps/api/src/db/schema/index.ts` | Barrel export | ⬜ todo |
| `apps/api/src/db/index.ts` | Drizzle client factory | ⬜ todo |
| `apps/api/src/db/migrate.ts` | Migration runner | ⬜ todo |
| `apps/api/drizzle.config.ts` | Drizzle Kit config | ⬜ todo |
| `apps/api/src/modules/database/database.module.ts` | NestJS module rewrite | ⬜ todo |
| `apps/api/src/modules/database/drizzle.service.ts` | Injectable Drizzle service | ⬜ todo |

---

## 🚧 In Progress

### Current Sprint: ORM Migration (Phase 2)

Tasks from `docs/SPRINT-TASKS-100.md`:

- [ ] **Sprint 1 (Tasks 1–20):** Write Drizzle schema files, create DrizzleService + DatabaseModule
- [ ] **Sprint 2 (Tasks 21–45):** Rewrite all 6 repository files
- [ ] **Sprint 3 (Tasks 46–55):** Sync `@devatlas/types` with Drizzle inferred types
- [ ] **Sprint 4 (Tasks 56–62):** Rewrite test infrastructure (mock targets → DrizzleService)
- [ ] Generate initial Drizzle migration from existing DB
- [ ] Remove ALL remaining Prisma references
- [ ] Pass `pnpm typecheck && pnpm lint && pnpm test`

---

## 📋 Next After ORM Migration

| Priority | Task | Source |
|----------|------|--------|
| 1 | API endpoint tests (integration) | SPRINT-TASKS-100 #63–70 |
| 2 | Frontend API client sync with new types | SPRINT-TASKS-100 #71–80 |
| 3 | Search module runtime implementation | ROADMAP Phase 3 |
| 4 | Content pipeline (MDX → DB ingestion) | ROADMAP Phase 3 |

---

## 🔧 Active Constraints

| Constraint | Detail |
|-----------|--------|
| Root deps | Root `package.json` has ZERO runtime dependencies |
| ORM | `drizzle-orm` + `drizzle-kit` — single version, owned by `apps/api` |
| Prisma | Fully removed — no `prisma generate`, no `postinstall` hook, no `@prisma/client` |
| UI deps | Live exclusively in `@devatlas/ui` (peer: react >=18 <20) |
| App UI libs | App-specific UI libs live in `apps/web` only |
| Test config | Each package has its own `vitest.config.ts` |
| Script naming | Canonical: `build`, `dev`, `lint`, `test`, `typecheck` |
| Script docs | `docs/SCRIPTS.md` is the single source of truth |
| Module system | API=CommonJS (NestJS requires CJS), api-client=ESM, web=ESNext/Bundler |
| npm mirror | Lockfile aligned to Iranian npm mirror |
| Offline tooling | All build/dev tooling must work without internet |
| No vendor lock-in | Entire stack self-hostable on a single server |

---

## 📊 Overall Progress


Phase 0: Project Setup           ████████████████████ 100%
Phase 1: Config Drift Resolution ████████████████████ 100%
Phase 2: ORM Migration           ░░░░░░░░░░░░░░░░░░░░   0%
Phase 3: Search & Knowledge      ░░░░░░░░░░░░░░░░░░░░   0%
Phase 4: AI Features             ░░░░░░░░░░░░░░░░░░░░   0%
Phase 5: Production Hardening    ░░░░░░░░░░░░░░░░░░░░   0%


---
