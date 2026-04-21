import type { RelatedContentItem } from '@devatlas/types';
import Link from 'next/link';

interface RelatedContentSectionProps {
  items: RelatedContentItem[];
  title?: string;
}

export function RelatedContentSection({
  items,
  title = 'Related content',
}: RelatedContentSectionProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-neutral-500">Suggested next reads and tools from the knowledge graph.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={`${item.contentType}-${item.id}-${item.relationType}`}
            href={item.url}
            className="rounded-xl border border-neutral-200 p-4 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium uppercase tracking-wide dark:bg-neutral-800">
                {item.contentType}
              </span>
              <span>{item.relationType.replace(/_/g, ' ').toLowerCase()}</span>
              {item.weight !== null ? <span>Weight {item.weight.toFixed(2)}</span> : null}
            </div>
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="rounded bg-neutral-100 px-2 py-1 dark:bg-neutral-800">{item.category.name}</span>
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag.id}>#{tag.name}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
