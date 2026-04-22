# DevAtlas TODO

آخرین بازبینی: 2025-02-14
وضعیت مبنا: بر اساس کد فعلی، `README.md`، `docs/ENGINEERING-STATE.md`، `docs/ROADMAP.md`، `.github/workflows/ci.yml` و `infra/docker/docker-compose.yml`

این فایل برای اجرای واقعی پروژه نوشته شده، نه لیست آرزوها. اولویت با توسعه است، بعد دیپلوی، بعد آماده سازی استقرار/پروداکشن و در انتها کارهای خارج از ریپو.

## Legend

- `TODO` انجام نشده و آماده ورود به اسپرینت
- `DOING` در حال انجام/نیازمند ادامه
- `BLOCKED` وابسته به تصمیم یا زیرساخت بیرون از ریپو
- `VERIFY` فقط برای اعتبارسنجی/Go-Live

## Sprint 01 - Development Critical Path

- `TODO` `SPR-01` اصلاح CI فعلی و حذف وابستگی های منقضی Prisma در `.github/workflows/ci.yml`
  - معیار پذیرش: CI فقط از اسکریپت های واقعی repo استفاده کند (`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` یا معادل package-scoped)
  - کار اجرایی:
    - حذف مرحله `prisma:generate` چون در `apps/api/package.json` وجود ندارد و ORM فعال Drizzle است
    - همسان سازی نسخه `pnpm` و `node` با `package.json`
    - افزودن envهای لازم برای تست های DB-backed در صورت نیاز
    - اجرای یک dry-run محلی با سرویس Postgres

- `TODO` `SPR-02` تکمیل چرخه دیتابیس Drizzle در `apps/api`
  - معیار پذیرش: اسکریپت های `db:generate`, `db:migrate`, `db:check` و مستندات اجرایی معتبر باشند
  - کار اجرایی:
    - بازبینی `apps/api/src/db/drizzle.config.ts`, `apps/api/src/db/migrate.ts`
    - افزودن اسکریپت های DB به `apps/api/package.json`
    - ساخت migration baseline و رویه seed/reset واقعی
    - ثبت runbook محلی و staging برای migration/rollback

- `TODO` `SPR-03` اتصال `packages/content` به جریان واقعی داده
  - شواهد: پکیج `@devatlas/content` وجود دارد اما مصرف کننده عملیاتی در `apps/*` ندارد
  - معیار پذیرش: یک ingestion job یا pipeline مشخص، داده را به search/content relations/API وارد کند
  - کار اجرایی:
    - تعیین نقطه ورود: CLI job, bootstrap task یا admin-only endpoint
    - نگاشت خروجی `buildContentIndex` به جداول Drizzle
    - تعریف استراتژی re-index incremental و full rebuild
    - اضافه کردن تست integration برای index/import

- `TODO` `SPR-04` تکمیل تجربه Search در وب
  - شواهد: ماژول `search` در API وجود دارد ولی route عملیاتی وب در snapshot اصلی دیده نمی شود
  - معیار پذیرش: کاربر بتواند از وب جستجو کند، empty/error/loading state داشته باشد و نتایج guide/tool را ببیند
  - کار اجرایی:
    - افزودن route/page برای search در `apps/web/app`
    - استفاده از client مشترک `apps/web/lib/api-client.ts`
    - پوشش debounce, query-state, pagination/filter URL
    - نوشتن تست UI/API adapter برای سناریوهای اصلی

- `TODO` `SPR-05` تکمیل تست های integration قرارداد API
  - شواهد: تنها تست قراردادی شاخص `apps/api/src/modules/__tests__/api-contract.spec.ts` دیده می شود
  - معیار پذیرش: مسیرهای guides/tools/categories/tags/search حداقل happy-path + validation/error-path را پوشش دهند
  - کار اجرایی:
    - اضافه کردن DB-backed test harness پایدار
    - پوشش pagination/filter/sort
    - تست health/readiness با DB واقعی
    - اتصال تست ها به CI جدید

- `TODO` `SPR-06` تکمیل لایه امنیت پایه API/Web
  - شواهد: auth/authz هنوز در roadmap pending است و `.env.example` خالی است
  - معیار پذیرش: rate limit, input sanitization, CORS policy, env contract و secret handling مشخص باشد
  - کار اجرایی:
    - تعریف env schema کامل و پر کردن `.env.example`
    - بازبینی sanitize/validate در ورودی های جستجو و AI
    - افزودن rate limiting و abuse protection
    - تصمیم صریح درباره auth phase-1: public-only یا admin auth

## Sprint 02 - Development Hardening

- `TODO` `SPR-07` تکمیل observability داخلی قبل از استقرار
  - شواهد: trace id, logging و health موجود است اما exporter/alerting هنوز pending است
  - معیار پذیرش: metrics/logs/traces ساختارمند و قابل ارسال به backend مانیتورینگ باشند
  - کار اجرایی:
    - استاندارد کردن log fields و correlation ids
    - افزودن metrics برای search, AI, DB latency
    - تعریف OpenTelemetry/Sentry seam در API و web

- `TODO` `SPR-08` تعریف استراتژی cache برای endpointهای پرترافیک
  - معیار پذیرش: endpointهای list/detail/search دارای سیاست TTL/invalidations باشند
  - کار اجرایی:
    - تحلیل cacheability برای guides/tools/search
    - تصمیم Redis یا in-memory برای phase-1
    - پیاده سازی cache wrapper در service layer

- `TODO` `SPR-09` تثبیت API client و route contracts در web
  - معیار پذیرش: تمام fetchهای وب از seam واحد استفاده کنند و contract drift کاهش یابد
  - کار اجرایی:
    - حذف الگوهای fetch پراکنده باقیمانده
    - اضافه کردن schema validation در مرز client
    - تست نزدیک ترین consumer برای هر shared contract

## Sprint 03 - Deploy Readiness

- `TODO` `DEP-01` تکمیل artefactهای دیپلوی Docker
  - شواهد: `infra/docker/docker-compose.yml` به `infra/docker/Dockerfile.api` و `infra/docker/Dockerfile.web` ارجاع می دهد اما این فایل ها وجود ندارند
  - معیار پذیرش: `docker compose up --build` برای API/Web/Postgres بالا بیاید
  - کار اجرایی:
    - ساخت Dockerfile چندمرحله ای برای API و Web
    - تعریف healthcheck و startup command تولیدی
    - حذف mountهای منسوخ/غیراستفاده مثل مسیر Prisma در compose

- `TODO` `DEP-02` ساخت pipeline دیپلوی staging
  - معیار پذیرش: پس از merge به branch مشخص، artifact ساخته و روی staging منتشر شود
  - کار اجرایی:
    - افزودن workflow جداگانه برای build/publish/deploy
    - تعریف environment secrets و promotion rule
    - اجرای smoke test بعد از deploy

- `TODO` `DEP-03` تکمیل کانفیگ محیط ها و release config
  - معیار پذیرش: local/staging/prod env contract روشن و versioned باشد
  - کار اجرایی:
    - تکمیل `.env.example`
    - تعریف env matrix برای web/api
    - ثبت متغیرهای لازم: `DATABASE_URL`, `NEXT_PUBLIC_API_BASE_URL`, logging/telemetry keys, app URLs

- `TODO` `DEP-04` بازنگری CI/CD برای monorepo package-scoped execution
  - معیار پذیرش: pipeline فقط surface تغییر یافته را verify کند ولی برای release مسیر full verify داشته باشد
  - کار اجرایی:
    - استفاده از Turbo/pnpm filters در CI
    - تفکیک fast checks از release checks
    - انتشار artifact قابل ردیابی با commit SHA

## Sprint 04 - Production / Go-Live

- `TODO` `PRD-01` استقرار observability واقعی
  - معیار پذیرش: dashboard, log aggregation, alert rules و uptime monitor فعال باشد
  - کار اجرایی:
    - انتخاب stack: Grafana/Loki/Tempo یا Sentry + hosted metrics
    - آلارم برای health/readiness failure, 5xx spike, DB saturation
    - داشبورد latency برای API و Web

- `TODO` `PRD-02` تهیه runbook انتشار، rollback و incident response
  - معیار پذیرش: تیم بتواند بدون دانش ضمنی release و rollback انجام دهد
  - کار اجرایی:
    - مستندسازی migration order
    - تعریف smoke checklist
    - تعریف owner و on-call escalation path

- `TODO` `PRD-03` اجرای load/security validation قبل از production cutover
  - معیار پذیرش: baseline عملکرد و security checklist ثبت و تایید شده باشد
  - کار اجرایی:
    - load test برای list/search/detail endpoints
    - dependency audit و secret scan
    - تست abuse روی AI/search endpoints

- `VERIFY` `PRD-04` اجرای full verification نهایی
  - معیار پذیرش: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` روی release candidate سبز باشد
  - کار اجرایی:
    - اجرای verify package-scoped برای surfaceهای درگیر
    - اجرای health/smoke بعد از deploy staging و production

## Outside Repo / Operational Tasks

- `BLOCKED` `OPS-01` تهیه زیرساخت staging و production
  - شامل: VM/Kubernetes/Vercel target, شبکه, فایروال, reverse proxy, SSL, DNS

- `BLOCKED` `OPS-02` راه اندازی PostgreSQL مدیریتی
  - شامل: backup policy, PITR/restore test, migration window, credential rotation

- `BLOCKED` `OPS-03` مدیریت secrets و دسترسی ها
  - شامل: secret manager, least-privilege accounts, CI deploy token, production env rotation

- `BLOCKED` `OPS-04` ثبت دامنه و سرویس های جانبی
  - شامل: CDN/WAF, email provider, uptime monitor, error tracking account, telemetry backend

- `BLOCKED` `OPS-05` تعریف process عملیاتی تیم
  - شامل: branching/release policy, ownership map, deploy approval flow, incident channel, maintenance window

## Suggested Execution Order

1. `SPR-01` → `SPR-02` → `SPR-03`
2. `SPR-04` → `SPR-05` → `SPR-06`
3. `SPR-07` → `SPR-08` → `SPR-09`
4. `DEP-01` → `DEP-03` → `DEP-02` → `DEP-04`
5. `PRD-01` → `PRD-02` → `PRD-03` → `PRD-04`
6. `OPS-01` تا `OPS-05` به موازات اسپرینت های Deploy/Production

## VS Code Sync Notes

- این فایل عمدا با تگ های `TODO`, `DOING`, `BLOCKED`, `VERIFY` نوشته شده تا افزونه `Todo Tree` آن را به صورت خودکار index کند.
- برای مشاهده تسک ها در VS Code:
  - Command Palette → `Todo Tree: Show Tree`
  - یا تسک `Backlog: Pending TODOs` را اجرا کنید
- هر تسک جدید را با همان الگو ثبت کنید: ``- `TODO` `SPR-10` شرح کوتاه``
