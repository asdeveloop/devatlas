import type { CategoryListItem } from '@devatlas/types';

interface CategoryCardProps {
  category: CategoryListItem;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{category.name}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {category.description || 'A DevAtlas content category.'}
        </p>
      </div>
    </article>
  );
}
