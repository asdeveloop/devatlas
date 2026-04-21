import { Difficulty, type GuideDetail, type RelatedContentItem } from '@devatlas/types';

import { RelatedContentSection } from '../../content-relations/components/related-content-section';

const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.BEGINNER]: 'Beginner',
  [Difficulty.INTERMEDIATE]: 'Intermediate',
  [Difficulty.ADVANCED]: 'Advanced',
};

interface GuideDetailContentProps {
  guide: GuideDetail;
  related?: RelatedContentItem[];
}

export function GuideDetailContent({ guide, related = [] }: GuideDetailContentProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold leading-tight">{guide.title}</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">{guide.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
          <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{guide.category.name}</span>
          <span>{difficultyLabels[guide.difficulty] ?? guide.difficulty}</span>
          <span>{guide.readingTime} min read</span>
        </div>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: guide.content }} />
      </div>

      <RelatedContentSection items={related} title="Continue with related content" />
    </article>
  );
}
