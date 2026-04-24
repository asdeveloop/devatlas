import type { Metadata } from 'next';

import { AppPageShell } from '../../components/layout/app-page-shell';
import { ContentPageSection } from '../../components/layout/content-page-section';
import { searchContent } from '../../features/search/api/search-content';
import { SearchResults } from '../../features/search/components/search-results';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search - DevAtlas',
  description: 'Search guides and tools across DevAtlas.',
};

const MAX_QUERY_LENGTH = 200;

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = getQueryValue(params['q']).trim();
  const isQueryTooLong = query.length > MAX_QUERY_LENGTH;
  let response = null;
  let searchError: string | null = null;

  if (query && !isQueryTooLong) {
    try {
      response = await searchContent(query);
    } catch (error) {
      searchError = error instanceof Error ? error.message : 'Search is temporarily unavailable. Try again in a moment.';
    }
  }

  return (
    <AppPageShell>
      <ContentPageSection
        title="Search"
        description="Search across guides and tools from one canonical API-backed entry point."
      >
        <form action="/search" className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search guides, tools, and topics"
            className="min-h-12 flex-1 rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none ring-0 transition focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Search
          </button>
        </form>

        {isQueryTooLong ? (
          <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-6 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            Query is too long. Please use up to {MAX_QUERY_LENGTH} characters.
          </p>
        ) : query ? (
          <div className="space-y-4">
            {searchError ? (
              <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-6 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                Search failed. {searchError}
              </p>
            ) : (
              <>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {response?.total ?? 0} result(s) for "{query}".
                </p>
                <SearchResults query={query} results={response?.results ?? []} />
              </>
            )}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-10 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            Start with a query to search guides and tools.
          </p>
        )}
      </ContentPageSection>
    </AppPageShell>
  );
}
