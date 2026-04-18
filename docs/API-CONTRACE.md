# API Contract — DevAtlas Platform

> TypeScript-first, OpenAPI-compatible API contract.
> ORM: Drizzle | DB: PostgreSQL 15+
> Last updated: 1405/01/29 (2026-04-18)

---

## Scope

| Module       | List             | Detail                | Mutation |
| ------------ | ---------------- | --------------------- | -------- |
| Guides       | `GET /v1/guides` | `GET /v1/guides/:slug` | Phase 3+ |
| Tools        | `GET /v1/tools`  | `GET /v1/tools/:slug`  | Phase 3+ |
| Categories   | `GET /v1/categories` | `GET /v1/categories/:slug` | Phase 3+ |
| Tags         | `GET /v1/tags`   | —                     | Phase 3+ |

---

## Design Principles

1. REST pattern: `/v1/{module}`
2. Unified response envelope for all endpoints
3. Zod validation on all inputs (query params, path params)
4. Drizzle query builder for all DB access — no raw SQL unless justified
5. Type-safe end-to-end: Drizzle schema → service → controller → response DTO

---

## Response Envelope

All responses follow this structure:

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  timestamp: string; // ISO 8601
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiError {
  success: false;
  error: {
    code: string;       // e.g. "GUIDE_NOT_FOUND"
    message: string;
    traceId: string;    // UUID per request
  };
  timestamp: string;
}

---

## Shared Query Parameters

| Param       | Type     | Default      | Description                          |
| ----------- | -------- | ------------ | ------------------------------------ |
| `search`    | `string` | —            | Full-text search on title/name       |
| `status`    | `enum`   | —            | Filter by status (DRAFT, PUBLISHED)  |
| `difficulty`| `enum`   | —            | Filter by difficulty (guides only)   |
| `sortBy`    | `string` | `createdAt`  | Sort field                           |
| `sortOrder` | `asc\|desc` | `desc`    | Sort direction                       |
| `page`      | `number` | `1`          | Page number (1-based)                |
| `limit`     | `number` | `12`         | Items per page                       |

---

## Guides

### `GET /v1/guides`

Query params:

| Param          | Type     | Description                |
| -------------- | -------- | -------------------------- |
| `search`       | `string` | Search in title, summary   |
| `categorySlug` | `string` | Filter by category slug    |
| `tagSlug`      | `string` | Filter by tag slug         |
| `difficulty`   | `enum`   | BEGINNER, INTERMEDIATE, ADVANCED |
| `status`       | `enum`   | DRAFT, PUBLISHED           |
| `sortBy`       | `string` | `createdAt` \| `title` \| `readTime` |
| `sortOrder`    | `string` | `asc` \| `desc`           |
| `page`         | `number` | Page number                |
| `limit`        | `number` | Items per page (default: 12) |

Response `data` type:

ts
interface GuideSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED';
  readTime: number | null;
  coverImage: string | null;
  category: CategoryRef | null;
  tags: TagRef[];
  createdAt: string;
  updatedAt: string;
}

Example response:

json
{
  "success": true,
  "data": [
    {
      "id": "clx1abc00",
      "title": "Getting Started with Docker",
      "slug": "getting-started-with-docker",
      "summary": "A beginner-friendly guide to containerization.",
      "difficulty": "BEGINNER",
      "status": "PUBLISHED",
      "readTime": 12,
      "coverImage": "/images/guides/docker-intro.webp",
      "category": { "id": "clx1cat01", "name": "DevOps", "slug": "devops" },
      "tags": [
        { "id": "clx1tag01", "name": "Docker", "slug": "docker" },
        { "id": "clx1tag02", "name": "Containers", "slug": "containers" }
      ],
      "createdAt": "2026-04-10T08:30:00.000Z",
      "updatedAt": "2026-04-15T14:20:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 47,
    "totalPages": 4
  },
  "timestamp": "2026-04-18T10:00:00.000Z"
}

### `GET /v1/guides/:slug`

Path param: `slug` (string, required)

Response `data` type:

ts
interface GuideDetail extends GuideSummary {
  content: string;          // Markdown body
  resources: ResourceLink[];
  tableOfContents: TocItem[];
}

interface ResourceLink {
  label: string;
  url: string;
  type: 'DOCUMENTATION' | 'VIDEO' | 'REPOSITORY' | 'ARTICLE';
}

interface TocItem {
  id: string;
  title: string;
  level: number; // 1-3
}

Error (404):

json
{
  "success": false,
  "error": {
    "code": "GUIDE_NOT_FOUND",
    "message": "Guide with slug 'nonexistent' not found.",
    "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  },
  "timestamp": "2026-04-18T10:00:00.000Z"
}

---

## Tools

### `GET /v1/tools`

Query params:

| Param          | Type     | Description                |
| -------------- | -------- | -------------------------- |
| `search`       | `string` | Search in name, description |
| `categorySlug` | `string` | Filter by category slug    |
| `sortBy`       | `string` | `popularity` \| `name` \| `createdAt` |
| `sortOrder`    | `string` | `asc` \| `desc`           |
| `page`         | `number` | Page number                |
| `limit`        | `number` | Items per page (default: 20) |

Response `data` type:

ts
interface ToolSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  popularity: number;
  status: 'DRAFT' | 'PUBLISHED';
  category: CategoryRef | null;
  tags: TagRef[];
  createdAt: string;
  updatedAt: string;
}

Example response:

json
{
  "success": true,
  "data": [
    {
      "id": "clx1tool01",
      "name": "Visual Studio Code",
      "slug": "visual-studio-code",
      "description": "A lightweight, extensible code editor.",
      "websiteUrl": "https://code.visualstudio.com",
      "logoUrl": "/images/tools/vscode.webp",
      "popularity": 98,
      "status": "PUBLISHED",
      "category": { "id": "clx1cat02", "name": "Editors", "slug": "editors" },
      "tags": [
        { "id": "clx1tag03", "name": "IDE", "slug": "ide" }
      ],
      "createdAt": "2026-03-01T12:00:00.000Z",
      "updatedAt": "2026-04-12T09:15:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 85,
    "totalPages": 5
  },
  "timestamp": "2026-04-18T10:00:00.000Z"
}

### `GET /v1/tools/:slug`

Path param: `slug` (string, required)

Response `data` type:

ts
interface ToolDetail extends ToolSummary {
  features: string[];
  alternatives: ToolRef[];
  guides: GuideSummary[];   // Related guides using this tool
}

interface ToolRef {
  id: string;
  name: string;
  slug: string;
}

Error (404):

json
{
  "success": false,
  "error": {
    "code": "TOOL_NOT_FOUND",
    "message": "Tool with slug 'nonexistent' not found.",
    "traceId": "b2c3d4e5-f6a7-8901-bcde-f12345678901"
  },
  "timestamp": "2026-04-18T10:00:00.000Z"
}

---

## Categories

### `GET /v1/categories`

No query params required. Returns all categories.

Response `data` type:

ts
interface CategoryRef {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  guideCount: number;
  toolCount: number;
}

Example response:

json
{
  "success": true,
  "data": [
    {
      "id": "clx1cat01",
      "name": "DevOps",
      "slug": "devops",
      "description": "Tools and practices for CI/CD, containers, and infrastructure.",
      "icon": "server",
      "guideCount": 12,
      "toolCount": 8
    }
  ],
  "timestamp": "2026-04-18T10:00:00.000Z"
}

### `GET /v1/categories/:slug`

Path param: `slug` (string, required)

Returns category detail with nested guides and tools summaries.

Response `data` type:

ts
interface CategoryDetail extends CategoryRef {
  guides: GuideSummary[];
  tools: ToolSummary[];
}

---

## Tags

### `GET /v1/tags`

No query params required. Returns all tags.

Response `data` type:

ts
interface TagRef {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
}

Example response:

json
{
  "success": true,
  "data": [
    {
      "id": "clx1tag01",
      "name": "Docker",
      "slug": "docker",
      "usageCount": 15
    }
  ],
  "timestamp": "2026-04-18T10:00:00.000Z"
}

---

## HTTP Status Codes

| Code  | Usage                                    |
| ----- | ---------------------------------------- |
| `200` | Successful response                      |
| `400` | Validation error (bad query params)      |
| `404` | Resource not found                       |
| `500` | Internal server error                    |

---

## Implementation Notes

- تمام query ها از Drizzle query builder استفاده می‌کنن — نه raw SQL.
- Relation loading با `with` clause در Drizzle relational queries انجام می‌شه.
- `slug` فیلد unique هست و به عنوان public identifier استفاده می‌شه.
- `id` فیلد internal هست — در response برمی‌گرده ولی برای lookup استفاده نمی‌شه.
- Enum ها (`status`, `difficulty`) در Drizzle schema با `pgEnum` تعریف شدن.
- Pagination روی list endpoints اجباری هست — default: `page=1, limit=12`.
- `usageCount` و `guideCount`/`toolCount` با aggregate query محاسبه می‌شن.

---
