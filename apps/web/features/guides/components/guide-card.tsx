import { Difficulty, type GuideListItem } from '@devatlas/types';
import Link from 'next/link';

const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.BEGINNER]: 'Beginner',
  [Difficulty.INTERMEDIATE]: 'Intermediate',
  [Difficulty.ADVANCED]: 'Advanced',
};

interface GuideCardProps {
  guide: GuideListItem;
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <article className="rounded-lg border border-neutral-200 p-5 transition-shadow hover:shadow-md dark:border-neutral-800">
      <Link href={`/guides/${guide.slug}`} className="block space-y-2">
        <h3 className="text-lg font-semibold">{guide.title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{guide.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          <span>{difficultyLabels[guide.difficulty] ?? guide.difficulty}</span>
          <span>{guide.readingTime} min read</span>
          <span>{guide.category.name}</span>
        </div>
      </Link>
    </article>
  );
}
