import type { SearchResponse } from '@devatlas/types';

import { searchClient } from '../../../lib/api-client';

const DEFAULT_LIMIT = 12;

export async function searchContent(query: string): Promise<SearchResponse> {
  return searchClient.search({
    query,
    limit: DEFAULT_LIMIT,
  }).then((response) => response.data);
}
