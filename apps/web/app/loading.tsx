export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 text-center">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-neutral-500">DevAtlas</p>
        <h1 className="text-3xl font-bold">Loading content</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Fetching the latest guides, tools, and categories.</p>
      </div>
    </div>
  );
}
