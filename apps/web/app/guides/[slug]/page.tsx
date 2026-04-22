import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppPageShell } from '../../../components/layout/app-page-shell';
import { getAiSummary } from '../../../features/ai/api/get-ai-summary';
import { getGuideBySlug } from '../../../features/guides/api/get-guide-by-slug';
import { getRelatedGuides } from '../../../features/guides/api/get-related-guides';
import { GuideDetailContent } from '../../../features/guides/components/guide-detail-content';

export const dynamic = 'force-dynamic';

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const guide = await getGuideBySlug(slug);
    return {
      title: `${guide.title} - DevAtlas`,
      description: guide.description,
      openGraph: {
        title: guide.title,
        description: guide.description,
        type: 'article',
      },
      twitter: {
        card: 'summary',
        title: guide.title,
        description: guide.description,
      },
    };
  } catch {
    return {
      title: 'Guide Not Found - DevAtlas',
    };
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  let guide;
  let related = [];
  let summary = null;

  try {
    guide = await getGuideBySlug(slug);
    [related, summary] = await Promise.all([
      getRelatedGuides(guide.id),
      getAiSummary('guide', slug).catch(() => null),
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
      <GuideDetailContent guide={guide} summary={summary} related={related} />
    </AppPageShell>
  );
}
