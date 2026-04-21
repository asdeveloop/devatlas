import type { ToolListItem } from '@devatlas/types';

import { ToolCard } from './tool-card';

interface ToolsListProps {
  tools: ToolListItem[];
}

export function ToolsList({ tools }: ToolsListProps) {
  if (tools.length === 0) {
    return <p className="py-12 text-center text-neutral-500">No tools found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
