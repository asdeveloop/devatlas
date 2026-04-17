export interface HttpClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = config.defaultHeaders ?? {
      "Content-Type": "application/json"
    };
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(options.headers ?? {})
      }
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`API error ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
  }
}
