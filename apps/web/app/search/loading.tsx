export default function SearchLoading(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <div className="h-12 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="space-y-3">
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="h-40 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-40 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-40 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
