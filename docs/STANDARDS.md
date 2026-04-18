# Coding Standards & Architecture Constraints

> DevAtlas Platform — Single Source of Truth for code conventions and architectural boundaries.
> Last updated: 1405/01/29 (2026-04-18)

---

## A. Naming Conventions

| Context                  | Convention       | Example                          |
| ------------------------ | ---------------- | -------------------------------- |
| TypeScript variables     | `camelCase`      | `readingTime`, `isPublished`     |
| TypeScript classes       | `PascalCase`     | `GuidesService`, `CreateToolDto` |
| TypeScript interfaces    | `PascalCase`     | `PaginatedResult<T>`             |
| TypeScript enums         | `PascalCase`     | `ContentStatus`, `Difficulty`    |
| Enum members             | `UPPER_SNAKE`    | `PUBLISHED`, `IN_PROGRESS`       |
| Database tables          | `snake_case`     | `guides`, `guide_tags`           |
| Database columns         | `snake_case`     | `created_at`, `reading_time`     |
| Drizzle schema symbols   | `camelCase`      | `guides`, `guideTags`            |
| API endpoints            | `kebab-case`     | `/api/v1/learning-paths`         |
| API query params         | `camelCase`      | `?sortBy=createdAt&order=desc`   |
| API response fields      | `camelCase`      | `readingTime`, `createdAt`       |
| File names (modules)     | `kebab-case`     | `guides.service.ts`              |
| File names (classes)     | `kebab-case`     | `create-guide.dto.ts`            |
| Test files               | `kebab-case`     | `guides.service.spec.ts`         |
| Environment variables    | `UPPER_SNAKE`    | `DATABASE_URL`, `NODE_ENV`       |

### DB ↔ TypeScript Mapping Rule

Drizzle schema definitions use `snake_case` for actual column names and expose `camelCase` via TypeScript inference:

```ts
// filepath: apps/api/src/database/schema/guides.ts
export const guides = pgTable('guides', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  readingTime: integer('reading_time'),  // DB: snake_case → TS: camelCase
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

---

## B. TypeScript Rules

### Strict Mode

- `strict: true` in all `tsconfig.json` files — no exceptions.
- **Zero `any`** — use `unknown` + type guards when type is uncertain.
- **Zero `@ts-ignore` / `@ts-expect-error`** — fix the type, don't suppress it.

### Type Safety

ts
// ✅ Correct
function getGuide(id: number): Promise<Guide | null> { ... }

// ❌ Wrong
function getGuide(id: any): Promise<any> { ... }

### Enums

- Use TypeScript `enum` only when mirroring a Drizzle/DB enum.
- For app-only constants, prefer `as const` objects:

ts
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirection = (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

### Imports

- Absolute imports via `@app/*` path alias for `apps/api/src/*`.
- No circular imports — enforce via ESLint `import/no-cycle`.
- No barrel files (`index.ts`) inside modules — import directly.

### Error Handling

- Never swallow errors silently.
- All service-layer errors throw `DomainError` subclasses.
- HTTP layer catches via global `HttpExceptionFilter`.
- Every error has a unique `ErrorCode` from `error-codes.ts`.

---

## C. Architecture Constraints

### Layer Separation (Strict)


Controller → Service → Repository → Drizzle (DB)
     ↓           ↓           ↓
    DTO      Domain Logic   Query Builder

| Layer        | Allowed Dependencies                  | Forbidden                              |
| ------------ | ------------------------------------- | -------------------------------------- |
| Controller   | Service, DTOs, Pipes, Guards          | Repository, Drizzle, direct DB access  |
| Service      | Repository, DTOs, Domain Errors       | Controller, Drizzle direct, `req/res`  |
| Repository   | Drizzle query builder, Schema         | Service, Controller, HTTP concepts     |
| DTO          | class-validator, class-transformer    | Any business logic                     |

### Rules

1. **Controllers** — HTTP only. Validate input (via DTOs + pipes), call service, return response. No business logic.
2. **Services** — All business logic lives here. Orchestrate repositories. Throw `DomainError` on failure.
3. **Repositories** — All Drizzle queries. One repository per module. No business logic, no HTTP awareness.
4. **DTOs** — Validation + transformation. Separate `Create*Dto`, `Update*Dto`, `*QueryDto` per entity.

### Module Structure

هر ماژول NestJS این ساختار رو دنبال می‌کنه:


modules/
└── guides/
    ├── dto/
    │   ├── create-guide.dto.ts
    │   ├── update-guide.dto.ts
    │   └── guide-query.dto.ts
    ├── guides.controller.ts
    ├── guides.service.ts
    ├── guides.repository.ts
    ├── guides.module.ts
    └── __tests__/
        ├── guides.controller.spec.ts
        ├── guides.service.spec.ts
        └── guides.repository.spec.ts

### No Cross-Module Direct Access

- Module A **must not** import Module B's repository directly.
- Cross-module communication: import the **module** and inject the **service**.

ts
// ✅ Correct
@Module({
  imports: [CategoriesModule],
})
export class GuidesModule {}

// ❌ Wrong — direct repository import across modules
import { CategoriesRepository } from '../categories/categories.repository';

---

## D. Database & Drizzle ORM Rules

### Schema as Source of Truth

- Drizzle schema files in `apps/api/src/database/schema/` are the single source of truth for DB structure.
- One file per domain: `guides.ts`, `categories.ts`, `tags.ts`, `tools.ts`, `relations.ts`.
- Shared enums in `enums.ts`.

### Migration Rules

- Migrations generated via `drizzle-kit generate`.
- Migrations applied via `drizzle-kit migrate`.
- **Never** edit generated migration SQL manually.
- **Never** use `drizzle-kit push` in production — migrations only.

### Query Patterns

Repository queries use Drizzle query builder:

ts
// filepath: apps/api/src/modules/guides/guides.repository.ts
import { db } from '@app/database/client';
import { guides } from '@app/database/schema/guides';
import { eq, ilike, desc, asc, sql } from 'drizzle-orm';

@Injectable()
export class GuidesRepository {
  async findMany(query: GuideQueryDto): Promise<PaginatedResult<Guide>> {
    const { page, limit, search, sortBy, order } = query;
    const offset = (page - 1) * limit;

    const where = search
      ? ilike(guides.title, `%${search}%`)
      : undefined;

    const orderByClause = order === 'desc'
      ? desc(guides[sortBy])
      : asc(guides[sortBy]);

    const [data, countResult] = await Promise.all([
      db.select()
        .from(guides)
        .where(where)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(guides)
        .where(where),
    ]);

    return {
      data,
      meta: {
        total: Number(countResult[0].count),
        page,
        limit,
        totalPages: Math.ceil(Number(countResult[0].count) / limit),
      },
    };
  }

  async findById(id: number): Promise<Guide | null> {
    const result = await db.select()
      .from(guides)
      .where(eq(guides.id, id))
      .limit(1);

    return result[0] ?? null;
  }
}

### Relations

- Many-to-many via explicit join tables (`guide_tags`, `tool_tags`).
- Relations defined in `relations.ts` using Drizzle `relations()` API.
- **No** implicit/magic relations — every join is explicit in queries.

### Transactions

ts
await db.transaction(async (tx) => {
  await tx.insert(guides).values(guideData);
  await tx.insert(guideTags).values(tagLinks);
});

---

## E. API Design Constraints

### Response Envelope

تمام endpoint ها از یک envelope ثابت استفاده می‌کنن:

json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 },
  "traceId": "abc-123"
}

Error response:

json
{
  "success": false,
  "error": {
    "code": "GUIDE_NOT_FOUND",
    "message": "Guide with id 99 not found",
    "statusCode": 404
  },
  "traceId": "abc-123"
}

### Versioning

- All routes prefixed with `/api/v1/`.
- Version bump only on breaking changes.

### Pagination

- Default: `page=1`, `limit=20`.
- Max limit: `100`.
- Always return `meta` object with pagination info.

### Validation

- All input validated via `class-validator` decorators on DTOs.
- Global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`.
- Custom error messages in Persian where user-facing.

---

## F. Testing Standards

### Structure

- Unit tests: `__tests__/*.spec.ts` inside each module.
- Integration tests: `test/` directory at app root.
- Test runner: **Vitest**.

### Rules

1. **No mocks for Drizzle in unit tests** — use a test database or in-memory alternative.
2. Services tested with repository mocks (interface-based).
3. Controllers tested via `supertest` + NestJS testing module.
4. Minimum coverage target: **80%** per module.
5. Every bug fix must include a regression test.

### Naming

ts
describe('GuidesService', () => {
  describe('findById', () => {
    it('should return guide when exists', async () => { ... });
    it('should throw GUIDE_NOT_FOUND when not exists', async () => { ... });
  });
});

---

## G. Code Quality Gates

### Pre-commit (lint-staged)

bash
pnpm lint-staged

- ESLint fix on staged `.ts` files.
- Prettier format on staged files.

### CI Pipeline

هر PR باید این مراحل رو پاس کنه:

bash
pnpm typecheck    # tsc --noEmit across all packages
pnpm lint         # ESLint — zero warnings, zero errors
pnpm test         # Vitest — all tests pass
pnpm build        # Production build — no errors

### Zero Tolerance

- ❌ `console.log` in production code — use `Logger` from NestJS.
- ❌ Unused imports or variables.
- ❌ Dead code or commented-out blocks.
- ❌ `TODO` or `FIXME` in merged code — create an issue instead.
- ❌ `any` type anywhere.
- ❌ Skipped tests (`it.skip`, `describe.skip`).

---

## H. Git & Workflow Constraints

### Branch Naming


feat/guides-crud
fix/category-validation
refactor/drizzle-migration
docs/update-architecture

### Commit Messages (Conventional Commits)


feat(guides): add pagination to list endpoint
fix(tools): correct category relation mapping
refactor(db): migrate guides repository to drizzle
docs: update architecture for drizzle migration

### PR Rules

- One feature/fix per PR.
- PR description must reference the task number from `SPRINT-TASKS-100.md`.
- Self-review checklist before requesting review.
- Squash merge to `main`.

---

## I. Security Constraints

- **No secrets in code** — all via environment variables.
- **No raw SQL** unless wrapped in Drizzle's `sql` template tag (parameterized).
- **Input validation** on every endpoint — no trust of client data.
- **Rate limiting** on public endpoints (when auth is implemented).
- **CORS** configured explicitly — no wildcard in production.
- **Helmet** middleware enabled.
- **No `eval()`** or dynamic code execution.

---

## J. Performance Constraints

- **Database indexes** on all foreign keys and frequently queried columns.
- **Pagination required** on all list endpoints — no unbounded queries.
- **Select only needed columns** when possible — avoid `select *` patterns.
- **Connection pooling** via Drizzle + `postgres` driver configuration.
- **No N+1 queries** — use joins or batch queries in repositories.

---

## K. Dependency Rules

- **No new dependency** without team review.
- **No duplicate functionality** — check existing packages first.
- **Pin exact versions** in `package.json` (no `^` or `~`).
- **Monorepo packages** via `workspace:*` protocol.
- **Shared types** in `packages/shared-types/` — no type duplication across apps.

---
