export type ApiSuccessResponse<TData> = {
  data: TData;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(args: {
    message: string;
    status: number;
    code?: string;
    details?: Record<string, unknown>;
  }) {
    super(args.message);
    this.name = "ApiClientError";
    this.status = args.status;
    this.code = args.code ?? "UNKNOWN_API_ERROR";
    this.details = args.details;
  }
}

export type FetchJsonOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined>;
};

function withQueryString(url: string, query?: FetchJsonOptions["query"]): string {
  if (!query) {
    return url;
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const serializedQuery = searchParams.toString();
  if (!serializedQuery) {
    return url;
  }

  return `${url}${url.includes("?") ? "&" : "?"}${serializedQuery}`;
}

export async function fetchJson<TData>(
  input: string,
  options: FetchJsonOptions = {}
): Promise<ApiSuccessResponse<TData>> {
  const { query, headers, ...init } = options;
  const response = await fetch(withQueryString(input, query), {
    ...init,
    headers: {
      accept: "application/json",
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...headers
    }
  });

  if (!response.ok) {
    let errorPayload: ApiErrorResponse | undefined;

    try {
      errorPayload = (await response.json()) as ApiErrorResponse;
    } catch {
      errorPayload = undefined;
    }

    throw new ApiClientError({
      message: errorPayload?.error.message ?? `Request failed with status ${response.status}`,
      status: response.status,
      code: errorPayload?.error.code,
      details: errorPayload?.error.details
    });
  }

  return (await response.json()) as ApiSuccessResponse<TData>;
}
