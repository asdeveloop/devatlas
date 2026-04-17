# DevAtlas Platform

DevAtlas یک پلتفرم دانش فنی برای دولوپرهاست که با تمرکز بر **پایداری در شرایط اینترنت محدود** و **local-first بودن** طراحی شده است. این مخزن یک **monorepo** مبتنی بر `pnpm` و `Turborepo` است که شامل سرویس‌های اصلی زیر می‌باشد:

- `@devatlas/web` — فرانت‌اند (Next.js 16 + React 19 + TailwindCSS)
- `@devatlas/api` — بک‌اند (NestJS 11 + Prisma 6 + PostgreSQL)
- پکیج‌های مشترک در مسیر `packages/`
  - `@devatlas/api-client`
  - `@devatlas/types`

وضعیت فعلی: توسعه در حال انجام، تمرکز روی پایدارسازی core و حلقه اصلی محتوا.

---

## Tech Stack

### Frontend
- Next.js 16.1.6
- React 19.2.4
- TailwindCSS 3
- Radix UI + shadcn-like UI
- lucide-react
- framer-motion

### Backend
- NestJS 11
- Prisma 6
- PostgreSQL 15+

### Monorepo / Tooling
- pnpm@9
- Turborepo
- TypeScript 5.9
- ESLint 9 + @typescript-eslint
- Vitest 3
- commitlint + lint-staged

---

## Monorepo Structure

```text
devatlas-main/
  apps/
    api/      # سرویس NestJS
    web/      # اپ Next.js
  packages/
    api-client/
    types/
  prisma/
    schema.prisma
  scripts/
    prepare-prisma-engines.mjs
    combine-files.js
  package.json
  pnpm-workspace.yaml
  turbo.json
  .gitlab-ci.yml
  README.md
  CONTRIBUTING.md
  LICENSE
  CHANGELOG.md
```

---

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+

---

## Installation

```bash
pnpm install
```

---

## Environment Setup

نمونه فایل env برای API:

```bash
# apps/api/.env
DATABASE_URL="postgresql://user:password@localhost:5432/devatlas"
```

سایر envها بسته به نیاز هر سرویس.

---

## Development

اجرای هم‌زمان سرویس‌ها:

```bash
pnpm dev
```

اجرای مجزا:

```bash
pnpm --filter @devatlas/api dev
pnpm --filter @devatlas/web dev
```

---

## Root Scripts

```bash
pnpm dev
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm health
pnpm prepare:prisma
```

---

## Testing

```bash
pnpm test
pnpm --filter @devatlas/api test
pnpm --filter @devatlas/web test
```

---

## CI/CD

این ریپو برای GitLab طراحی شده و شامل فایل `.gitlab-ci.yml` است که مراحل زیر را اجرا می‌کند:

- prepare
- lint
- test
- typecheck
- build

تنظیم Runner باید در GitLab UI انجام شود.

---

## Contributing

راهنمای مشارکت در مسیر:

[`CONTRIBUTING.md`](./CONTRIBUTING.md)

---

## License

پروژه تحت لایسنس MIT منتشر شده است. متن کامل در:

[`LICENSE`](./LICENSE)

---
