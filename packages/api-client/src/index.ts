import { HttpClient } from './http/http-client';

export { HttpClient };

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}

type AiContentType = 'guide' | 'tool';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
type ToolTier = 'FREE' | 'FREEMIUM' | 'PRO' | 'ENTERPRISE';
type ToolPrice = 'FREE' | 'PAID' | 'MIXED';
type RelationType = 'RELATES_TO' | 'MENTIONS' | 'PREREQUISITE' | 'ALTERNATIVE';

interface GetAiSummaryParams {
  contentType: AiContentType;
  slug: string;
}

interface AiSummaryDetail {
  id: string;
  contentType: AiContentType;
  contentId: string;
  slug: string;
  title: string;
  summary: string;
  model: string;
  createdAt: string;
}

interface AskAiBody {
  question: string;
  limit?: number;
}

interface SearchBody {
  query: string;
  limit?: number;
}

interface SearchResultItem {
  id: string;
  contentType: 'guide' | 'tool';
  title: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
  score: number;
}

interface SearchResponse {
  query: string;
  results: SearchResultItem[];
  total: number;
}

interface AskAiResponse {
  id: string;
  question: string;
  answer: string;
  sources: Array<{
    contentType: AiContentType;
    title: string;
    slug: string;
    url: string;
    summary: string;
  }>;
  createdAt: string;
}

interface CategoryDetail {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

type CategoryListItem = CategoryDetail;
type CategoryListParams = PaginationParams;

interface CreateCategoryBody {
  slug: string;
  name: string;
  icon?: string;
}

interface UpdateCategoryBody {
  name?: string;
  icon?: string | null;
}

interface TagDetail {
  id: string;
  slug: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

type TagListItem = TagDetail;
type TagListParams = PaginationParams;

interface CreateTagBody {
  slug: string;
  name: string;
}

interface UpdateTagBody {
  name?: string;
}

interface GuideListParams extends PaginationParams {
  categorySlug?: string;
  tagSlug?: string;
  difficulty?: Difficulty;
  status?: ContentStatus;
  search?: string;
  sortBy?: 'createdAt' | 'readingTime' | 'title';
  sortOrder?: 'asc' | 'desc';
}

interface GuideListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  readingTime: number;
  status: ContentStatus;
  category: { id: string; slug: string; name: string };
  tags: Array<{ id: string; slug: string; name: string }>;
  createdAt: string;
}

interface GuideDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  difficulty: Difficulty;
  readingTime: number;
  categoryId: string;
  status: ContentStatus;
  category: CategoryDetail;
  tags: TagDetail[];
  createdAt: string;
  updatedAt: string;
}

interface ToolListParams extends PaginationParams {
  categorySlug?: string;
  tagSlug?: string;
  tier?: ToolTier;
  price?: ToolPrice;
}

interface ToolListItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  website: string | null;
  github: string | null;
  categoryId: string;
  popularityScore: number;
  status: string;
  category: { id: string; slug: string; name: string };
  tags: Array<{ id: string; slug: string; name: string }>;
  createdAt: string;
  updatedAt: string;
}

interface ToolDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  website: string | null;
  github: string | null;
  categoryId: string;
  popularityScore: number;
  status: string;
  category: CategoryDetail;
  tags: TagDetail[];
  createdAt: string;
  updatedAt: string;
}

interface CreateToolBody {
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

interface UpdateToolBody {
  name?: string;
  slug?: string;
  description?: string | null;
  website?: string | null;
  github?: string | null;
  icon?: string | null;
  active?: boolean;
  tier?: ToolTier;
  price?: ToolPrice;
  categoryId?: string;
  tagIds?: string[];
}

interface ContentRelation {
  id: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  relationType: RelationType;
  weight: number | null;
}

interface CreateContentRelationBody {
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  relationType: RelationType;
  weight?: number;
}

interface RelatedContentItem {
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
}

function toSearchParams(params: Record<string, string | number | boolean | undefined>) {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );
}

function toPagedParams(params: PaginationParams, extras: Record<string, string | number | boolean | undefined> = {}) {
  return {
    ...extras,
    page: params.page,
    pageSize: params.limit,
  };
}

export class GuidesClient {
  constructor(private readonly http: HttpClient) {}
  list(params: GuideListParams = {}) {
    const searchParams = toSearchParams({ skip: params.page && params.limit ? (params.page - 1) * params.limit : undefined, take: params.limit, difficulty: params.difficulty, status: params.status, categorySlug: params.categorySlug, tagSlug: params.tagSlug, search: params.search, sortBy: params.sortBy, order: params.sortOrder });
    return this.http.request<ApiPaginatedResponse<GuideListItem>>(`/api/v1/guides?${searchParams.toString()}`);
  }
  getBySlug(slug: string) { return this.http.request<ApiResponse<GuideDetail>>(`/api/v1/guides/${encodeURIComponent(slug)}`); }
  getRelated(id: string) { return this.http.request<ApiResponse<RelatedContentItem[]>>(`/api/v1/guides/${encodeURIComponent(id)}/related`); }
}

export class ToolsClient {
  constructor(private readonly http: HttpClient) {}
  list(params: ToolListParams = {}) {
    const searchParams = toSearchParams(toPagedParams(params, { categorySlug: params.categorySlug, tagSlug: params.tagSlug, tier: params.tier, price: params.price }));
    return this.http.request<ApiPaginatedResponse<ToolListItem>>(`/api/v1/tools?${searchParams.toString()}`);
  }
  getBySlug(slug: string) { return this.http.request<ApiResponse<ToolDetail>>(`/api/v1/tools/${encodeURIComponent(slug)}`); }
  getRelated(id: string) { return this.http.request<ApiResponse<RelatedContentItem[]>>(`/api/v1/tools/${encodeURIComponent(id)}/related`); }
  create(body: CreateToolBody) { return this.http.request<ApiResponse<ToolDetail>>('/api/v1/tools', { method: 'POST', body: JSON.stringify(body) }); }
  update(slug: string, body: UpdateToolBody) { return this.http.request<ApiResponse<ToolDetail>>(`/api/v1/tools/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify(body) }); }
}

export class ContentRelationsClient {
  constructor(private readonly http: HttpClient) {}
  create(body: CreateContentRelationBody) { return this.http.request<ApiResponse<ContentRelation>>('/api/v1/content-relations', { method: 'POST', body: JSON.stringify(body) }); }
}

export class AiClient {
  constructor(private readonly http: HttpClient) {}
  getSummary(params: GetAiSummaryParams) { return this.http.request<ApiResponse<AiSummaryDetail>>(`/api/v1/ai/summaries/${encodeURIComponent(params.contentType)}/${encodeURIComponent(params.slug)}`); }
  ask(body: AskAiBody) { return this.http.request<ApiResponse<AskAiResponse>>('/api/v1/ai/ask', { method: 'POST', body: JSON.stringify(body) }); }
}

export class SearchClient {
  constructor(private readonly http: HttpClient) {}
  search(body: SearchBody) { return this.http.request<ApiResponse<SearchResponse>>('/api/v1/search', { method: 'POST', body: JSON.stringify(body) }); }
}

export class CategoriesClient {
  constructor(private readonly http: HttpClient) {}
  list(params: CategoryListParams = {}) { const searchParams = toSearchParams(toPagedParams(params)); return this.http.request<ApiPaginatedResponse<CategoryListItem>>(`/api/v1/categories?${searchParams.toString()}`); }
  getBySlug(slug: string) { return this.http.request<ApiResponse<CategoryDetail>>(`/api/v1/categories/${encodeURIComponent(slug)}`); }
  create(body: CreateCategoryBody) { return this.http.request<ApiResponse<CategoryDetail>>('/api/v1/categories', { method: 'POST', body: JSON.stringify(body) }); }
  update(slug: string, body: UpdateCategoryBody) { return this.http.request<ApiResponse<CategoryDetail>>(`/api/v1/categories/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify(body) }); }
}

export class TagsClient {
  constructor(private readonly http: HttpClient) {}
  list(params: TagListParams = {}) { const searchParams = toSearchParams(toPagedParams(params)); return this.http.request<ApiPaginatedResponse<TagListItem>>(`/api/v1/tags?${searchParams.toString()}`); }
  getBySlug(slug: string) { return this.http.request<ApiResponse<TagDetail>>(`/api/v1/tags/${encodeURIComponent(slug)}`); }
  create(body: CreateTagBody) { return this.http.request<ApiResponse<TagDetail>>('/api/v1/tags', { method: 'POST', body: JSON.stringify(body) }); }
  update(slug: string, body: UpdateTagBody) { return this.http.request<ApiResponse<TagDetail>>(`/api/v1/tags/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify(body) }); }
}
