import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageShell } from '../../../components/layout/page-shell';
import { SiteHeader } from '../../navigation';
import { getRelatedTools } from '../api/get-related-tools';
import { getToolBySlug } from '../api/get-tool-by-slug';
import { ToolDetailContent } from '../components/tool-detail-content';

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
  try {
    tool = await getToolBySlug(slug);
    related = await getRelatedTools(tool.id);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('404')) {
      notFound();
    }

    throw error;
  }

  return (
    <PageShell>
      <SiteHeader />
      <ToolDetailContent tool={tool} related={related} />
    </PageShell>
  );
}
