# Scripts Reference

> DevAtlas Platform — Canonical script definitions for all packages.
> Last updated: 1405/02/03 (2026-04-23)

---

## Root (Turborepo)

| Script          | Command                          | Description                              |
| --------------- | -------------------------------- | ---------------------------------------- |
| `build`         | `turbo run build`                | Build all packages                       |
| `dev`           | `turbo run dev`                  | Start all apps in dev mode               |
| `lint`          | `turbo run lint`                 | Lint all packages                        |
| `test`          | `turbo run test`                 | Run all tests                            |
| `typecheck`     | `turbo run typecheck`            | Type-check all packages                  |
| `clean`         | `turbo run clean`                | Remove build artifacts                   |
| `format`        | `prettier --write .`             | Format entire codebase                   |
| `format:check`  | `prettier --check .`             | Check formatting without writing         |
| `postinstall`   | `—`                              | No ORM engine prep needed with Drizzle   |
| `search:smoke`  | `node scripts/search-smoke.mjs`   | Run API smoke checks and optional pipeline smoke for search |
| `deploy:staging` | `node scripts/deploy/staging-release.mjs` | Run the repo-driven staging deploy helper over SSH |

Examples:

```bash
# smoke-only against local API
pnpm search:smoke -- --api http://127.0.0.1:3001 --query React

# run search:reindex and validate summary output too
pnpm search:smoke -- --api http://127.0.0.1:3001 --pipeline
```

Flags:

- `--api <url>`: API base URL (default `http://127.0.0.1:3001` or `API_BASE_URL`)
- `--query <text>`: search text to execute (default `React`)
- `--require-positive`: enforce `search.total > 0` in smoke result
- `--pipeline`: runs `pnpm --filter @devatlas/api search:reindex` and validates machine-readable summary

Staging deploy helper examples:

```bash
# smoke-only against the current staging release with temporary TLS
pnpm deploy:staging -- --skip-deploy --insecure

# sync remote repo snapshot on the VPS, deploy, then run public smoke checks
pnpm deploy:staging -- --sync-remote --insecure
```

Flags:

- `--sync-remote`: refresh the VPS repo snapshot from remote before building
- `--ref <git-ref>`: deploy a specific remote ref on the VPS
- `--skip-deploy`: run smoke checks only
- `--insecure`: allow smoke checks against the current self-signed staging cert

### Notes

- `postinstall` no longer runs any ORM engine preparation. Drizzle has no binary engine dependency.
- All Turbo tasks respect the dependency graph defined in `turbo.json`.

---

## apps/api

### Core Scripts

| Script       | Command                                    | Description                    |
| ------------ | ------------------------------------------ | ------------------------------ |
| `build`      | `tsc --project tsconfig.build.json --outDir dist --incremental false` | Production build |
| `dev`        | `nest start --watch`                       | Dev server with hot reload     |
| `start`      | `node dist/main.js`                        | Start production server        |
| `lint`       | `eslint src --ext .ts --max-warnings=0`   | Lint — zero warnings allowed   |
| `test`       | `vitest run --passWithNoTests --config vitest.config.ts` | Run all tests (single run) |
| `test:watch` | `vitest`                                   | Run tests in watch mode        |
| `test:cov`   | `vitest run --coverage`                    | Run tests with coverage        |
| `typecheck`  | `tsc --noEmit`                             | Type-check without emitting    |

### Database Scripts (Drizzle)

| Script        | Command                                            | Description |
| ------------- | -------------------------------------------------- | ----------- |
| `db:generate` | `drizzle-kit generate --config src/db/drizzle.config.ts` | Generate a new SQL migration from the current schema |
| `db:migrate`  | `drizzle-kit migrate --config src/db/drizzle.config.ts`  | Apply pending migrations to the target database |
| `db:check`    | `drizzle-kit check --config src/db/drizzle.config.ts`    | Validate migration history against the schema output |
| `db:export`   | `drizzle-kit export --config src/db/drizzle.config.ts`   | Export the full schema diff as SQL from the current state |
| `content:ingest` | `ts-node --project tsconfig.json src/scripts/ingest-content.ts` | Parse MDX content from `CONTENT_DIR` and upsert categories/tags/guides/tools plus relations and search documents |
| `search:reindex` | `ts-node --project tsconfig.json src/scripts/reindex-search.ts` | Rebuild `search_documents` explicitly instead of doing index work on read traffic |
| `search:verify` | `vitest run --passWithNoTests --config vitest.config.ts src/modules/search/__tests__/search.service.spec.ts src/modules/search/__tests__/search-indexing.service.spec.ts src/modules/__tests__/api-contract.spec.ts` | Run production-grade search contract + service + indexing checks |

در اجرای `search:reindex`، خروجی machine-readable شامل خلاصهٔ تعداد بازسازی شده ارسال می‌شود:

```json
{"event":"search-reindex-complete","summary":{"guides":42,"tools":18,"total":60}}
```

اجرای production-like دیتابیس در این repo باید این ترتیب را دنبال کند:

1. `pnpm --filter @devatlas/api db:generate`
2. migration SQL را بازبینی و commit کنید
3. `pnpm --filter @devatlas/api db:check`
4. `pnpm --filter @devatlas/api db:migrate`
5. `pnpm --filter @devatlas/api content:ingest` after setting `CONTENT_DIR`
6. `pnpm --filter @devatlas/api search:reindex` only when you need to rebuild `search_documents` from DB state without re-importing content

Rollback در فاز فعلی خودکار نشده؛ rollback باید با migration جبرانی جدید انجام شود، نه ویرایش دستی migrationهای commit شده.

### Runtime Security Baseline

- `CORS_ORIGIN` می تواند یک origin یا چند origin جداشده با `,` باشد
- `RATE_LIMIT_WINDOW_MS` پنجره rate limit را برای endpointهای عمومی مشخص می کند
- `RATE_LIMIT_SEARCH_MAX` سقف درخواست `POST /api/v1/search` را در هر پنجره مشخص می کند
- `RATE_LIMIT_AI_MAX` سقف درخواست endpointهای `ai` را در هر پنجره مشخص می کند
- API به صورت baseline این headerها را ست می کند: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Cross-Origin-Opener-Policy`, `Permissions-Policy`

نمونه env production-like:

```bash
CORS_ORIGIN=https://devatlas.app,https://staging.devatlas.app
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_SEARCH_MAX=30
RATE_LIMIT_AI_MAX=10
```

---

## apps/web

| Script       | Command                          | Description                    |
| ------------ | -------------------------------- | ------------------------------ |
| `build`      | `node ../../scripts/link-next-eslint.mjs && next build` | Production build |
| `dev`        | `next dev`                       | Dev server                     |
| `start`      | `next start`                     | Start production server        |
| `lint`       | `eslint . --max-warnings=0`     | Lint — zero warnings allowed   |
| `test`       | `vitest run --passWithNoTests --config vitest.config.ts` | Run all tests |
| `typecheck`  | `tsc --noEmit`                   | Type-check without emitting    |

---

## packages/types

| Script      | Command          | Description                 |
| ----------- | ---------------- | --------------------------- |
| `build`     | `tsup src/index.ts --dts --format esm,cjs --clean` | Compile runtime + type declarations |
| `typecheck` | `tsc -p tsconfig.json --noEmit` | Type-check |
| `lint`      | `eslint src --ext .ts --max-warnings=0` | Lint |

---

## packages/ui

| Script      | Command                      | Description                 |
| ----------- | ---------------------------- | --------------------------- |
| `build`     | `tsup`                       | Bundle components           |
| `dev`       | `tsup --watch`               | Watch mode                  |
| `lint`      | `eslint . --max-warnings=0` | Lint                        |
| `typecheck` | `tsc --noEmit`               | Type-check                  |
| `test`      | `vitest run`                 | Run component tests         |

---

## Drizzle Configuration

فایل `drizzle.config.ts` در پکیج `apps/api`:

```ts
// filepath: apps/api/src/db/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL'],
  },
  verbose: true,
  strict: true,
});
```

---

## CI Pipeline Scripts

CI این مراحل رو به ترتیب اجرا می‌کنه:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

- CI فعلی فقط از `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` استفاده می‌کند.
- هر مرحله migration یا DB setup باید فقط وقتی به workflow اضافه شود که اسکریپت واقعی repo برای آن وجود داشته باشد.

---

## Script Rules

1. هر پکیج **باید** اسکریپت‌های `build`, `lint`, `typecheck` رو داشته باشه.
2. `test` از `vitest run` استفاده می‌کنه — نه watch mode.
3. `lint` با `--max-warnings=0` — هیچ warning ای قابل قبول نیست.
4. اسکریپت مرده یا موقت ممنوع — حذفش کن یا issue بزن.
5. اسکریپت‌های `db:*` فقط وقتی باید مستند شوند که واقعا در `apps/api/package.json` وجود داشته باشند.
6. هیچ دستور منسوخ Prisma یا Drizzle-placeholder نباید در CI یا docs باقی بماند.

---

## scripts/doctor.mjs

این اسکریپت سلامت کل monorepo را بررسی می‌کند:

- نسخه Node
- نصب بودن pnpm
- سالم بودن lockfile
- عدم وجود بسته‌های duplicated
- اعتبار tsconfig.base.json
- بررسی turbo cache

### اجرا:
```bash
pnpm doctor
```
