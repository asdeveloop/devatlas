import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppPageShell } from '../../../components/layout/app-page-shell';
import { getAiSummary } from '../../../features/ai/api/get-ai-summary';
import { getRelatedTools } from '../../../features/tools/api/get-related-tools';
import { getToolBySlug } from '../../../features/tools/api/get-tool-by-slug';
import { ToolDetailContent } from '../../../features/tools/components/tool-detail-content';

export const dynamic = 'force-dynamic';

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tool = await getToolBySlug(slug);
    return {
      title: `${tool.name} - DevAtlas`,
      description: tool.description || `Explore ${tool.name} on DevAtlas.`,
      openGraph: {
        title: tool.name,
        description: tool.description || `Explore ${tool.name} on DevAtlas.`,
        type: 'article',
      },
      twitter: {
        card: 'summary',
        title: tool.name,
        description: tool.description || `Explore ${tool.name} on DevAtlas.`,
      },
    };
  } catch {
    return {
      title: 'Tool Not Found - DevAtlas',
    };
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;

  let tool;
  let related = [];
  let summary = null;

  try {
    tool = await getToolBySlug(slug);
    [related, summary] = await Promise.all([
      getRelatedTools(tool.id),
      getAiSummary('tool', slug).catch(() => null),
    ]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('404')) {
      notFound();
    }

    throw error;
  }

  return (
    <AppPageShell>
      <ToolDetailContent tool={tool} summary={summary} related={related} />
    </AppPageShell>
  );
}
