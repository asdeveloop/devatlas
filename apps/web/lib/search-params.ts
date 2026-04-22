type SearchParamValue = string | number | undefined | null;
type SearchParamRecord = Record<string, SearchParamValue>;

export function toSearchParams(params: SearchParamRecord): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
}

export function buildSearchUrl(basePath: string, params: SearchParamRecord): string {
  const query = toSearchParams(params).toString();
  return query ? `${basePath}?${query}` : basePath;
}
