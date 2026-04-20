import {
  resolveEndpoint,
  type ApiEndpointDefinition,
  type ApiEndpointKey
} from "./endpoints";
import { fetchJson, type ApiSuccessResponse, type FetchJsonOptions } from "./fetcher";

export type ApiClientConfig = {
  baseUrl: string;
  headers?: HeadersInit;
};

export class ApiClient {
  private readonly baseUrl: string;
  private readonly headers?: HeadersInit;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.headers = config.headers;
  }

  async request<TData>(
    endpoint: ApiEndpointKey | ApiEndpointDefinition,
    options: FetchJsonOptions & {
      params?: Record<string, string | number>;
    } = {}
  ): Promise<ApiSuccessResponse<TData>> {
    const { params, headers, ...requestOptions } = options;
    const resolvedEndpoint = resolveEndpoint(endpoint, params);

    return fetchJson<TData>(`${this.baseUrl}${resolvedEndpoint.path}`, {
      method: resolvedEndpoint.method,
      ...requestOptions,
      headers: {
        ...this.headers,
        ...headers
      }
    });
  }

  async get<TData>(
    endpoint: ApiEndpointKey | ApiEndpointDefinition,
    options: Omit<FetchJsonOptions, "method"> & {
      params?: Record<string, string | number>;
    } = {}
  ): Promise<ApiSuccessResponse<TData>> {
    return this.request<TData>(endpoint, {
      ...options,
      method: "GET"
    });
  }

  async post<TData, TBody>(
    endpoint: ApiEndpointKey | ApiEndpointDefinition,
    options: Omit<FetchJsonOptions, "method" | "body"> & {
      body?: TBody;
      params?: Record<string, string | number>;
    } = {}
  ): Promise<ApiSuccessResponse<TData>> {
    const { body, ...rest } = options;

    return this.request<TData>(endpoint, {
      ...rest,
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  }
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
