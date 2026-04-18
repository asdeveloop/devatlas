# DevAtlas Platform

DevAtlas یک پلتفرم دانش فنی برای دولوپرهاست که با تمرکز بر **پایداری در شرایط اینترنت محدود** و **local-first بودن** طراحی شده است. این مخزن یک **monorepo** مبتنی بر `pnpm` و `Turborepo` است که شامل سرویس‌های اصلی زیر می‌باشد:

- `@devatlas/web` — فرانت‌اند (Next.js 16 + React 19 + TailwindCSS)
- `@devatlas/api` — بک‌اند (NestJS 11 + Drizzle ORM + PostgreSQL)
- پکیج‌های مشترک در مسیر `packages/`
  - `@devatlas/shared-types`
  - `@devatlas/ui`

وضعیت فعلی: **Phase 1 (ORM Migration)** — در حال جایگزینی Prisma با Drizzle ORM.

---

## Tech Stack

### Frontend
- Next.js 16.1.6
- React 19.2.4
- TailwindCSS 3.4.17
- Radix UI + shadcn-like UI
- lucide-react
- framer-motion

### Backend
- NestJS 11
- Drizzle ORM 0.36+
- PostgreSQL 15+
- Zod (validation)

### Monorepo / Tooling
- pnpm 9+
- Turborepo
- TypeScript 5.9+
- ESLint 9 + @typescript-eslint
- Vitest 3
- commitlint + lint-staged

---

## Monorepo Structure

```text
devatlas-platform/
  apps/
    api/                    # NestJS + Drizzle ORM
      src/
        database/
          schema/           # Drizzle schema definitions
        modules/            # Feature modules
      drizzle/              # Migration files
      drizzle.config.ts
    web/                    # Next.js 16 + React 19
      src/
        app/
        components/
  packages/
    shared-types/           # Shared TypeScript types
    ui/                     # Shared React components
  package.json
  pnpm-workspace.yaml
  turbo.json
  .gitlab-ci.yml
  README.md
  CONTRIBUTING.md
  ROADMAP.md
  ENGINEERING-STATE.md
  LICENSE

---

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+
- Git 2.40+

---

## Quick Start

### 1. Clone و نصب

bash
git clone <repository-url>
cd devatlas-platform
pnpm install

### 2. تنظیم دیتابیس

فایل `.env` در `apps/api` بساز:

bash
cp apps/api/.env.example apps/api/.env

محتوای `.env`:

env
DATABASE_URL="postgresql://user:password@localhost:5432/devatlas_dev"
NODE_ENV="development"
PORT=3001

### 3. اجرای migration ها

bash
cd apps/api
pnpm db:migrate

### 4. Seed دیتابیس (اختیاری)

bash
cd apps/api
pnpm db:seed

### 5. اجرای dev server

bash
# از root پروژه
pnpm dev

این دستور هر دو `apps/api` (port 3001) و `apps/web` (port 3000) را به صورت همزمان اجرا می‌کنه.

---

## Root Scripts

| Script       | Description                              |
| ------------ | ---------------------------------------- |
| `pnpm dev`   | اجرای همزمان تمام سرویس‌ها در dev mode   |
| `pnpm build` | Build تمام پکیج‌ها                       |
| `pnpm lint`  | Lint تمام پکیج‌ها                        |
| `pnpm test`  | اجرای تمام تست‌ها                        |
| `pnpm typecheck` | Type-check تمام پکیج‌ها               |
| `pnpm health` | اجرای typecheck + lint + test          |
| `pnpm clean` | پاک کردن build artifacts                |
| `pnpm format` | Format کردن کل codebase                |

---

## Development

### اجرای همزمان سرویس‌ها

bash
pnpm dev

### اجرای مجزا

bash
# فقط API
pnpm --filter @devatlas/api dev

# فقط Web
pnpm --filter @devatlas/web dev

### اضافه کردن dependency

bash
# به api
pnpm --filter @devatlas/api add <package-name>

# به web
pnpm --filter @devatlas/web add <package-name>

# به root (dev dependency)
pnpm add -D -w <package-name>

---

## Database Management (Drizzle)

### تغییر schema

bash
cd apps/api

# 1. ویرایش schema در src/database/schema/
# 2. تولید migration
pnpm db:generate

# 3. review فایل migration در drizzle/
# 4. اعمال migration
pnpm db:migrate

### Drizzle Studio

bash
cd apps/api
pnpm db:studio
# باز می‌شه در: https://local.drizzle.studio

### Push مستقیم schema (فقط dev)

bash
cd apps/api
pnpm db:push

⚠️ **هشدار:** این دستور destructive هست — فقط در dev استفاده کن.

### Reset دیتابیس (فقط dev)

bash
cd apps/api
pnpm db:reset

---

## Testing

bash
# تمام تست‌ها
pnpm test

# فقط API
pnpm --filter @devatlas/api test

# فقط Web
pnpm --filter @devatlas/web test

# با coverage
pnpm --filter @devatlas/api test:cov

---

## Build

bash
# تمام پکیج‌ها
pnpm build

# فقط API
pnpm --filter @devatlas/api build

# فقط Web
pnpm --filter @devatlas/web build

---

## CI/CD

این ریپو برای GitLab طراحی شده و شامل فایل `.gitlab-ci.yml` است که مراحل زیر را اجرا می‌کند:

yaml
stages:
  - prepare
  - lint
  - test
  - typecheck
  - build

### Pipeline Steps

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck`
3. `pnpm lint`
4. `pnpm test`
5. `pnpm build`

تنظیم Runner باید در GitLab UI انجام شود.

---

## Project Status

وضعیت فعلی پروژه در:

- [`ROADMAP.md`](./ROADMAP.md) — فازبندی و اهداف
- [`ENGINEERING-STATE.md`](./ENGINEERING-STATE.md) — وضعیت فنی و آیتم‌های باقی‌مانده

**Phase فعلی:** Phase 1 — ORM Migration (Prisma → Drizzle)

---

## Documentation

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — راهنمای مشارکت
- [`ROADMAP.md`](./ROADMAP.md) — نقشه راه پروژه
- [`ENGINEERING-STATE.md`](./ENGINEERING-STATE.md) — وضعیت فنی
- [`SCRIPTS.md`](./SCRIPTS.md) — مرجع اسکریپت‌ها
- [`API Contract.md`](./API%20Contract.md) — قرارداد API
- [`STANDARDS.md`](./STANDARDS.md) — استانداردها و محدودیت‌ها
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — معماری سیستم
- [`VISION.md`](./VISION.md) — چشم‌انداز پروژه

---

## Contributing

راهنمای مشارکت در:

[`CONTRIBUTING.md`](./CONTRIBUTING.md)

خلاصه:

- Conventional Commits
- Branching: `feat/`, `fix/`, `chore/`, `docs/`
- Quality checks: `pnpm typecheck && pnpm lint && pnpm test`
- Drizzle migration ها باید review شن

---

## License

پروژه تحت لایسنس MIT منتشر شده است. متن کامل در:

[`LICENSE`](./LICENSE)

---

## Contact & Support

برای گزارش باگ یا درخواست فیچر، issue باز کنید.

---

**Last updated:** 1405/01/29 (2026-04-18)

---
