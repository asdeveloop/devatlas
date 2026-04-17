// filepath: docs/ENGINEERING-STATE.md
# Engineering State

**Last Updated:** 1405/01/29 (2026-04-18)

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
- `infra/docker/docker-compose.yml` — local dev stack

#### Step 2: Dependency & Version Alignment
- Prisma aligned to `^6.19.3` across all packages
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
- Root: removed `validate:phase1` (temporary), removed `prepare:prisma` (duplicate of `postinstall`)
- Root `health`: expanded to `typecheck && lint && test`
- `apps/api`: added `prisma:migrate:dev` and `prisma:migrate:deploy`
- `apps/api` prisma scripts: simplified engine paths (rely on pnpm hoisting)

### Dependency Ownership Matrix

| Layer | Owns |
|---|---|
| Root (devDeps only) | turbo, typescript, eslint, vitest, tsup, commitlint, lint-staged |
| `@devatlas/ui` | Radix UI, cva, clsx, lucide-react, tailwind-merge, @base-ui/react |
| `@devatlas/types` | (standalone, no runtime deps) |
| `apps/api` | NestJS, Prisma, zod, class-validator/transformer |
| `apps/web` | Next.js, React 19, sharp, date-fns, zod, app-specific UI libs |

### Known Remaining Items
1. **Module system**: API=CommonJS, api-client=ESM, web=ESNext/Bundler — acceptable (NestJS requires CJS)
2. **`postinstall` script**: runs `node scripts/prepare-prisma-engines.mjs` — needs prisma available via hoisting

## 🚧 In Progress
- None

## 📋 Next Priority
Next incomplete P1 task from ROADMAP.md (all P1 tasks complete — move to P2)

## 🔧 Active Constraints
- Root `package.json` has ZERO runtime dependencies
- Prisma `^6.19.3` — single version, owned by `apps/api`
- UI deps live exclusively in `@devatlas/ui` (peer: react >=18 <20)
- App-specific UI libs live in `apps/web`
- Each package has its own `vitest.config.ts`
- All scripts follow canonical naming: build, dev, lint, test, typecheck
- `docs/SCRIPTS.md` is the single source of truth for script conventions

## 📊 Metrics
- Config files created: 9
- Dependencies removed from root: 40+
- Dependencies moved to correct owner: 52 package relocations
- Version drifts fixed: Prisma (3 locations), lucide-react, tailwind-merge
- Scripts standardized: 6 packages, 28 scripts total
- Dead scripts removed: 2 (validate:phase1, prepare:prisma)
- Prisma scripts added: 2 (migrate:dev, migrate:deploy)

### Unit Tests (Step 6 — Completed)

- `error.factory.spec.ts` — DomainError, ErrorCodes, all ErrorFactory methods (7 tests)
- `categories.service.spec.ts` — list/get/create/update/delete + error paths (7 tests)
- `tags.service.spec.ts` — list/get/create/update/delete + error paths (7 tests)
- `tools.service.spec.ts` — list/get/create/update/delete + error paths (7 tests)
- `guides.service.spec.ts` — findAll pagination/filters, findBySlug, create with/without tags, update tag replacement, delete + error paths (11 tests)

Total: 39 unit tests covering all domain services and error infrastructure.
Coverage: service layer CRUD, pagination meta calculation, slug conflict, not-found errors.
