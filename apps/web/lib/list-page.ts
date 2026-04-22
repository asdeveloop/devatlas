import type { CategoryListItem, CategoryListParams, GuideListParams, TagListItem, ToolListParams } from '@devatlas/types';

import { getCategories } from '../features/categories/api/get-categories';
import { getTags } from '../features/tags/api/get-tags';

type SearchParamValue = string | string[] | undefined;
export type SearchParams = Record<string, SearchParamValue>;
export type TaxonomyFilterGroup = {
  key: string;
  label: string;
  options: Array<{
    label: string;
    value: string;
  }>;
};

export async function getTaxonomyFilters() {
  const [categories, tags] = await Promise.all([
    getCategories({ page: 1, limit: 50 }),
    getTags({ page: 1, limit: 50 }),
  ]);

  return {
    categories,
    tags,
    groups: buildTaxonomyFilterGroups(categories.data, tags.data),
  };
}

export function getSingleSearchParam(params: SearchParams, key: string): string | undefined {
  const value = params[key];
  return typeof value === 'string' ? value : undefined;
}

export function getNumberSearchParam(params: SearchParams, key: string, fallback: number): number {
  const value = getSingleSearchParam(params, key);
  return value ? Number(value) : fallback;
}

export function buildTaxonomyFilterGroups(
  categories: CategoryListItem[],
  tags: TagListItem[],
): TaxonomyFilterGroup[] {
  return [
    {
      key: 'categorySlug',
      label: 'Category',
      options: categories.map((category) => ({
        label: category.name,
        value: category.slug,
      })),
    },
    {
      key: 'tagSlug',
      label: 'Tag',
      options: tags.map((tag) => ({
        label: tag.name,
        value: tag.slug,
      })),
    },
  ];
}

export function parseGuideListParams(params: SearchParams): GuideListParams {
  return {
    page: getNumberSearchParam(params, 'page', 1),
    limit: getNumberSearchParam(params, 'limit', 12),
    categorySlug: getSingleSearchParam(params, 'categorySlug'),
    tagSlug: getSingleSearchParam(params, 'tagSlug'),
    difficulty: getSingleSearchParam(params, 'difficulty') as GuideListParams['difficulty'] | undefined,
    search: getSingleSearchParam(params, 'search'),
    sortBy: (getSingleSearchParam(params, 'sortBy') as GuideListParams['sortBy'] | undefined) ?? 'createdAt',
    sortOrder: (getSingleSearchParam(params, 'sortOrder') as GuideListParams['sortOrder'] | undefined) ?? 'desc',
  };
}

export function parseToolListParams(params: SearchParams): ToolListParams {
  return {
    page: getNumberSearchParam(params, 'page', 1),
    limit: getNumberSearchParam(params, 'limit', 12),
    categorySlug: getSingleSearchParam(params, 'categorySlug'),
    tagSlug: getSingleSearchParam(params, 'tagSlug'),
    tier: getSingleSearchParam(params, 'tier') as ToolListParams['tier'] | undefined,
    price: getSingleSearchParam(params, 'price') as ToolListParams['price'] | undefined,
  };
}

export function parseCategoryListParams(params: SearchParams): CategoryListParams {
  return {
    page: getNumberSearchParam(params, 'page', 1),
    limit: getNumberSearchParam(params, 'limit', 12),
  };
}
