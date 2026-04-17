# DevAtlas Roadmap

This roadmap is synchronized with the repository's current implementation state.

## Phase Overview

| Phase | Name | Status | Notes |
|---|---|---|---|
| Phase 0 | Architecture & Setup | complete | Monorepo, docs, initial technical direction |
| Phase 1 | Platform Foundation | complete | Web/API base, Prisma, shared packages, CI |
| Phase 2 | Core Content Platform | in progress | Guides, tools, taxonomy, frontend integration |
| Phase 3 | Search and Knowledge Layer | partially scaffolded | Schema exists; product/API work still incomplete |
| Phase 4 | Intelligence Layer | planned | AI summaries, answers, embeddings, semantic workflows |
| Phase 5 | Operations and Scale | planned | analytics, caching, observability, deployment hardening |

## What Is Already Implemented

### Repository and delivery foundation

- pnpm workspace + Turborepo
- CI workflow in `.github/workflows/ci.yml`
- local install/build/test/typecheck workflow
- npm mirror configuration in `.npmrc`

### API foundation

- NestJS bootstrap with Swagger, validation, interceptors, and exception filter
- active modules for guides, tools, categories, tags, health, and database
- Prisma schema and migrations checked into the repo

### Frontend foundation

- landing page
- guides listing route
- guide detail route
- feature-based organization in `apps/web/features`

### Shared package foundation

- reusable UI package
- shared types package
- content ingestion/indexing package
- shared API client and utilities packages

## Current Execution Priorities

### Priority 1 - Stabilize the implemented platform

- remove remaining config drift between manifests, lockfile, CI, and docs
- decide whether root-level app framework dependencies should remain duplicated or be normalized further
- reduce install-time peer dependency noise in `packages/ui`
- document and enforce which scripts are canonical after recent cleanup

### Priority 2 - Complete core product loops

- finish guide list/detail integration against the live API where still incomplete
- verify tools data flow from API to web beyond the landing page counts
- add missing tests around active API modules and frontend data adapters
- make category/tag flows visible in the frontend where relevant

### Priority 3 - Clarify search and knowledge scope

- decide whether search should ship first as guide-only or cross-content
- expose the intended search API/module shape in `apps/api`
- connect `packages/content` outputs to the database/indexing strategy
- separate truly active schema models from future-reserved models in execution docs

### Priority 4 - Prepare for intelligence features

- define ownership boundaries for summaries, answers, embeddings, and retrieval
- document model/provider strategy without reintroducing local agent tooling
- decide storage/update flow for AI cache tables already present in Prisma

## Short-Term Backlog

- align docs with actual module and route inventory whenever product scope changes
- normalize package versions when the mirror registry lags upstream releases
- review tracked generated files in `packages/types/src`
- audit root scripts and remove or restore any stale commands deliberately
- confirm CI still reflects the intended quality gate order

## Exit Criteria for the Current Phase

The current phase should be considered healthy when:

- docs match the codebase without major stale sections
- installs are reproducible using the configured mirror
- API and web route inventory is explicitly documented
- priority user flows for guides and tools are verified end-to-end
- next-phase search/intelligence work starts from explicit, updated execution notes
