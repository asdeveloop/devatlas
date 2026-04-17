# راهنمای مشارکت در DevAtlas

این سند توضیح می‌دهد چگونه در توسعه DevAtlas مشارکت کنید. حتی اگر تنها contributor فعلی پروژه باشید، رعایت این الگو باعث حفظ کیفیت و انسجام بلندمدت پروژه می‌شود.

---

## Requirements

- Node.js 20+
- pnpm 9
- PostgreSQL 15+

---

## Setup

```bash
pnpm install
pnpm prepare:prisma
```

---

## Branching Workflow

نام‌گذاری استاندارد:

- feat/<name>
- fix/<name>
- chore/<name>
- docs/<name>

نمونه‌ها:

```text
feat/core-search
fix/category-pagination
chore/ci-cache
docs/architecture-phase2
```

---

## Commit Messages (Conventional Commits)

فرمت کلی:

```text
<type>(scope): message
```

Types معتبر:

- feat
- fix
- chore
- refactor
- docs
- test
- perf
- ci

نمونه:

```text
feat(api): add category listing endpoint
fix(web): correct active menu state
ci(gitlab): enable pnpm cache
```

---

## Quality Checks

قبل از push:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm health
```

---

## Monorepo Development

ساختار اصلی:

- `apps/api` — NestJS
- `apps/web` — Next.js
- `packages/*` — shared modules

اجرای سرویس خاص:

```bash
pnpm --filter @devatlas/api dev
pnpm --filter @devatlas/web dev
```

---

## Code Style

- کدنویسی تماماً با TypeScript
- استفاده نکردن از any
- ESLint و prettier توسط lint-staged اجرا می‌شوند
- ساختار مطابق الگوی موجود در اپ‌ها

---

## Tests

نمونه اجرا:

```bash
pnpm --filter @devatlas/api test
pnpm --filter @devatlas/web test
```

---

## CI/CD

GitLab CI مراحل زیر را اجرا می‌کند:

- pnpm install
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

بدون نیاز به تنظیمات اضافی در ریپو.

---

## Reporting Issues

برای گزارش باگ یا فیچر:

- عنوان واضح
- توضیح دقیق
- steps to reproduce
- انتظار رفتاری
- محیط (OS, Node, PostgreSQL)

---

## Notes

- پروژه برای شرایط اینترنت محدود طراحی شده است.
- افزودن dependency باید توجیه فنی داشته باشد.
- نسخه‌ها باید pinned یا رنج امن باشند.
