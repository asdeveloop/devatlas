import type { CategoryListItem, CategoryListParams, PaginationMeta } from '@devatlas/types';

import { categoriesClient } from '../../../lib/api-client';

export interface CategoryListResponse {
  data: CategoryListItem[];
  meta: PaginationMeta;
}

export async function getCategories(params?: CategoryListParams): Promise<CategoryListResponse> {
  const response = await categoriesClient.list(params);
  return {
    data: response.data as CategoryListItem[],
    meta: response.meta,
  };
}
