# Roadmap 30-Step DevAtlas (Production-Grade)

این نسخه بر اساس وضعیت واقعی repository به‌روزرسانی شده است و علاوه بر status فعلی، «تسک اجرایی بعدی» را هم به‌شکل صریح و اولویت‌بندی‌شده مشخص می‌کند.

وضعیت‌ها:

- `[✓ Done]` انجام‌شده و قابل مشاهده در repo
- `[~ Partial]` بخشی از کار انجام شده ولی هنوز کامل/متصل/production-ready نیست
- `[ ] Pending` هنوز در repo پیاده‌سازی معنادار ندارد

---

## بخش A — Foundations & Design (مرحله‌های 1 تا 5)

1. **[✓ Done] تحلیل کامل Monorepo و مستندات معماری**
   - شواهد: `docs/ARCHITECTURE.md`, `docs/VISION.md`, `docs/ROADMAP.md`, `docs/ENGINEERING-STATE.md`
   - ساختار monorepo با `apps/`, `packages/`, `infra/`, `turbo.json`, `pnpm-workspace.yaml` مشخص و مستند شده است

2. **[✓ Done] تحلیل کامل Types Package**
   - شواهد: `packages/types/src/content`, `packages/types/src/api`, `packages/types/src/database`, `packages/types/src/validation`
   - تایپ‌ها، schemaها و قراردادهای پایه در repo وجود دارند

3. **[✓ Done] تحلیل کامل Backend (apps/api)**
   - شواهد: `apps/api/src/modules`, `apps/api/prisma/schema.prisma`
   - ساختار Controller / Service / Repository / DTO / Prisma در backend شکل گرفته و فعال است

4. **[✓ Done] طراحی API Contract نهایی برای کل Platform**
   - شواهد: `docs/API Contract.md`, Swagger setup در `apps/api/src/main.ts`
   - قرارداد API برای Guides, Tools, Categories, Tags مستند شده و backend به‌صورت معنادار به آن نزدیک شده است

5. **[✓ Done] تعریف Coding Standards و Architecture Constraints**
   - شواهد: `docs/Coding_Standards_Architecture_Constraints.md`, `eslint.config.mjs`, `commitlint.config.js`
   - استانداردهای naming، ساختار، error format و قواعد commit/lint مستند شده‌اند

---

## بخش B — Core Development (مرحله‌های 6 تا 18)

6. **[~ Partial] Phase 1 — Types Package Refactor**
   - ساختار اصلی package انجام شده و ماژول‌های `content`, `api`, `database`, `validation` وجود دارند
   - هنوز نشانه‌هایی از overlap / duplication دیده می‌شود؛ مثل `packages/types/src/guides/enums.ts`

7. **[~ Partial] Phase 2 — Backend Contracts Alignment**
   - backend تا حدی از `@devatlas/types` استفاده می‌کند
   - هنوز ناهماهنگی وجود دارد: پاسخ‌ها، query params، naming و route semantics کاملاً یکدست نیستند

8. **[~ Partial] Phase 3 — Guides API Finalization**
   - ماژول Guides فعال است: `apps/api/src/modules/guides`
   - CRUD پایه و query DTO وجود دارد، اما behavior نهایی production-grade هنوز تثبیت نشده است

9. **[~ Partial] Phase 4 — Tools API Module**
   - فایل‌های module/controller/service/repository/DTO موجودند: `apps/api/src/modules/tools`
   - ماژول فعال است، اما هنوز برای production-grade به پالایش contract و تست‌های عمیق‌تر نیاز دارد

10. **[~ Partial] Phase 5 — Categories API Module**
   - اسکلت ماژول کامل موجود است: `apps/api/src/modules/categories`
   - ماژول متصل شده است، ولی بعضی naming/behaviorها هنوز با contract نهایی کاملاً یکسان نیستند

11. **[~ Partial] Phase 6 — Tags API Module**
   - اسکلت ماژول کامل موجود است: `apps/api/src/modules/tags`
   - ماژول متصل شده است، اما هنوز در سطح production-ready کامل از نظر contract/test coverage نیست

12. **[~ Partial] Phase 7 — Content Indexer Integration**
   - package محتوا و pipeline/indexer وجود دارد: `packages/content/src/pipeline`, `packages/content/src/indexer`
   - اتصال end-to-end بین content package → database → api هنوز عملیاتی نشده است

13. **[✓ Done] Phase 8 — API Error Handling Unification**
   - `TransformInterceptor`, `HttpExceptionFilter` و `RequestLoggerInterceptor` پاسخ/خطا را با envelope یکدست برمی‌گردانند
   - `traceId` برای هر request تولید/پاس داده می‌شود
   - سرویس‌های `guides`, `tools`, `categories`, `tags` روی `DomainError`/`ErrorFactory` هم‌راستا شده‌اند

14. **[~ Partial] Phase 9 — Observability Layer**
   - `traceId` و request logging وجود دارد و health endpoint فعال است
   - metrics/tracing exporter production و dashboard integration هنوز پیاده نشده است

15. **[ ] Phase 10 — Authentication Layer (اختیاری فعلاً)**
   - شواهدی از token auth / API key / rate limit در repo دیده نشد

16. **[ ] Phase 11 — Authorization Layer**
   - شواهدی از RBAC, scopes یا policy enforcement در repo دیده نشد

17. **[ ] Phase 12 — Input Sanitization & Security Audit**
   - validation پایه با DTO/class-validator وجود دارد
   - اما audit امنیتی، sanitization صریح و hardening production-grade هنوز در repo مشخص نیست

18. **[ ] Phase 13 — Internal Caching Layer**
   - Redis یا cache invalidation لایه داخلی در repo دیده نشد

---

## بخش C — Frontend Integration (مرحله‌های 19 تا 23)

19. **[~ Partial] Web App: API Client Unification**
   - package اختصاصی client وجود دارد: `packages/api-client`
   - هنوز چند الگوی fetch موازی در featureها دیده می‌شود

20. **[~ Partial] Web App: Guides Integration Stability**
   - صفحه‌ها و کامپوننت‌های Guides وجود دارند: `apps/web/features/guides`, `apps/web/app/guides`
   - routeها فعال‌اند، اما shape پاسخ‌ها و flow نهایی هنوز نیاز به پالایش دارد

21. **[~ Partial] Web App: Tools Integration**
   - `apps/web/features/tools/api/get-tools.ts` وجود دارد و صفحه خانه از آن استفاده می‌کند
   - هنوز UI/flow کامل و پایدار برای Tools دیده نمی‌شود

22. **[~ Partial] Web App: Navigation Architecture Cleanup**
   - navigation feature و shared shell موجود است
   - coexistence بین `app/` و `features/` هنوز نشان می‌دهد cleanup معماری کامل نشده است

23. **[~ Partial] Web App: Search UX implementation**
   - hook پایه وجود دارد: `apps/web/features/search/hooks/use-search-query.ts`
   - هنوز search UX کامل، نتایج، فیلترها و integration نهایی در UI دیده نمی‌شود

---

## بخش D — DevOps, QA, Infra (مرحله‌های 24 تا 30)

24. **[~ Partial] CI Pipeline (Lint, Test, Build)**
   - workflow CI موجود است: `.github/workflows/ci.yml`
   - اما هنوز به بازبینی برای پوشش lint/test/build production-grade نیاز دارد

25. **[ ] CD Pipeline (Staging + Prod)**
   - شواهدی از deployment pipeline واقعی برای staging/prod در repo دیده نشد

26. **[~ Partial] Database Migration Strategy**
   - Prisma schema و migrationها موجودند
   - اما zero-downtime strategy، seeding استاندارد و rollout procedure مستند/پیاده‌سازی‌شده دیده نشد

27. **[ ] Load Testing (k6 / Artillery)**
   - فایل یا اسکریپت load test در repo دیده نشد

28. **[ ] Production Observability Setup**
   - شواهدی از Loki / Grafana / OpenTelemetry setup در repo دیده نشد

29. **[~ Partial] Documentation Portal**
   - مستندات مهندسی خوبی در `docs/` وجود دارد
   - اما هنوز portal یا handbook یکپارچه و قابل انتشار به شکل production-grade پیاده نشده است

30. **[ ] Final Production Checklist & Launch**
   - checklist نهایی launch, release notes و versioning strategy production در repo نهایی نشده است

---

## بک‌لاگ اجرایی واقعی بعدی (اولویت‌بندی Production-Grade)

در این بخش، مرحله‌های بعدی به‌شکل «تسک اجرایی» تعریف شده‌اند؛ یعنی قابل شروع، قابل تحویل، و وابسته به وضعیت واقعی فعلی repo.

### P0 — Stabilization Baseline

1. **تثبیت Dependency Graph و حذف Version Drift**
   - هدف: یکدست‌سازی dependencyهای root، `apps/web`، `apps/api` و `packages/ui`
   - خروجی:
     - manifestها و `pnpm-lock.yaml` هم‌راستا باشند
     - dependencyهای تکراری/بی‌جا مشخص و کم شوند
     - install روی mirror فعلی پایدار بماند
   - معیار اتمام:
     - `pnpm install`
     - `pnpm typecheck`
     - `pnpm test`
     - `pnpm build`
     بدون شکست اجرا شوند

2. **کاهش Peer Dependency Warningهای مهم**
   - هدف: کم‌کردن warningهای پرریسک به‌خصوص در `packages/ui`
   - خروجی:
     - تفکیک warningهای قابل‌قبول از warningهای blocking
     - لیست dependencyهای نیازمند upgrade / pin / replacement
   - معیار اتمام:
     - warningهای بحرانی مستند و تا حد ممکن حذف شوند

3. **بازبینی Root Scriptها و Canonical Command Set**
   - هدف: مشخص‌کردن commandهای رسمی و حذف scriptهای stale
   - خروجی:
     - `package.json` root تمیز و معنادار
     - CI فقط از commandهای معتبر استفاده کند
   - معیار اتمام:
     - تمام commandهای root یا قابل اجرا باشند یا عمداً حذف شده باشند

### P1 — CI / QA Hardening

4. **هم‌راستاسازی CI با وضعیت واقعی Workspace**
   - هدف: اطمینان از این‌که `.github/workflows/ci.yml` دقیقا با وضعیت فعلی repo سازگار است
   - خروجی:
     - CI روی install, typecheck, test, build یا health flow معتبر اجرا شود
     - commandهای stale یا ناقص از pipeline حذف شوند
   - معیار اتمام:
     - CI محلی و در workflow بدون mismatch مفهومی باشد

5. **تعریف Quality Gate رسمی برای فاز فعلی**
   - هدف: مشخص‌کردن حداقل gate برای merge/release
   - خروجی:
     - تعریف واضح برای lint/test/typecheck/build
     - تعیین این‌که کدام failureها blocking هستند
   - معیار اتمام:
     - rules در docs و CI قابل مشاهده باشند

6. **افزودن تست‌های هدفمند برای API Core Modules**
   - هدف: شروع از `guides` و `tools` و پوشش behaviorهای پرریسک
   - خروجی:
     - تست service/repository یا integration برای list/detail/create/update/delete
     - تست envelope خطا و pagination/query behavior
   - معیار اتمام:
     - coverage رفتاری حداقلی برای ماژول‌های اصلی برقرار شود

### P2 — API Production Hardening

7. **نهایی‌سازی Contract ماژول Guides**
   - هدف: هم‌راستاسازی کامل Guides با `docs/API Contract.md`
   - خروجی:
     - query params، response shape، detail behavior، pagination semantics یکدست شوند
   - معیار اتمام:
     - Swagger، DTOها و behavior runtime با هم هماهنگ باشند

8. **نهایی‌سازی Contract ماژول Tools**
   - هدف: رساندن `tools` به سطحی مشابه `guides`
   - خروجی:
     - list/detail/filter semantics روشن و تست‌پذیر شود
   - معیار اتمام:
     - contract و implementation اختلاف معنادار نداشته باشند

9. **نهایی‌سازی Contract ماژول Categories و Tags**
   - هدف: یکدست‌سازی naming، validation و response semantics
   - خروجی:
     - CRUD/query behavior منظم و همسان با سایر ماژول‌ها
   - معیار اتمام:
     - چهار ماژول اصلی API یک استاندارد رفتاری مشترک داشته باشند

10. **بازبینی Error/Trace/Logging برای Readiness واقعی**
   - هدف: ارتقای لایه موجود observability به سطح عملیاتی‌تر
   - خروجی:
     - استاندارد log lineها
     - پوشش بهتر traceId در مسیرهای بحرانی
     - مشخص‌کردن خلأهای metrics/exporter
   - معیار اتمام:
     - troubleshooting در staging/local ساده‌تر شود

### P3 — Web Product Completion

11. **نهایی‌سازی Guide Flow در Frontend**
   - هدف: تکمیل UX و data flow برای `/guides` و `/guides/[slug]`
   - خروجی:
     - loading / error / empty state
     - shape پاسخ‌های سازگار با API
     - حذف لایه‌های موازی یا مبهم
   - معیار اتمام:
     - guide list/detail به‌عنوان flow اصلی محصول قابل اتکا باشد

12. **تبدیل Tools به Feature کامل Frontend**
   - هدف: خارج‌کردن tools از حالت data helper محدود
   - خروجی:
     - listing page یا surface واضح product-facing
     - integration با API واقعی
   - معیار اتمام:
     - tools فقط در home summary مصرف نشود

13. **یکدست‌سازی API Client در Web**
   - هدف: حذف fetch patternهای موازی و تثبیت مسیر canonical
   - خروجی:
     - featureها تا حد ممکن از `packages/api-client` یا لایه مشترک واحد استفاده کنند
   - معیار اتمام:
     - مسیر data fetching در web قابل پیش‌بینی و یکنواخت شود

14. **تکمیل Navigation / Route Architecture Cleanup**
   - هدف: کاهش پراکندگی بین `app/` و `features/`
   - خروجی:
     - ownership روشن routeها و feature modules
   - معیار اتمام:
     - ساختار frontend برای توسعه بعدی قابل‌فهم‌تر شود

### P4 — Search & Content Integration

15. **تعریف Scope نسخه اول Search**
   - هدف: تصمیم شفاف بین guide-only search یا cross-content search
   - خروجی:
     - محدوده، contract و خروجی نسخه اول search
   - معیار اتمام:
     - ambiguity roadmap به تصمیم اجرایی تبدیل شود

16. **پیاده‌سازی API/Module Search بر اساس Scope مصوب**
   - هدف: اضافه‌کردن backend surface واقعی برای search
   - خروجی:
     - endpoint/module روشن برای search
     - query contract اولیه
   - معیار اتمام:
     - search از حالت schema-only یا hook-only خارج شود

17. **اتصال `packages/content` به جریان واقعی داده**
   - هدف: عملیاتی‌کردن pipeline محتوا از parser/indexer تا storage/API
   - خروجی:
     - تعریف flow ingestion/index/update
     - مشخص شدن نقطه اتصال به DB یا API
   - معیار اتمام:
     - `packages/content` مستقیماً در delivery محصول نقش داشته باشد

18. **هم‌راستاسازی SearchDocument / Relation Model با اجرای واقعی**
   - هدف: جلوگیری از فاصله بین schema و implementation
   - خروجی:
     - تعیین اینکه کدام modelها active هستند و کدام reserved
   - معیار اتمام:
     - schema semantics در docs و implementation روشن باشد

### P5 — Security, Infra, Release Readiness

19. **اجرای Security Review پایه برای API**
   - هدف: بررسی validation gaps، sanitization، abuse surfaces و config hardening
   - خروجی:
     - backlog امنیتی اجرایی با severity
   - معیار اتمام:
     - حداقل hardening اولیه قبل از launch داخلی انجام شده باشد

20. **تعریف و پیاده‌سازی Caching Strategy**
   - هدف: تعیین تکلیف Redis/internal cache برای endpointهای پرترافیک
   - خروجی:
     - cache policy اولیه یا تصمیم صریح برای defer
   - معیار اتمام:
     - موضع معماری cache روشن و اجرایی باشد

21. **تعریف Migration / Seed / Rollout Procedure**
   - هدف: production-safe کردن lifecycle دیتابیس
   - خروجی:
     - رویه migrate, validate, seed, rollback یا fallback
   - معیار اتمام:
     - database operations فقط وابسته به دانش فردی نباشد

22. **طراحی CD Pipeline برای Staging**
   - هدف: شروع از staging قبل از production
   - خروجی:
     - deploy flow مشخص برای staging
   - معیار اتمام:
     - build artifact و release path قابل تکرار باشد

23. **تعریف Production Observability Stack**
   - هدف: مشخص‌کردن logging/metrics/tracing stack نهایی
   - خروجی:
     - تصمیم روشن برای Grafana/Loki/OpenTelemetry یا جایگزین
   - معیار اتمام:
     - observability از سطح logging محلی فراتر برود

24. **Load Testing برای مسیرهای بحرانی**
   - هدف: تست اولیه performance برای endpointهای پرترافیک
   - خروجی:
     - سناریوهای پایه load test
     - baseline ساده latency/error rate
   - معیار اتمام:
     - حداقل performance baseline مستند شود

25. **Final Production Checklist**
   - هدف: جمع‌کردن همه prerequisites release در یک checklist اجرایی
   - خروجی:
     - launch checklist
     - release note strategy
     - versioning/release flow
   - معیار اتمام:
     - پروژه از حالت «در حال ساخت» به «قابل آماده‌سازی برای release» برسد

---



## Sprint-Ready Checklist (Top 10)

### 1) تثبیت Dependency Graph و حذف Version Drift
- Owner: Platform / Workspace
- Estimate: 1 تا 2 روز
- Dependencies: ندارد
- [x] همه dependencyهای root، `apps/web`، `apps/api` و `packages/ui` فهرست و مقایسه شوند
- [x] dependencyهای تکراری یا با owner نامشخص مشخص شوند
- [x] dependencyهای ناسازگار با mirror فعلی pin یا downgrade شوند
- [x] `pnpm-lock.yaml` دوباره تولید و commit شود
- [x] `pnpm install`, `pnpm typecheck`, `pnpm test`, `pnpm build` بدون failure اجرا شوند

### 2) کاهش Peer Dependency Warningهای مهم
- Owner: Platform / Frontend Infrastructure
- Estimate: 0.5 تا 1.5 روز
- Dependencies: Task 1
- [x] خروجی کامل warningهای `pnpm install` ثبت شود
- [x] warningها به دو دسته `blocking` و `acceptable-for-now` تقسیم شوند
- [x] برای warningهای `packages/ui` تصمیم `upgrade`, `replace`, `pin`, یا `defer` ثبت شود
- [x] warningهای بحرانی حذف یا مستند شوند

### 3) بازبینی Root Scriptها و Canonical Command Set
- Owner: Platform
- Estimate: 0.5 روز
- Dependencies: Task 1
- [x] همه scriptهای root در `package.json` بررسی شوند
- [x] scriptهای stale یا بدون implementation حذف شوند
- [x] scriptهای رسمی توسعه/CI در README و roadmap هم‌راستا شوند
- [x] command set نهایی برای local dev و CI تثبیت شود

### 4) هم‌راستاسازی CI با وضعیت واقعی Workspace
- Owner: Platform / DevOps
- Estimate: 0.5 تا 1 روز
- Dependencies: Tasks 1, 3
- [x] `.github/workflows/ci.yml` با commandهای واقعی repo تطبیق داده شود
- [x] مشخص شود CI باید `lint`, `typecheck`, `test`, `build` یا `health` را با چه ترتیبی اجرا کند
- [x] از نبود script یا mismatch در pipeline اطمینان گرفته شود
- [x] workflow نهایی با lockfile و mirror فعلی سازگار باشد

### 5) تعریف Quality Gate رسمی برای فاز فعلی
- Owner: Platform / Engineering
- Estimate: 0.5 روز
- Dependencies: Task 4
- [x] حداقل gate برای merge در docs تعریف شود
- [x] blocking conditionهای `lint`, `typecheck`, `test`, `build` مشخص شوند
- [x] relationship بین `health` و سایر commandها شفاف شود
- [x] quality gate در roadmap یا engineering docs ثبت شود

### 6) افزودن تست‌های هدفمند برای API Core Modules
- Owner: Backend
- Estimate: 1 تا 2 روز
- Dependencies: Tasks 4, 5
- [x] از `guides` و `tools` به‌عنوان شروع انتخاب شود
- [x] سناریوهای list/detail/create/update/delete تعریف شوند
- [x] خطاهای domain و envelope response تست شوند
- [x] query behavior مثل pagination/filter/sort تا حد ممکن پوشش داده شود
- [x] تست‌ها وارد CI flow هدف شوند
- [x] Step 6: Unit tests for core API modules (guides, tools, categories, tags, error factory)


### 7) نهایی‌سازی Contract ماژول Guides
- Owner: Backend
- Estimate: 1 روز
- Dependencies: Tasks 5, 6
- [ ] `docs/API Contract.md` با implementation فعلی `guides` مقایسه شود
- [ ] DTOها، query params و response shape یکدست شوند
- [ ] behavior routeهای list و detail شفاف و پایدار شود
- [ ] Swagger و runtime responseها هم‌راستا شوند

### 8) نهایی‌سازی Contract ماژول Tools
- Owner: Backend
- Estimate: 1 روز
- Dependencies: Tasks 5, 6
- [ ] contract فعلی `tools` با docs مقایسه شود
- [ ] naming و semantics فیلترها/responseها یکدست شوند
- [ ] list/detail behavior production-safe شود
- [ ] تست‌های پایه برای contract افزوده شوند

### 9) نهایی‌سازی Contract ماژول Categories و Tags
- Owner: Backend
- Estimate: 1 تا 1.5 روز
- Dependencies: Tasks 5, 6
- [ ] behavior چهار endpoint CRUD/query بررسی شود
- [ ] naming و response envelope با سایر ماژول‌ها هم‌راستا شود
- [ ] validation و error handling یکدست شوند
- [ ] Swagger/DTO/runtime parity بررسی شود

### 10) بازبینی Error/Trace/Logging برای Readiness واقعی
- Owner: Backend / Platform
- Estimate: 0.5 تا 1 روز
- Dependencies: Tasks 6, 7, 8, 9
- [ ] log lineهای فعلی API مرور شوند
- [ ] پوشش `traceId` در مسیرهای اصلی تایید شود
- [ ] gapهای metrics/exporter و structured logging شناسایی شوند
- [ ] backlog observability حداقلی برای staging تعریف شود

## ترتیب پیشنهادی اجرای واقعی

اگر هدف «حرکت منطقی با کمترین ریسک» باشد، ترتیب اجرای پیشنهادی این است:

1. تثبیت dependency/build/CI baseline
2. hardening و test API برای `guides` و `tools`
3. تکمیل guide flow در web
4. تکمیل tools flow در web
5. تعیین تکلیف search
6. اتصال content pipeline به جریان واقعی محصول
7. security / cache / migration readiness
8. staging/CD/observability/load test/final checklist

---

## مهم‌ترین گپ‌های واقعی برای رسیدن به Production

1. هم‌راستاسازی کامل API implementation با contract مستندشده در `docs/API Contract.md`
2. نهایی‌سازی quality gate و CI production-grade
3. حذف مسیرهای موازی و ناهماهنگ در web و تثبیت API client واحد
4. اتصال end-to-end واقعی content ingestion به database و API
5. تبدیل schemaهای آینده‌نگر به scope اجرایی روشن یا defer صریح

---

## وضعیت سلامت فعلی

- `pnpm install` روی mirror فعلی قابل اجراست
- `pnpm typecheck` با موفقیت اجرا می‌شود
- حذف `ai-agent` کامل شده و docs با وضعیت فعلی repo سینک شده‌اند
- `apps/web` دارای routeهای فعال برای home و guides است
- `apps/api` دارای ماژول‌های فعال برای guides/tools/categories/tags/health است

---

## نتیجه

این پروژه از فاز foundation عبور کرده و اکنون در مرحله‌ای است که باید از «زیرساخت و اسکلت خوب» به «سطح product-ready و production-safe» برسد. بنابراین گام بعدی دیگر ساختن foundation جدید نیست؛ بلکه **stabilization, alignment, test hardening, product completion, و release readiness** است.
