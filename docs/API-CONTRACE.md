# API Contract — DevAtlas Platform

> Synced with the current NestJS controllers, DTOs, and response wrappers.

## Base Runtime Rules

- Base prefix: `/api`
- Version prefix: `/v1`
- Effective route form: `/api/v1/{resource}`
- Swagger UI: `/docs`
- Success envelope:

```ts
interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
  traceId: string;
  timestamp: string;
}
```

- Error envelope:

```ts
interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string | string[];
    status: number;
  };
  meta: {
    path: string;
    method: string;
  };
  traceId: string;
  timestamp: string;
}
```

## Health

### `GET /api/v1/health`

Returns a direct object that is still wrapped by the global success envelope.

```ts
interface HealthPayload {
  status: 'ok' | 'error';
  uptime: number;
  service: string;
  environment: string;
  database: 'connected' | 'disconnected';
  timestamp: string;
}
```

## Categories

### `GET /api/v1/categories`

Query params:

- `page?: number = 1`
- `pageSize?: number = 50`

Response payload:

```ts
{
  data: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

### `GET /api/v1/categories/:slug`
### `POST /api/v1/categories`
### `PUT /api/v1/categories/:slug`
### `DELETE /api/v1/categories/:slug`

Create payload:

```ts
{
  name: string;
  slug: string;
  icon?: string;
}
```

Update payload:

```ts
{
  name?: string;
  icon?: string;
}
```

## Tags

### `GET /api/v1/tags`

Query params:

- `page?: number = 1`
- `pageSize?: number = 100`

### `GET /api/v1/tags/:slug`
### `POST /api/v1/tags`
### `PUT /api/v1/tags/:slug`
### `DELETE /api/v1/tags/:slug`

Create payload:

```ts
{
  name: string;
  slug: string;
}
```

Update payload:

```ts
{
  name?: string;
}
```

## Guides

### `GET /api/v1/guides`

Current query DTO combines pagination/sorting base fields with guide filters:

- `skip?: number`
- `take?: number`
- `sortBy?: string`
- `order?: 'asc' | 'desc'`
- `difficulty?: Difficulty`
- `status?: ContentStatus`
- `categoryId?: string`

Current list payload contains flat guide records plus pagination meta:

```ts
{
  data: Array<{
    id: string;
    slug: string;
    title: string;
    description: string | null;
    content: string | null;
    readingTime: number | null;
    difficulty: string | null;
    status: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

### `GET /api/v1/guides/:slug`

Returns guide detail mapped with related category and tags.

### `GET /api/v1/guides/:id/related`

Returns related guides/tools for the source guide id:

```ts
Array<{
  id: string;
  slug: string;
  contentType: 'guide' | 'tool';
  title: string;
  description: string;
  category: { id: string; slug: string; name: string };
  tags: Array<{ id: string; slug: string; name: string }>;
  relationType: RelationType;
  weight: number | null;
  url: string;
}>
```

### `POST /api/v1/guides`

```ts
{
  title: string;
  slug: string;
  description?: string;
  content?: string;
  difficulty?: Difficulty;
  readingTime?: number;
  categoryId: string;
  status?: ContentStatus;
  tagIds?: string[];
}
```

### `PATCH /api/v1/guides/:id`
### `DELETE /api/v1/guides/:id`

`PATCH` uses the same fields as create, all optional.

## Tools

### `GET /api/v1/tools`

Query params:

- `page?: number = 1`
- `pageSize?: number = 20`
- `tagSlug?: string`
- `categorySlug?: string`
- `tier?: ToolTier`
- `price?: ToolPrice`

List payload:

```ts
{
  data: Array<{
    id: string;
    slug: string;
    name: string;
    description: string | null;
    website: string | null;
    github: string | null;
    icon: string | null;
    active: boolean;
    tier: string;
    price: string;
    popularity: number;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

### `GET /api/v1/tools/:slug`

### `GET /api/v1/tools/:id/related`

Returns related guides/tools for the source tool id using the same payload shape as guide relations.

### `POST /api/v1/tools`

## Content Relations

### `POST /api/v1/content-relations`

```ts
{
  sourceType: EntityType;
  sourceId: string;
  targetType: EntityType;
  targetId: string;
  relationType: RelationType;
  weight?: number;
}
```

## Search

### `POST /api/v1/search`

Request payload:

```ts
{
  query: string;
  limit?: number; // default: 10
}
```

Response payload:

```ts
{
  query: string;
  results: Array<{
    id: string;
    contentType: 'guide' | 'tool';
    title: string;
    description: string;
    category: string;
    url: string;
    tags: string[];
    score: number;
  }>;
  total: number;
}
```

## AI

### `GET /api/v1/ai/summaries/:contentType/:slug`

Returns the persisted AI summary for a published guide or active tool. If a summary does not exist yet, the API generates it and stores it in `ai_summaries` before responding.

Response payload:

```ts
{
  id: string;
  contentType: 'guide' | 'tool';
  contentId: string;
  slug: string;
  title: string;
  summary: string;
  model: string;
  createdAt: string;
}
```

### `POST /api/v1/ai/ask`

Request payload:

```ts
{
  question: string;
  limit?: number; // default: 3, max: 5
}
```

Response payload:

```ts
{
  id: string;
  question: string;
  answer: string;
  sources: Array<{
    contentType: 'guide' | 'tool';
    title: string;
    slug: string;
    url: string;
    summary: string;
  }>;
  createdAt: string;
}
```

### `PUT /api/v1/tools/:slug`
### `DELETE /api/v1/tools/:slug`

Create payload:

```ts
{
  name: string;
  slug: string;
  description?: string;
  website?: string;
  github?: string;
  icon?: string;
  active?: boolean;
  tier: ToolTier;
  price: ToolPrice;
  categoryId: string;
  tagIds?: string[];
}
```

Update payload is the same shape with all fields optional.

## Error Codes In Active Use

- `GUIDE_NOT_FOUND`
- `TOOL_NOT_FOUND`
- `CATEGORY_NOT_FOUND`
- `TAG_NOT_FOUND`
- `SLUG_CONFLICT`
- `UNKNOWN`
