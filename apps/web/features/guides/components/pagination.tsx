import type { GuideListParams, PaginationMeta } from '@devatlas/types';
import Link from 'next/link';

interface PaginationProps {
  meta: PaginationMeta;
  basePath: string;
  currentParams: GuideListParams;
}

function buildPageUrl(basePath: string, params: GuideListParams, page: number): string {
  const searchParams = new URLSearchParams();
  const nextParams = { ...params, page };

  Object.entries(nextParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  return `${basePath}?${searchParams.toString()}`;
}

export function Pagination({ meta, basePath, currentParams }: PaginationProps) {
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
