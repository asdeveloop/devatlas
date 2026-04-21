import { CategoriesClient, HttpClient } from '@devatlas/api-client';
import type { CategoryListItem, CategoryListParams, PaginationMeta } from '@devatlas/types';

import { webEnv } from '../../../lib/env';

export interface CategoryListResponse {
  data: CategoryListItem[];
  meta: PaginationMeta;
}

const categoriesClient = new CategoriesClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getCategories(params?: CategoryListParams): Promise<CategoryListResponse> {
  const response = await categoriesClient.list(params);
  return {
    data: response.data,
    meta: response.meta,
  };
}
