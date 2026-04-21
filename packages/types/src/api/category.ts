import type { Category } from '../content/category';

import type { PaginationParams } from './pagination';

export type CategoryListParams = PaginationParams;

export interface CreateCategoryBody {
  slug: string;
  name: string;
  icon?: string;
}

export interface UpdateCategoryBody {
  name?: string;
  icon?: string | null;
}

export type CategoryListItem = Category;
export type CategoryDetail = Category;
