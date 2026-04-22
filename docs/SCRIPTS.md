# Scripts Reference

> DevAtlas Platform — Canonical script definitions for all packages.
> Last updated: 1405/01/29 (2026-04-18)

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

اسکریپت های Drizzle هنوز به صورت کامل در `apps/api/package.json` expose نشده اند و باید از فایل های واقعی زیر استفاده شوند:

- config: `apps/api/src/db/drizzle.config.ts`
- migration runner: `apps/api/src/db/migrate.ts`
- schema: `apps/api/src/db/schema/*`

تا قبل از اضافه شدن اسکریپت های رسمی، هر تغییر دیتابیس باید همراه با runbook مستند و اعتبارسنجی محلی انجام شود.

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
