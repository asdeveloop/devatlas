import type { Category } from '../content/category';
export interface CreateCategoryBody {
    slug: string;
    name: string;
    description?: string;
}
export interface UpdateCategoryBody {
    slug?: string;
    name?: string;
    description?: string | null;
}
export type CategoryListItem = Category;
export type CategoryDetail = Category;
//# sourceMappingURL=category.d.ts.map