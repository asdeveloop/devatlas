'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 text-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-neutral-500">DevAtlas</p>
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {error.message || 'The page could not be rendered right now.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
