# راهنمای مشارکت در DevAtlas

این سند توضیح می‌دهد چگونه در توسعه DevAtlas مشارکت کنید. حتی اگر تنها contributor فعلی پروژه باشید، رعایت این الگو باعث حفظ کیفیت و انسجام بلندمدت پروژه می‌شود.

---

## Requirements

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+
- Git 2.40+

---

## Setup

### 1. Clone و نصب dependencies

```bash
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

این دستور هر دو `apps/api` و `apps/web` را به صورت همزمان اجرا می‌کنه.

---

## Branching Workflow

نام‌گذاری استاندارد:

- `feat/<name>` — فیچر جدید
- `fix/<name>` — رفع باگ
- `chore/<name>` — کارهای نگهداری (deps, config)
- `docs/<name>` — تغییرات مستندات
- `refactor/<name>` — بازنویسی بدون تغییر رفتار

نمونه‌ها:

text
feat/core-search
fix/category-pagination
chore/upgrade-drizzle
docs/architecture-phase2
refactor/query-builder-abstraction

---

## Commit Messages (Conventional Commits)

فرمت کلی:

text
<type>(scope): message

Types معتبر:

- `feat` — فیچر جدید
- `fix` — رفع باگ
- `chore` — نگهداری (deps, scripts)
- `refactor` — بازنویسی بدون تغییر رفتار
- `docs` — تغییرات مستندات
- `test` — اضافه یا اصلاح تست
- `perf` — بهبود performance
- `ci` — تغییرات CI/CD

نمونه:

text
feat(api): add category listing endpoint
fix(web): correct active menu state
chore(api): upgrade drizzle-orm to 0.36.0
ci(gitlab): enable pnpm cache
docs(roadmap): update Phase 2 completion criteria

---

## Quality Checks

قبل از push حتماً این دستورات رو اجرا کن:

bash
pnpm typecheck
pnpm lint
pnpm test

یا به صورت یکجا:

bash
pnpm health

اگر هر کدوم fail شد، commit نکن.

---

## Monorepo Development

ساختار اصلی:


apps/
  api/          — NestJS + Drizzle ORM
  web/          — Next.js 16 + React 19
packages/
  shared-types/ — Type definitions مشترک
  ui/           — React components مشترک

### اجرای سرویس خاص

bash
# فقط API
pnpm --filter @devatlas/api dev

# فقط Web
pnpm --filter @devatlas/web dev

# هر دو
pnpm dev

### اجرای تست برای یک پکیج

bash
pnpm --filter @devatlas/api test
pnpm --filter @devatlas/web test

### اضافه کردن dependency به یک پکیج

bash
# به api
pnpm --filter @devatlas/api add <package-name>

# به web
pnpm --filter @devatlas/web add <package-name>

# به root (dev dependency)
pnpm add -D -w <package-name>

---

## Database Workflow (Drizzle)

### تغییر schema

1. فایل schema رو ویرایش کن: `apps/api/src/database/schema/`
2. migration تولید کن:

bash
cd apps/api
pnpm db:generate

3. migration رو review کن: `apps/api/drizzle/XXXX_migration_name.sql`
4. migration رو اعمال کن:

bash
pnpm db:migrate

### Push مستقیم schema (فقط dev)

اگر می‌خوای بدون تولید migration فایل، schema رو مستقیم push کنی:

bash
cd apps/api
pnpm db:push

⚠️ **هشدار:** این دستور destructive هست — فقط در dev استفاده کن.

### Drizzle Studio

برای مشاهده و ویرایش دیتابیس:

bash
cd apps/api
pnpm db:studio

باز می‌شه در: `https://local.drizzle.studio`

### Reset دیتابیس (فقط dev)

bash
cd apps/api
pnpm db:reset

این دستور تمام دیتا رو پاک می‌کنه، schema رو از صفر push می‌کنه و seed می‌زنه.

---

## Code Style

- کدنویسی تماماً با TypeScript — استفاده از `any` ممنوع
- ESLint و Prettier توسط `lint-staged` اجرا می‌شوند
- ساختار مطابق الگوی موجود در اپ‌ها
- تمام entity ها و DTO ها باید type-safe باشن
- استفاده از Zod برای validation ورودی
- استفاده از Drizzle query builder — نه raw SQL (مگر موارد استثنایی)

### نام‌گذاری

- فایل‌ها: `kebab-case.ts`
- کلاس‌ها: `PascalCase`
- متغیرها و توابع: `camelCase`
- ثابت‌ها: `UPPER_SNAKE_CASE`
- Interface ها: `PascalCase` (بدون prefix `I`)
- Type ها: `PascalCase`

---

## Tests

### اجرای تست‌ها

bash
# تمام تست‌ها
pnpm test

# فقط API
pnpm --filter @devatlas/api test

# فقط Web
pnpm --filter @devatlas/web test

# با coverage
pnpm --filter @devatlas/api test:cov

### نوشتن تست

- تست‌ها در کنار فایل اصلی: `*.spec.ts`
- استفاده از Vitest
- Mock کردن Drizzle queries با `vi.mock()`
- تست integration برای endpoint ها
- تست unit برای service logic

---

## CI/CD

GitLab CI مراحل زیر را اجرا می‌کند:

bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build

بدون نیاز به تنظیمات اضافی در ریپو.

### Migration در CI

- Migration ها در CI اجرا **نمی‌شن** — فقط در deployment pipeline.
- `db:push` هرگز در CI اجرا نمی‌شه.

---

## Reporting Issues

برای گزارش باگ یا فیچر:

- عنوان واضح و مختصر
- توضیح دقیق مشکل یا فیچر
- Steps to reproduce (برای باگ)
- انتظار رفتاری (expected behavior)
- محیط (OS, Node version, PostgreSQL version)
- لاگ‌های مربوطه (اگر هست)

---

## Pull Request Checklist

قبل از ارسال PR:

- [ ] `pnpm typecheck` بدون خطا
- [ ] `pnpm lint` بدون warning
- [ ] `pnpm test` تمام تست‌ها pass
- [ ] تست‌های جدید برای فیچر/باگ اضافه شده
- [ ] مستندات (اگر لازم) به‌روز شده
- [ ] Commit message ها مطابق Conventional Commits
- [ ] Branch از `main` به‌روز شده (rebase)

---

## Notes

- پروژه برای شرایط اینترنت محدود طراحی شده است.
- افزودن dependency باید توجیه فنی داشته باشد.
- نسخه‌ها باید pinned یا رنج امن باشند.
- هیچ secret یا credential در کد commit نشه — استفاده از `.env` اجباری.
- Drizzle migration ها باید قبل از merge به `main` review شن.

---
