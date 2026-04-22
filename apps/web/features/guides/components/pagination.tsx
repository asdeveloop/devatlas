import type { PaginationMeta } from '@devatlas/types';
import Link from 'next/link';

import { buildSearchUrl } from '../../../lib/search-params';

interface PaginationProps<TParams extends object> {
  meta: PaginationMeta;
  basePath: string;
  currentParams: TParams;
}

function buildPageUrl<TParams extends object>(basePath: string, params: TParams, page: number): string {
  const nextParams = { ...params, page };
  return buildSearchUrl(basePath, nextParams as Record<string, string | number | undefined>);
}

export function Pagination<TParams extends object>({ meta, basePath, currentParams }: PaginationProps<TParams>) {
  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center gap-2 py-6" aria-label="Pagination">
      {meta.hasPrevPage ? (
        <Link href={buildPageUrl(basePath, currentParams, meta.page - 1)} className="rounded border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
          Previous
        </Link>
      ) : null}
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        Page {meta.page} of {meta.totalPages}
      </span>
      {meta.hasNextPage ? (
        <Link href={buildPageUrl(basePath, currentParams, meta.page + 1)} className="rounded border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
          Next
        </Link>
      ) : null}
    </nav>
  );
}
