# DevAtlas — 100 Sprint Tasks (Production Grade)

> Source of truth: `schema.prisma`, `ROADMAP.md`, `ENGINEERING-STATE.md`, `ARCHITECTURE.md`, module tree
> Generated: 1405/01/29

---

## Phase 0 — Prisma → Drizzle Migration (Tasks 1–12)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 1 | Create `apps/api/src/db/schema/enums.ts` — all 7 pgEnums | db/schema | ⬜ |
| 2 | Create `apps/api/src/db/schema/category.ts` + relations | db/schema | ⬜ |
| 3 | Create `apps/api/src/db/schema/tag.ts` + relations | db/schema | ⬜ |
| 4 | Create `apps/api/src/db/schema/guide.ts` + relations | db/schema | ⬜ |
| 5 | Create `apps/api/src/db/schema/tool.ts` + relations | db/schema | ⬜ |
| 6 | Create `apps/api/src/db/schema/guide-tag.ts` + indexes + cascade | db/schema | ⬜ |
| 7 | Create `apps/api/src/db/schema/tool-tag.ts` + indexes + cascade | db/schema | ⬜ |
| 8 | Create `apps/api/src/db/schema/content-relation.ts` polymorphic | db/schema | ⬜ |
| 9 | Create `apps/api/src/db/schema/search-document.ts` | db/schema | ⬜ |
| 10 | Create `apps/api/src/db/schema/ai-summary.ts` + `ai-answer.ts` + `search-query.ts` + `content-view.ts` | db/schema | ⬜ |
| 11 | Create `apps/api/src/db/index.ts` — Pool + drizzle instance | db | ⬜ |
| 12 | Create `apps/api/drizzle.config.ts` + `src/db/migrate.ts` | db | ⬜ |

## Phase 1 — Database Module Swap (Tasks 13–20)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 13 | Replace `prisma.service.ts` → `drizzle.service.ts` | database | ⬜ |
| 14 | Update `database.module.ts` — export DrizzleService globally | database | ⬜ |
| 15 | Remove `@prisma/client` and `prisma` from `package.json` | apps/api | ⬜ |
| 16 | Add `drizzle-orm`, `pg`, `drizzle-kit`, `@types/pg` to deps | apps/api | ⬜ |
| 17 | Run `drizzle-kit generate` — verify initial migration SQL | apps/api | ⬜ |
| 18 | Run `drizzle-kit push` against local PG — validate tables | apps/api | ⬜ |
| 19 | Delete `apps/api/prisma/` directory (schema + migrations) | apps/api | ⬜ |
| 20 | Update `app.module.ts` — ensure DatabaseModule import uses Drizzle | apps/api | ⬜ |

## Phase 2 — Repository Layer Rewrite (Tasks 21–35)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 21 | Rewrite `categories.repository.ts` — Drizzle queries | categories | ⬜ |
| 22 | Rewrite `guides.repository.ts` — Drizzle queries + joins | guides | ⬜ |
| 23 | Rewrite `tags.repository.ts` — Drizzle queries | tags | ⬜ |
| 24 | Rewrite `tools.repository.ts` — Drizzle queries + joins | tools | ⬜ |
| 25 | Update `categories.service.ts` — use new repo signatures | categories | ⬜ |
| 26 | Update `guides.service.ts` — use new repo signatures | guides | ⬜ |
| 27 | Update `tags.service.ts` — use new repo signatures | tags | ⬜ |
| 28 | Update `tools.service.ts` — use new repo signatures | tools | ⬜ |
| 29 | Update `guide.mapper.ts` — map Drizzle row types | guides | ⬜ |
| 30 | Create `tool.mapper.ts` — map Drizzle row types | tools | ⬜ |
| 31 | Create `category.mapper.ts` | categories | ⬜ |
| 32 | Create `tag.mapper.ts` | tags | ⬜ |
| 33 | Update `query-prisma.mapper.ts` → `query-drizzle.mapper.ts` | common | ⬜ |
| 34 | Update all module imports — remove PrismaService refs | all modules | ⬜ |
| 35 | Verify all controllers compile with new service signatures | all modules | ⬜ |

## Phase 3 — DTO & Validation Alignment (Tasks 36–45)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 36 | Audit `create-guide.dto.ts` — match Drizzle insert type | guides/dto | ⬜ |
| 37 | Audit `update-guide.dto.ts` — partial insert type | guides/dto | ⬜ |
| 38 | Audit `create-tool.dto.ts` — match Drizzle insert type | tools/dto | ⬜ |
| 39 | Audit `update-tool.dto.ts` — partial insert type | tools/dto | ⬜ |
| 40 | Audit `create-category.dto.ts` — match schema | categories/dto | ⬜ |
| 41 | Audit `create-tag.dto.ts` — match schema | tags/dto | ⬜ |
| 42 | Audit `guide-query.dto.ts` — filter/sort fields match columns | guides/dto | ⬜ |
| 43 | Audit `tool-query.dto.ts` — filter/sort fields match columns | tools/dto | ⬜ |
| 44 | Audit `category-query.dto.ts` + `tag-query.dto.ts` | dto | ⬜ |
| 45 | Audit `guide-list-response.dto.ts` + `guide-response.dto.ts` | guides/dto | ⬜ |

## Phase 4 — Shared Types Package Sync (Tasks 46–52)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 46 | Update `packages/types` — export Drizzle inferred types | packages/types | ⬜ |
| 47 | Remove Prisma-generated type imports from `packages/types` | packages/types | ⬜ |
| 48 | Update `packages/api-client` — align request/response types | packages/api-client | ⬜ |
| 49 | Update `packages/content` — remove Prisma deps if any | packages/content | ⬜ |
| 50 | Verify `packages/ui` has no Prisma type leaks | packages/ui | ⬜ |
| 51 | Run `pnpm typecheck` across entire monorepo — fix errors | root | ⬜ |
| 52 | Run `pnpm lint` across entire monorepo — fix errors | root | ⬜ |

## Phase 5 — Testing Infrastructure (Tasks 53–62)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 53 | Create test DB setup utility — Drizzle + test pool | apps/api/test | ⬜ |
| 54 | Write unit tests: `categories.repository.ts` (CRUD) | categories | ⬜ |
| 55 | Write unit tests: `guides.repository.ts` (CRUD + joins) | guides | ⬜ |
| 56 | Write unit tests: `tags.repository.ts` (CRUD) | tags | ⬜ |
| 57 | Write unit tests: `tools.repository.ts` (CRUD + joins) | tools | ⬜ |
| 58 | Write unit tests: `categories.service.ts` | categories | ⬜ |
| 59 | Write unit tests: `guides.service.ts` | guides | ⬜ |
| 60 | Write unit tests: `tags.service.ts` | tags | ⬜ |
| 61 | Write unit tests: `tools.service.ts` | tools | ⬜ |
| 62 | Write integration test: health endpoint + DB connection | health | ⬜ |

## Phase 6 — API Contract Completion (Tasks 63–72)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 63 | Verify `GET /guides` — pagination, filtering, sorting | guides | ⬜ |
| 64 | Verify `GET /guides/:slug` — full detail + tags + category | guides | ⬜ |
| 65 | Verify `POST /guides` — create with tags | guides | ⬜ |
| 66 | Verify `PATCH /guides/:id` — partial update | guides | ⬜ |
| 67 | Verify `GET /tools` — pagination, filtering, sorting | tools | ⬜ |
| 68 | Verify `GET /tools/:slug` — full detail + tags + category | tools | ⬜ |
| 69 | Verify `POST /tools` + `PATCH /tools/:id` | tools | ⬜ |
| 70 | Verify `GET /categories` + `POST /categories` | categories | ⬜ |
| 71 | Verify `GET /tags` + `POST /tags` | tags | ⬜ |
| 72 | Verify Swagger `/docs` reflects all endpoints correctly | app | ⬜ |

## Phase 7 — Frontend Data Integration (Tasks 73–82)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 73 | Update `apps/web` guide list page — fetch from API | web/guides | ⬜ |
| 74 | Update `apps/web` guide detail page — fetch by slug | web/guides/[slug] | ⬜ |
| 75 | Create tools listing page — `apps/web/tools` | web/tools | ⬜ |
| 76 | Create tool detail page — `apps/web/tools/[slug]` | web/tools | ⬜ |
| 77 | Create categories listing page | web/categories | ⬜ |
| 78 | Implement tag filtering on guide/tool lists | web | ⬜ |
| 79 | Implement category filtering on guide/tool lists | web | ⬜ |
| 80 | Wire `packages/api-client` into all web pages | web | ⬜ |
| 81 | Add loading states + error boundaries | web | ⬜ |
| 82 | Add SEO meta tags for guide/tool detail pages | web | ⬜ |

## Phase 8 — Search Module (Tasks 83–88)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 83 | Create `search.module.ts` + `search.controller.ts` | modules/search | ⬜ |
| 84 | Create `search.service.ts` — query `search_documents` table | modules/search | ⬜ |
| 85 | Create `search.repository.ts` — Drizzle full-text queries | modules/search | ⬜ |
| 86 | Create search indexing service — sync guides/tools → search_documents | modules/search | ⬜
| 87 | Implement `POST /search` endpoint — query + results | search | ⬜ |
| 88 | Log search queries to `search_queries` table | search | ⬜ |

## Phase 9 — Content Relations & Knowledge Graph (Tasks 89–93)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 89 | Create `content-relations.module.ts` + service + repository | modules/content-relations | ⬜ |
| 90 | Implement `POST /content-relations` — create relation | content-relations | ⬜ |
| 91 | Implement `GET /guides/:id/related` — query by source | content-relations | ⬜ |
| 92 | Implement `GET /tools/:id/related` — query by source | content-relations | ⬜ |
| 93 | Add relation suggestions to guide/tool detail pages | web | ⬜ |

## Phase 10 — AI Layer Preparation (Tasks 94–100)

| # | Task | Module/File | Status |
|---|------|-------------|--------|
| 94 | Create `ai.module.ts` + `ai.service.ts` skeleton | modules/ai | ⬜ |
| 95 | Create `ai-summary.repository.ts` — CRUD for ai_summaries | modules/ai | ⬜ |
| 96 | Create `ai-answer.repository.ts` — CRUD for ai_answers | modules/ai | ⬜ |
| 97 | Implement summary generation job — store in ai_summaries | modules/ai | ⬜ |
| 98 | Implement Q&A endpoint — `POST /ai/ask` | modules/ai | ⬜ |
| 99 | Add AI summary display to guide/tool detail pages | web | ⬜ |
| 100 | Document AI provider strategy in ARCHITECTURE.md | docs | ⬜ |

---

## Execution Priority

### Sprint 1 (Week 1) — Foundation
Tasks 1–20: Drizzle migration + database module swap

### Sprint 2 (Week 2) — Core Rewrite
Tasks 21–45: Repository layer + DTO alignment

### Sprint 3 (Week 3) — Quality & Integration
Tasks 46–62: Types sync + testing infrastructure

### Sprint 4 (Week 4) — Product Surface
Tasks 63–82: API contract + frontend integration

### Sprint 5 (Week 5) — Advanced Features
Tasks 83–100: Search + relations + AI prep

---

## Success Criteria

- ✅ Zero Prisma references in codebase
- ✅ `pnpm typecheck && pnpm lint && pnpm test` passes
- ✅ All API endpoints return correct data
- ✅ Frontend pages render without errors
- ✅ Drizzle migrations match existing DB state
- ✅ Docs updated (ENGINEERING-STATE, ROADMAP, ARCHITECTURE)

---

## Rollback Plan

If migration fails:
1. Restore `apps/api/prisma/` from git
2. Reinstall `@prisma/client` + `prisma`
3. Revert `database.module.ts` + `*.repository.ts`
4. Run `prisma generate && prisma migrate deploy`

---

## Notes

- Prisma access blocked in Iran — Drizzle is the only viable path
- All tasks derived from actual schema.prisma (289 lines, 10 models, 7 enums)
- Module tree verified against devatlas.zip archive
- No guesswork — every task maps to existing file or schema entity

---

## Context

This sprint plan implements priorities from `ROADMAP.md` Phase 2 (P0–P2).

---
