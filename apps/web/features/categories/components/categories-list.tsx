import type { CategoryListItem } from '@devatlas/types';

import { CategoryCard } from './category-card';

interface CategoriesListProps {
  categories: CategoryListItem[];
}

export function CategoriesList({ categories }: CategoriesListProps) {
  if (categories.length === 0) {
    return <p className="py-12 text-center text-neutral-500">No categories found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
