# DevAtlas Operations Runbook

این runbook canonical جریان‌های عملیاتی `release`, `migration`, `rollback` و `incident` را روی محیط staging پوشش می‌دهد و برای اجرای دستی/خودکار فقط روی اسکریپت‌ها و endpointهای موجود repo تکیه می‌کند.

## Canonical Environment and Checks

- API smoke base: `https://staging.alirezasafeidev.ir` (در صورت self-signed، از `--insecure` استفاده شود)
- Canonical endpointهای عملیات:
  - `GET /api/v1/health/live`
  - `GET /api/v1/health/ready`
  - `GET /api/v1/health`
  - `GET /api/v1/health/metrics`
  - `POST /api/v1/search`
  - `GET /` (landing check)

تمام checks خروجی می‌گیرند و در صورت non-2xx/expectation failure fail می‌شوند.

## 1) Release Flow

1. **prepare release**
   - `git status` باید تمیز باشد.
   - `git pull` و branch مورد نظر روی remote آماده باشد.
   - migrationهای لازم قبل از deploy اجرا شده یا در release window برنامه‌ریزی شوند.

2. **deploy staging**
   - deploy همراه با اجرای smoke stack:
   ```bash
   pnpm deploy:staging -- --sync-remote --smoke-query React --release-label <slug>
   ```
   - برای smoke-only روی release فعلی:
   ```bash
   pnpm deploy:staging -- --skip-deploy --insecure --smoke-query React
   ```

3. **expected output checks**
   - deploy helper commit label/SHA را چاپ می‌کند.
   - helper endpointهای canonical health/search را چک می‌کند.
   - helper از `pnpm search:smoke` برای validation API استفاده می‌کند.

4. **post-release smoke contract**
   - اجرای دستی مجدد smoke روی public API:
   ```bash
   pnpm search:smoke -- --api https://staging.alirezasafeidev.ir --query React --insecure
   ```
   - اگر دیتابیس یا search لازم است: `pnpm search:smoke -- --api https://staging.alirezasafeidev.ir --ingest-pipeline --content-dir <path> --insecure --require-positive`

## 2) Migration Flow

Migration از مسیر canonical زیر انجام می‌شود:

1. `DATABASE_URL=<staging-db-url>` را ست کنید.
2. بررسی SQL جدید:
   - `pnpm --filter @devatlas/api db:generate`
   - SQL تولیدشده در `apps/api/drizzle` را بازبینی کنید.
3. اعتبارسنجی و اعمال:
   - `pnpm --filter @devatlas/api db:check`
   - `pnpm --filter @devatlas/api db:migrate`
4. seed (در صورت نیاز):
   - `CONTENT_DIR=<path> pnpm --filter @devatlas/api db:seed`
5. اگر جدول‌های search نیاز به rebuild دارند:
   - `pnpm --filter @devatlas/api search:reindex`

## 3) Rollback Flow

### 3.1 rollback database

- Plan:
  ```bash
  pnpm --filter @devatlas/api db:rollback:plan
  ```
- اجرای rollback:
  - یک migration جبرانی جدید در branch/PR جدا بسازید و migrate کنید.
  - طبق plan اقدام کنید: create migration, review, `pnpm --filter @devatlas/api db:migrate`, seed اگر لازم است.

### 3.2 staging data rehearsal (STAGING-DATA-01)

- اجرای rehearsal داده staging (seed + backup/restore + smoke + rollback-plan):
  ```bash
  pnpm staging:data -- --api https://staging.alirezasafeidev.ir --content-dir <path> --smoke-query React --require-positive --insecure
  ```
- رفتار پیش‌فرض:
  - دستورهای backup/restore در dry-run اجرا می‌شوند و تغییر واقعی DB انجام نمی‌دهند.
  - برای اجرای واقعی backup و restore staging، این flag را اضافه کنید:
    `--execute-backup-restore`
- اجرای کامل dry-run به این ترتیب انجام می‌شود:
  1. `pg_dump` (dry-run)  
  2. `db:seed` (content-based)
  3. `search` smoke
  4. `db:rollback:plan`
  5. `psql restore` (dry-run unless `--execute-backup-restore`)
  6. smoke بعد از بازیابی

برای اجرای یک فرمان یکپارچهٔ readiness staging:

```bash
pnpm staging:readiness -- --sync-remote --insecure --smoke-query React --content-dir <path>
```

این دستور یک فایل manifest در `./tmp/staging-readiness/` می‌نویسد (قابل attach برای تصمیم‌گیری incident):
`{"releasedAt","status","release","steps"}`.

برای تمرین واقعی backup/restore:

```bash
pnpm staging:readiness -- --sync-remote --insecure --smoke-query React --content-dir <path> --execute-backup-restore
```

### 3.3 rollback staging release

1. commit سالم قبلی/last known good را مشخص کنید.
2. همان commit را با `--ref` redeploy کنید:
   ```bash
   pnpm deploy:staging -- --sync-remote --insecure --ref <sha-or-tag>
   ```
3. smoke کامل را دوباره اجرا کنید:
   ```bash
   pnpm deploy:staging -- --skip-deploy --insecure --smoke-query React
   ```
4. تا زمان pass شدن continuous smoke/release checks، deploy بعدی انجام نشود.

## 4) Incident Response (staging)

1. **Detection**
   - `/api/v1/health/live` یا `/api/v1/health/ready` fail شدن > immediate incident.
   - spike شدید error/restart در `search` یا `ai` endpoints و `metrics` غیرعادی.
   - برای تشخیص برون‌سروری:
     - `pnpm ops:alerts -- --api https://staging.alirezasafeidev.ir --fail-on warn`
2. **containment**
   - `pnpm deploy:staging -- --skip-deploy --insecure --smoke-query React` اجرا کنید تا صحت پایه سریع بررسی شود.
   - برای regression DB-مرتبط: `pnpm --filter @devatlas/api db:check`.
3. **diagnostics**
   - مقایسه commit فعلی با خروجی helper (`release label/SHA`) در `deploy:staging`.
   - `/api/v1/health/metrics` را چند بار در یک بازه کم (پایدار/ready) بخوانید.
4. **recovery**
   - اگر خطا از release اخیر است: rollback staging به last known good ref.
   - اگر از migration است: `db:rollback:plan` و migration جبرانی.
5. **closure**
   - علت ریشه‌ای، commit، endpointهای خراب و اقدام اصلاحی را در چک‌لیست incident ثبت کنید.
