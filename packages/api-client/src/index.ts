import type {
  ApiPaginatedResponse,
  ApiResponse,
  GuideDetail,
  GuideListItem,
  GuideListParams,
} from '@devatlas/types';
import { HttpClient } from './http/http-client';

export { HttpClient };

export class GuidesClient {
  constructor(private readonly http: HttpClient) {}

  list(params: GuideListParams = {}) {
    const searchParams = new URLSearchParams(
      Object.entries({
        skip: params.page && params.limit ? (params.page - 1) * params.limit : undefined,
        take: params.limit,
        difficulty: params.difficulty,
        status: params.status,
        sortBy: params.sortBy,
        order: params.sortOrder,
      })
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)]),
    );

    return this.http.request<ApiPaginatedResponse<GuideListItem>>(`/api/v1/guides?${searchParams.toString()}`);
  }

  getBySlug(slug: string) {
    return this.http.request<ApiResponse<GuideDetail>>(`/api/v1/guides/${encodeURIComponent(slug)}`);
  }
}

export class ToolsClient {
  constructor(private readonly http: HttpClient) {}

  list(params: Record<string, string | number | undefined> = {}) {
    const searchParams = new URLSearchParams(
      Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)]),
    );

    return this.http.request<ApiPaginatedResponse<unknown>>(`/api/v1/tools?${searchParams.toString()}`);
  }
}
