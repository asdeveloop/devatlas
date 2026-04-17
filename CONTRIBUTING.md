# Contributing to DevAtlas

This document defines the engineering standards, development workflow, and contribution rules for the DevAtlas platform.

---

## Development Workflow

### Branch Strategy

```
main              → production-ready code
develop           → integration branch
feature/*         → new features
fix/*             → bug fixes
docs/*            → documentation changes

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):


feat: add guide search endpoint
fix: resolve pagination offset bug
docs: update architecture diagram
refactor: extract validation pipe
chore: update dependencies

### Pull Request Rules

- Every PR must target `develop`
- Require at least 1 review
- All CI checks must pass
- Squash merge preferred

---

## TypeScript Standards

### General Rules

- **Strict mode** enabled in all `tsconfig.json`
- No `any` — use `unknown` + type guards
- No `enum` — use `as const` objects
- Explicit return types on all exported functions
- Interfaces over types for object shapes

typescript
// ✅ Correct
export const Difficulty = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

// ❌ Wrong
export enum Difficulty {
  BEGINNER = "beginner",
}

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files | `kebab-case` | `get-guides.ts` |
| Components | `PascalCase` | `GuideCard.tsx` |
| Functions | `camelCase` | `getGuideBySlug()` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_PAGE_SIZE` |
| Types/Interfaces | `PascalCase` | `GuideResponse` |
| Database tables | `snake_case` | `guide_tags` |
| Database columns | `snake_case` | `created_at` |
| Primary keys | `id UUID` | — |

---

## Backend Standards (NestJS)

### Module Structure


modules/guides/
├── guides.module.ts
├── guides.controller.ts
├── guides.service.ts
├── dto/
│   ├── create-guide.dto.ts
│   └── guide-response.dto.ts
├── entities/
│   └── guide.entity.ts
└── __tests__/
    └── guides.service.spec.ts

### Patterns

- One module per domain concept
- DTOs for all request/response shapes
- Services contain business logic — controllers are thin
- Use Prisma for all database access
- Validation via `class-validator` + `ValidationPipe`
- Global exception filter for consistent error responses

### API Response Format

typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

---

## Frontend Standards (Next.js)

### Feature-Based Architecture


features/
├── guides/
│   ├── components/
│   │   ├── guide-card.tsx
│   │   └── guide-list.tsx
│   ├── api/
│   │   └── get-guides.ts
│   ├── hooks/
│   │   └── use-guides.ts
│   ├── types/
│   │   └── guide.types.ts
│   └── index.ts          # Public API barrel

### Rules

- **Feature isolation**: features never import from other features directly
- **Barrel exports**: each feature exposes only its public API via `index.ts`
- **Server Components by default** — use `"use client"` only when necessary
- **No inline styles** — Tailwind CSS only
- Data fetching in server components or dedicated API files
- Components must be small and focused (< 150 lines)

### Import Order

typescript
// 1. React / Next.js
import { Suspense } from "react";
import Link from "next/link";

// 2. External packages
import { cn } from "class-variance-authority";

// 3. Internal packages
import { Button } from "@repo/ui";
import type { Guide } from "@repo/types";

// 4. Feature-local imports
import { GuideCard } from "./components/guide-card";

---

## Styling Standards

### Technology

- **Tailwind CSS 4** with CSS-first configuration
- **shadcn/ui** as component foundation
- **CSS variables** for theming (defined in `globals.css`)
- **class-variance-authority (cva)** for component variants
- **tailwind-merge** for class conflict resolution

### Rules

- No inline `style` attributes
- No CSS modules — Tailwind only
- Use `cn()` utility for conditional classes
- Dark mode via CSS variables (not Tailwind `dark:` prefix)
- Responsive design: mobile-first approach

---

## Architectural Boundaries

### Import Rules


app/ → features/ → packages/
          ↓
     (never across features)

| From | Can Import | Cannot Import |
|---|---|---|
| `app/` | `features/`, `packages/`, `components/layout/` | — |
| `features/X/` | `packages/`, own internals | `features/Y/`, `app/` |
| `packages/ui/` | `packages/types/`, `packages/utils/` | `features/`, `app/` |
| `packages/types/` | nothing | everything else |
| `apps/api/modules/` | `packages/types/`, own module | other modules directly |

### Package Dependency Direction


apps/web  → packages/ui → packages/types
apps/web  → packages/utils
apps/api  → packages/types
apps/api  → packages/utils

Cross-package imports must go through published package APIs, never deep imports.

---

## Environment Variables Contract

All environment variables must be defined in `.env.example` files. **Never commit `.env` files.**

### API (`apps/api/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | API server port (default: `4000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI features |

### Web (`apps/web/.env`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Public API base URL |

### Infrastructure (`infra/`)

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_USER` | Yes | PostgreSQL username |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL password |
| `POSTGRES_DB` | Yes | PostgreSQL database name |

### Rules

- Never commit `.env` to version control
- Always keep `.env.example` updated when adding new variables
- Validate all required variables at application startup
- Use `@nestjs/config` with validation schema in API

---

## Code Quality

### Linting

- ESLint with shared config at repo root (`.eslintrc.cjs`)
- No `console.log` in production code — use proper logger
- No unused imports or variables

### Testing

- Unit tests with Jest (API) and Vitest (Web)
- Test files co-located with source: `__tests__/` directory
- Minimum coverage target: 80% for services

### Pre-commit

All code must pass before merge:

bash
pnpm lint
pnpm build
pnpm test


---