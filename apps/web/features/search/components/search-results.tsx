import type { SearchResultItem } from '@devatlas/types';
import Link from 'next/link';

interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
}

export function SearchResults({ query, results }: SearchResultsProps): React.JSX.Element {
  if (results.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-10 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        No results found for "{query}".
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {results.map((result) => (
        <article
          key={`${result.contentType}-${result.id}`}
          className="rounded-lg border border-neutral-200 p-5 transition-shadow hover:shadow-md dark:border-neutral-800"
        >
          <Link href={result.url} className="block space-y-3">
            <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wide text-neutral-500">
              <span>{result.contentType}</span>
              <span>{result.category}</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{result.title}</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{result.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
