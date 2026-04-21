import type { RelatedContentItem, ToolDetail } from '@devatlas/types';

import { RelatedContentSection } from '../../content-relations/components/related-content-section';

interface ToolDetailContentProps {
  tool: ToolDetail;
  related?: RelatedContentItem[];
}

export function ToolDetailContent({ tool, related = [] }: ToolDetailContentProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold leading-tight">{tool.name}</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {tool.description || 'A curated developer tool in the DevAtlas catalog.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
          <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{tool.category.name}</span>
          <span>{tool.status}</span>
          <span>Score {tool.popularityScore}</span>
        </div>
      </header>

      <section className="grid gap-4 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Website</h2>
          {tool.website ? (
            <a href={tool.website} className="mt-2 inline-flex text-sm text-blue-600 hover:underline" target="_blank" rel="noreferrer">
              {tool.website}
            </a>
          ) : (
            <p className="mt-2 text-sm text-neutral-500">Not provided</p>
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">GitHub</h2>
          {tool.github ? (
            <a href={tool.github} className="mt-2 inline-flex text-sm text-blue-600 hover:underline" target="_blank" rel="noreferrer">
              {tool.github}
            </a>
          ) : (
            <p className="mt-2 text-sm text-neutral-500">Not provided</p>
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Category</h2>
          <p className="mt-2 text-sm">{tool.category.name}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Tags</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {tool.tags.length > 0 ? (
              tool.tags.map((tag) => (
                <span key={tag.id} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs dark:bg-neutral-800">
                  {tag.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No tags assigned.</p>
            )}
          </div>
        </div>
      </section>

      <RelatedContentSection items={related} title="Related guides and alternatives" />
    </article>
  );
}
