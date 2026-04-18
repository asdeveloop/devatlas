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
| `format:check`  | `prettier --check .`            | Check formatting without writing         |
| `postinstall`   | `—`                              | No ORM engine prep needed with Drizzle   |

### Notes

- `postinstall` no longer runs any ORM engine preparation. Drizzle has no binary engine dependency.
- All Turbo tasks respect the dependency graph defined in `turbo.json`.

---

## apps/api

### Core Scripts

| Script       | Command                                    | Description                    |
| ------------ | ------------------------------------------ | ------------------------------ |
| `build`      | `nest build`                               | Production build               |
| `dev`        | `nest start --watch`                       | Dev server with hot reload     |
| `start`      | `node dist/main.js`                        | Start production server        |
| `lint`       | `eslint . --max-warnings=0`               | Lint — zero warnings allowed   |
| `test`       | `vitest run`                               | Run all tests (single run)     |
| `test:watch` | `vitest`                                   | Run tests in watch mode        |
| `test:cov`   | `vitest run --coverage`                    | Run tests with coverage        |
| `typecheck`  | `tsc --noEmit`                             | Type-check without emitting    |

### Database Scripts (Drizzle)

| Script             | Command                                              | Description                                |
| ------------------ | ---------------------------------------------------- | ------------------------------------------ |
| `db:generate`      | `drizzle-kit generate`                               | Generate migration SQL from schema changes |
| `db:migrate`       | `drizzle-kit migrate`                                | Apply pending migrations                   |
| `db:push`          | `drizzle-kit push`                                   | Push schema directly (dev only)            |
| `db:studio`        | `drizzle-kit studio`                                 | Open Drizzle Studio (DB browser)           |
| `db:check`         | `drizzle-kit check`                                  | Validate schema consistency                |
| `db:drop`          | `drizzle-kit drop`                                   | Drop a migration file                      |
| `db:seed`          | `tsx src/database/seed.ts`                            | Seed database with initial data            |
| `db:reset`         | `pnpm db:drop && pnpm db:push && pnpm db:seed`      | Full reset (dev only)                      |

### Script Details

#### `db:generate`

Schema تغییر کرده → migration SQL تولید می‌شه:

```bash
cd apps/api
pnpm db:generate
# Output: drizzle/XXXX_migration_name.sql

- فایل‌های migration در `apps/api/drizzle/` ذخیره می‌شن.
- هر migration یک فایل SQL خالص هست — قابل review در PR.

#### `db:migrate`

Migration های pending رو روی دیتابیس اعمال می‌کنه:

bash
cd apps/api
pnpm db:migrate

- در production فقط از این دستور استفاده کنید.
- **هرگز** از `db:push` در production استفاده نکنید.

#### `db:push`

Schema رو مستقیم به دیتابیس push می‌کنه بدون تولید migration:

bash
cd apps/api
pnpm db:push

- فقط برای development سریع.
- تغییرات destructive بدون هشدار اعمال می‌شن.

#### `db:studio`

Drizzle Studio — یک DB browser بصری:

bash
cd apps/api
pnpm db:studio
# Opens at https://local.drizzle.studio

#### `db:seed`

دیتابیس رو با داده‌های اولیه پر می‌کنه:

bash
cd apps/api
pnpm db:seed

- Seed file: `apps/api/src/database/seed.ts`
- Idempotent باشه — اجرای مکرر مشکلی ایجاد نکنه.

---

## apps/web

| Script       | Command                          | Description                    |
| ------------ | -------------------------------- | ------------------------------ |
| `build`      | `next build`                     | Production build               |
| `dev`        | `next dev`                       | Dev server                     |
| `start`      | `next start`                     | Start production server        |
| `lint`       | `eslint . --max-warnings=0`     | Lint — zero warnings allowed   |
| `test`       | `vitest run`                     | Run all tests                  |
| `typecheck`  | `tsc --noEmit`                   | Type-check without emitting    |

---

## packages/shared-types

| Script      | Command          | Description                 |
| ----------- | ---------------- | --------------------------- |
| `build`     | `tsc`            | Compile type declarations   |
| `typecheck` | `tsc --noEmit`   | Type-check                  |
| `lint`      | `eslint .`       | Lint                        |

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

فایل `drizzle.config.ts` در root پکیج `apps/api`:

ts
// filepath: apps/api/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});

---

## CI Pipeline Scripts

CI این مراحل رو به ترتیب اجرا می‌کنه:

bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build

- `db:migrate` در CI فقط برای integration test stage اجرا می‌شه.
- `db:push` هرگز در CI اجرا نمی‌شه.

---

## Script Rules

1. هر پکیج **باید** اسکریپت‌های `build`, `lint`, `typecheck` رو داشته باشه.
2. `test` از `vitest run` استفاده می‌کنه — نه watch mode.
3. `lint` با `--max-warnings=0` — هیچ warning ای قابل قبول نیست.
4. اسکریپت مرده یا موقت ممنوع — حذفش کن یا issue بزن.
5. اسکریپت‌های `db:*` فقط در `apps/api` تعریف می‌شن.
6. `db:push` و `db:reset` فقط در dev — هرگز در production یا CI.

---
