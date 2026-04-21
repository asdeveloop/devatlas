import type { SearchResultItem } from '../content/search';

export interface SearchBody {
  query: string;
  limit?: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResultItem[];
  total: number;
}
