import type { GuideListItem } from '@devatlas/types';
import { GuideCard } from './guide-card';

interface GuidesListProps {
  guides: GuideListItem[];
}

export function GuidesList({ guides }: GuidesListProps) {
  if (guides.length === 0) {
    return <p className="py-12 text-center text-neutral-500">No guides found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
        <GuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  );
}
