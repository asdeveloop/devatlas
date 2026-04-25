# DevAtlas Database Runbook

این runbook مسیر canonical دیتابیس برای `apps/api` را نگه می دارد و باید با اسکریپت های واقعی repo هماهنگ بماند.

## Scope

- migration lifecycle با Drizzle
- seed رسمی مبتنی بر محتوا
- rollback با migration جبرانی

## Canonical Flow

1. مطمئن شوید `DATABASE_URL` روی دیتابیس هدف ست شده است.
2. برای تغییر schema:
   - `pnpm --filter @devatlas/api db:generate`
   - SQL تولیدشده در `apps/api/drizzle` را بازبینی کنید
   - `pnpm --filter @devatlas/api db:check`
   - `pnpm --filter @devatlas/api db:migrate`
3. برای seed داده محتوایی:
   - `CONTENT_DIR=<path> pnpm --filter @devatlas/api db:seed`
4. فقط وقتی لازم است search را مستقل از ingest rebuild کنید:
   - `pnpm --filter @devatlas/api search:reindex`

## Rollback Policy

- migration commit شده را ویرایش نکنید.
- rollback باید با migration جبرانی جدید انجام شود.
- قبل از هر rollback، از دیتابیس backup بگیرید.

برای چاپ plan عملیاتی rollback:

```bash
pnpm --filter @devatlas/api db:rollback:plan
```

این plan آخرین migration ثبت شده در `apps/api/drizzle/meta/_journal.json` را مبنا قرار می دهد و checklist جبران را چاپ می کند.

## Required Environment

- `DATABASE_URL`: برای `db:check`, `db:export`, `db:migrate`, `db:rollback:plan`
- `CONTENT_DIR`: برای `db:seed`
- `SEARCH_REINDEX_AFTER_SEED=1`: فقط اگر بعد از seed نیاز به `search:reindex` دارید

## Verify

```bash
pnpm --filter @devatlas/api typecheck
pnpm --filter @devatlas/api test
pnpm --filter @devatlas/api db:check
```
