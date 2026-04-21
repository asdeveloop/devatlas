import type {
  ApiPaginatedResponse,
  ApiResponse,
  CategoryDetail,
  CategoryListItem,
  CategoryListParams,
  CreateCategoryBody,
  CreateTagBody,
  CreateToolBody,
  GuideDetail,
  GuideListItem,
  GuideListParams,
  PaginationParams,
  TagDetail,
  TagListItem,
  TagListParams,
  ToolDetail,
  ToolListItem,
  ToolListParams,
  UpdateCategoryBody,
  UpdateTagBody,
  UpdateToolBody,
} from '@devatlas/types';

import { HttpClient } from './http/http-client';

export { HttpClient };

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
    const searchParams = toSearchParams({
      skip: params.page && params.limit ? (params.page - 1) * params.limit : undefined,
      take: params.limit,
      difficulty: params.difficulty,
      status: params.status,
      categorySlug: params.categorySlug,
      tagSlug: params.tagSlug,
      search: params.search,
      sortBy: params.sortBy,
      order: params.sortOrder,
    });

    return this.http.request<ApiPaginatedResponse<GuideListItem>>(`/api/v1/guides?${searchParams.toString()}`);
  }

  getBySlug(slug: string) {
    return this.http.request<ApiResponse<GuideDetail>>(`/api/v1/guides/${encodeURIComponent(slug)}`);
  }
}

export class ToolsClient {
  constructor(private readonly http: HttpClient) {}

  list(params: ToolListParams = {}) {
    const searchParams = toSearchParams(toPagedParams(params, {
      categorySlug: params.categorySlug,
      tagSlug: params.tagSlug,
      tier: params.tier,
      price: params.price,
    }));
    return this.http.request<ApiPaginatedResponse<ToolListItem>>(`/api/v1/tools?${searchParams.toString()}`);
  }

  getBySlug(slug: string) {
    return this.http.request<ApiResponse<ToolDetail>>(`/api/v1/tools/${encodeURIComponent(slug)}`);
  }

  create(body: CreateToolBody) {
    return this.http.request<ApiResponse<ToolDetail>>('/api/v1/tools', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  update(slug: string, body: UpdateToolBody) {
    return this.http.request<ApiResponse<ToolDetail>>(`/api/v1/tools/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
}

export class CategoriesClient {
  constructor(private readonly http: HttpClient) {}

  list(params: CategoryListParams = {}) {
    const searchParams = toSearchParams(toPagedParams(params));
    return this.http.request<ApiPaginatedResponse<CategoryListItem>>(`/api/v1/categories?${searchParams.toString()}`);
  }

  getBySlug(slug: string) {
    return this.http.request<ApiResponse<CategoryDetail>>(`/api/v1/categories/${encodeURIComponent(slug)}`);
  }

  create(body: CreateCategoryBody) {
    return this.http.request<ApiResponse<CategoryDetail>>('/api/v1/categories', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  update(slug: string, body: UpdateCategoryBody) {
    return this.http.request<ApiResponse<CategoryDetail>>(`/api/v1/categories/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
}

export class TagsClient {
  constructor(private readonly http: HttpClient) {}

  list(params: TagListParams = {}) {
    const searchParams = toSearchParams(toPagedParams(params));
    return this.http.request<ApiPaginatedResponse<TagListItem>>(`/api/v1/tags?${searchParams.toString()}`);
  }

  getBySlug(slug: string) {
    return this.http.request<ApiResponse<TagDetail>>(`/api/v1/tags/${encodeURIComponent(slug)}`);
  }

  create(body: CreateTagBody) {
    return this.http.request<ApiResponse<TagDetail>>('/api/v1/tags', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  update(slug: string, body: UpdateTagBody) {
    return this.http.request<ApiResponse<TagDetail>>(`/api/v1/tags/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
}
