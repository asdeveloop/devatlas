import type { ToolListItem } from '@devatlas/types';
import Link from 'next/link';

interface ToolCardProps {
  tool: ToolListItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="rounded-lg border border-neutral-200 p-5 transition-shadow hover:shadow-md dark:border-neutral-800">
      <Link href={`/tools/${tool.slug}`} className="block space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{tool.name}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {tool.description || 'No description available yet.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{tool.category.name}</span>
          <span>{tool.status}</span>
          <span>Score {tool.popularityScore}</span>
        </div>
      </Link>
    </article>
  );
}
