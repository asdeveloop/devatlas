# Changelog

تمام تغییرات مهم این پروژه در این فایل ثبت می‌شود.

این سند با فرمت استاندارد [Keep a Changelog](https://keepachangelog.com/) نوشته شده و از نسخه‌گذاری [Semantic Versioning](https://semver.org/) پیروی می‌کند.

---

## [0.1.0] - 2026-04-17

### Added
- ایجاد ساختار اولیه monorepo با `pnpm` و `Turborepo`
- افزودن سرویس‌های:
  - `@devatlas/api` (NestJS 11 + Prisma 6)
  - `@devatlas/web` (Next.js 16 + React 19)
- ایجاد پکیج‌های shared:
  - `@devatlas/types`
  - `@devatlas/api-client`
- تنظیم CI پایه GitLab
- اضافه شدن lint، test، typecheck، build در سطح monorepo
- مستندات: README، CONTRIBUTING، LICENSE
- اسکریپت `prepare:prisma`

---

## [Unreleased]
- توسعه قابلیت‌های core پلتفرم
