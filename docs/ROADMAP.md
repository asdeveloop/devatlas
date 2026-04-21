# DevAtlas Platform Roadmap (Production-Grade)

Last Updated: 1405/09/01

> This roadmap integrates the high-level strategic overview with a detailed 30-step execution plan, reflecting the actual repository state and prioritizing production readiness.

---

## Phase Overview

| Phase | Name | Status |
|-------|------|--------|
| Phase 0 | Architecture & Setup | ✅ complete |
| Phase 1 | Platform Foundation | ✅ complete |
| Phase 2 | Core Content Platform | 🚧 in progress |
| Phase 3 | Search & Knowledge Layer | 🔵 partially scaffolded |
| Phase 4 | Intelligence Layer | ⬜ planned |
| Phase 5 | Operations & Scale | ⬜ planned |

---

## Current Implementation Status

### ✅ Repository & Delivery Foundation
- pnpm workspace + Turborepo
- CI workflow in `.github/workflows/ci.yml`
- Local install/build/test/typecheck workflow
- npm mirror configuration in `.npmrc`

### ✅ API Foundation
- NestJS bootstrap with Swagger, validation, interceptors, exception filter
- Active modules: guides, tools, categories, tags, health, database
- Drizzle schema is the active source of truth in `apps/api/src/db/schema`
- Error handling unification complete

### ✅ Frontend Foundation
- Landing page
- Guides listing route
- Guide detail route
- Feature-based organization in `apps/web/features`

### ✅ Shared Package Foundation
- `@devatlas/ui` — Reusable UI components
- `@devatlas/types` — Shared Zod schemas and TS types
- `@devatlas/content` — Content ingestion/indexing package
- `@devatlas/api-client` — Shared API client
- `@devatlas/utils` — Shared utilities

### Current Constraints
- local PostgreSQL schema must stay aligned with the generated Drizzle migration artifacts
- repo-wide `test`/`build` have not been re-run as part of this narrow migration follow-up

---

## Prioritized Execution Backlog (P0–P5)

### P0 — Stabilization Baseline ✅
**Goal:** Reproducible builds, clean dependency graph, canonical scripts

1. ✅ Stabilize dependency graph / remove version drift
2. ✅ Reduce peer dependency warnings
3. ✅ Review root scripts and canonical command set

**Exit Criteria:** `pnpm install && pnpm typecheck && pnpm test && pnpm build` passes cleanly

---

### P1 — CI / QA Hardening ✅
**Goal:** Production-grade quality gates and test coverage

4. ✅ Align CI with workspace state
5. ✅ Define formal quality gate
6. ✅ Add targeted tests for API core modules (39 unit tests written)

**Exit Criteria:** CI enforces lint/test/typecheck/build; core modules have test coverage

---

### P2 — API Production Hardening 🚧
**Goal:** Full contract alignment with `docs/API Contract.md`

7. 🚧 Finalize Guides contract (params, response shape, behavior)
8. 🚧 Finalize Tools contract (naming, semantics, filtering)
9. 🚧 Finalize Categories & Tags contracts (validation, CRUD/query)
10. 🚧 Review error/trace/logging readiness (traceId coverage, metrics gaps)

**Exit Criteria:** All API endpoints match contract; error/trace/logging production-ready

---

### P3 — Web Product Completion 🔵
**Goal:** End-to-end guide/tool flows, unified API client

11. 🔵 Finalize guide flow in frontend (UX/data flow for `/guides` and `/guides/[slug]`)
12. 🔵 Turn Tools into full frontend feature (listing pages, live API integration)
13. 🔵 Unify API client usage in Web (eliminate parallel fetch patterns)
14. 🔵 Clean up navigation / route architecture (reduce `app/` vs. `features/` scattering)

**Exit Criteria:** Guides and Tools flows complete; single canonical API client layer

---

### P4 — Search & Content Integration ⬜
**Goal:** Functional search API and content pipeline

15. ⬜ Define search scope (guide-only vs. cross-content)
16. ⬜ Implement search API/module (backend surface, query contract)
17. ⬜ Connect `packages/content` to real data flow (ingestion/indexing/DB)
18. ⬜ Align `SearchDocument` / relation models with execution

**Exit Criteria:** Search API returns relevant results; content pipeline operational

---

### P5 — Security, Infra, Release Readiness ⬜
**Goal:** Production deployment, observability, security hardening

19. ⬜ Security review (validation gaps, sanitization, abuse surfaces)
20. ⬜ Caching strategy (Redis/internal cache for high-traffic endpoints)
21. ⬜ Migration / seed / rollout procedure (zero-downtime, rollback)
22. ⬜ CD pipeline for staging (repeatable build artifact, release path)
23. ⬜ Production observability stack (Grafana/Loki/OpenTelemetry)
24. ⬜ Load testing (k6/Artillery, latency/error rate baselines)
25. ⬜ Final production checklist (release prerequisites, versioning)

**Exit Criteria:** Production Docker Compose runs; health endpoint reports status; no critical security findings

---

## Detailed 30-Step Execution Plan

**Status Legend:**
- `[✓ Done]` Implemented and visible in repo
- `[~ Partial]` Partially implemented, not production-ready
- `[ ] Pending]` Not meaningfully implemented yet

---

### Section A — Foundations & Design (Steps 1–5)

1. `[✓ Done]` Comprehensive Monorepo & Architecture Docs Analysis
2. `[✓ Done]` Comprehensive Types Package Analysis
3. `[✓ Done]` Comprehensive Backend Analysis (`apps/api`)
4. `[✓ Done]` Final API Contract Design for Whole Platform
5. `[✓ Done]` Define Coding Standards & Architecture Constraints

---

### Section B — Core Development (Steps 6–18)

6. `[~ Partial]` Phase 1 — Types Package Refactor
7. `[~ Partial]` Phase 2 — Backend Contracts Alignment
8. `[~ Partial]` Phase 3 — Guides API Finalization
9. `[~ Partial]` Phase 4 — Tools API Module
10. `[~ Partial]` Phase 5 — Categories API Module
11. `[~ Partial]` Phase 6 — Tags API Module
12. `[~ Partial]` Phase 7 — Content Indexer Integration
13. `[✓ Done]` Phase 8 — API Error Handling Unification
14. `[~ Partial]` Phase 9 — Observability Layer
15. `[ ] Pending` Phase 10 — Authentication Layer (Optional for now)
16. `[ ] Pending` Phase 11 — Authorization Layer
17. `[ ] Pending` Phase 12 — Input Sanitization & Security Audit
18. `[ ] Pending` Phase 13 — Internal Caching Layer

---

### Section C — Frontend Integration (Steps 19–23)

19. `[~ Partial]` Web App: API Client Unification
20. `[~ Partial]` Web App: Guides Integration Stability
21. `[~ Partial]` Web App: Tools Integration
22. `[~ Partial]` Web App: Navigation Architecture Cleanup
23. `[~ Partial]` Web App: Search UX Implementation

---

### Section D — DevOps, QA, Infra (Steps 24–30)

24. `[~ Partial]` CI Pipeline (Lint, Test, Build)
25. `[ ] Pending` CD Pipeline (Staging + Prod)
26. `[~ Partial]` Database Migration Strategy (Zero-downtime, seeding, rollout)
27. `[ ] Pending` Load Testing (k6 / Artillery)
28. `[ ] Pending` Production Observability Setup
29. `[~ Partial]` Documentation Portal
30. `[ ] Pending` Final Production Checklist & Launch

---

## Sprint-Ready Checklist (Top 10 Actionable Tasks)

### ✅ Completed

1. **Stabilize Dependency Graph & Remove Version Drift**
   - Owner: Platform / Workspace
   - Estimate: 1–2 days
   - ✅ List & compare dependencies (root, web, api, ui)
   - ✅ Identify & reduce duplicate/unowned dependencies
   - ✅ Pin/downgrade incompatible dependencies for mirror
   - ✅ Regenerate & commit `pnpm-lock.yaml`
   - 🚧 Ensure `pnpm install`, `typecheck`, `test`, `build` pass

2. **Reduce Peer Dependency Warnings**
   - Owner: Platform / Frontend Infrastructure
   - Estimate: 0.5–1.5 days
   - ✅ Record all `pnpm install` warnings
   - ✅ Categorize warnings (`blocking` vs. `acceptable-for-now`)
   - ✅ Decide `upgrade`/`replace`/`pin`/`defer` for `packages/ui` warnings
   - ✅ Remove or document critical warnings

3. **Review Root Scripts & Canonical Command Set**
   - Owner: Platform
   - Estimate: 0.5 days
   - ✅ Audit all root `package.json` scripts
   - ✅ Remove stale/unimplemented scripts
   - ✅ Document canonical dev/CI commands in `SCRIPTS.md`

4. **Align CI with Workspace State**
   - Owner: Platform / DevOps
   - Estimate: 0.5–1 day
   - ✅ Ensure `.github/workflows/ci.yml` matches repo reality
   - ✅ Validate install/typecheck/test/build/health flows
   - ✅ Remove stale pipeline commands

5. **Define Formal Quality Gate**
   - Owner: Platform / QA
   - Estimate: 0.5 days
   - ✅ Specify minimum merge/release criteria
   - ✅ Determine blocking failures

6. **Add Targeted Tests for API Core Modules**
   - Owner: Backend
   - Estimate: 2–3 days
   - ✅ Focus on `guides`, `tools`, `categories`, `tags`
   - ✅ Cover list/detail/CRUD, error handling, pagination/query behaviors
   - ✅ 39 unit tests written

---

### 🚧 In Progress

7. **Finalize Guides Contract**
   - Owner: Backend
   - Estimate: 1–2 days
   - Dependencies: Task 6
   - 🚧 Align `guides` API with `docs/API Contract.md`
   - 🚧 Standardize params, response shape, behavior, semantics
   - ⬜ Add integration tests

8. **Finalize Tools Contract**
   - Owner: Backend
   - Estimate: 1–2 days
   - Dependencies: Task 6
   - 🚧 Align `tools` API with docs
   - 🚧 Standardize naming, semantics, filtering, list/detail behavior
   - ⬜ Add integration tests

9. **Finalize Categories & Tags Contracts**
   - Owner: Backend
   - Estimate: 1 day
   - Dependencies: Task 6
   - 🚧 Standardize naming, validation, response envelope
   - 🚧 CRUD/query behavior across modules
   - ⬜ Add integration tests

10. **Review Error/Trace/Logging Readiness**
    - Owner: Backend / Platform
    - Estimate: 1 day
    - Dependencies: Task 13 (error handling unification)
    - 🚧 Standardize log lines
    - 🚧 Ensure `traceId` coverage
    - ⬜ Identify metrics/exporter gaps
    - ⬜ Define minimal staging observability backlog

---

## Recommended Execution Order

1. ✅ Stabilize dependency/build/CI baseline (P0–P1)
2. 🚧 Harden/test API for guides and tools (P2)
3. 🔵 Complete guide flow in web (P3)
4. 🔵 Complete tools flow in web (P3)
5. ⬜ Decide search scope (P4)
6. ⬜ Connect content pipeline (P4)
7. ⬜ Security/cache/migration readiness (P5)
8. ⬜ Staging/CD/observability/load test/final checklist (P5)

---

## Top Production Gaps

### 1. Full API Implementation Alignment with `docs/API Contract.md`
**Impact:** High
**Effort:** Medium
**Status:** P2 in progress

All endpoints must match documented contracts for params, response shape, behavior, and semantics.

---

### 2. Final Quality Gate and Production-Grade CI
**Impact:** High
**Effort:** Low
**Status:** P1 complete

CI must enforce lint/test/typecheck/build as blocking merge criteria.

---

### 3. Removal of Parallel/Inconsistent Web Paths
**Impact:** Medium
**Effort:** Medium
**Status:** P3 planned

Adopt a single canonical API client layer; eliminate redundant fetch patterns.

---

### 4. End-to-End Content Ingestion Wired into DB/API
**Impact:** High
**Effort:** High
**Status:** P4 planned

`packages/content` must be operationalized with ingestion/indexing/update pipeline connected to DB/API.

---

### 5. Future-Facing Schema Parts Need Explicit Scope or Deferment
**Impact:** Low
**Effort:** Low
**Status:** Documentation task

Clarify which models are active vs. reserved; document execution scope or explicit deferral.

---

## Current Phase Exit Criteria

**Phase 2 (Core Content Platform) is healthy when:**

- ✅ Docs match codebase
- ✅ Installs reproducible via mirror
- 🚧 API/web route inventory documented
- 🚧 Guides/tools priority flows verified end-to-end
- ⬜ Next search/intelligence work starts from explicit updated notes

---

## Next Actions

1. Complete P2 tasks 7–10 (API contract finalization)
2. Begin P3 tasks 11–14 (web product completion)
3. Define search scope (P4 task 15)
4. Document active vs. reserved schema models

---

## Detailed Sprint Execution

For granular task breakdown and daily tracking, see `SPRINT-TASKS-100.md`.

---
