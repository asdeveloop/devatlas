'use client';

import { useEffect } from 'react';

interface SearchErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SearchError({ error, reset }: SearchErrorProps): React.JSX.Element {
  useEffect(() => {
    // Keep server/client navigation failures observable in local and platform logs.
    console.error('[Search Page Error]', error);
  }, [error]);

  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
      <h2 className="mb-2 font-semibold">Search temporarily unavailable</h2>
      <p className="mb-3">
        We couldn&apos;t load search results right now. Please retry once after a few seconds.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Try again
      </button>
    </div>
  );
}
