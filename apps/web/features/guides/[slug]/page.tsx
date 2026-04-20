import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "../../../components/layout/page-shell";
import { getGuideBySlug } from "../../../features/guides/api/get-guide-by-slug";
import { GuideDetailContent } from "../../../features/guides/components/guide-detail-content";
import { SiteHeader } from "../../../features/navigation";

export const dynamic = 'force-dynamic';

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const guide = await getGuideBySlug(slug);
    return {
      title: `${guide.title} — DevAtlas`,
      description: guide.description,
    };
  } catch {
    return {
      title: "Guide Not Found — DevAtlas",
    };
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  let guide;
  try {
    guide = await getGuideBySlug(slug);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    if (message.includes("404")) {
      notFound();
    }

    throw error;
  }

  return (
    <PageShell>
      <SiteHeader />
      <GuideDetailContent guide={guide} />
    </PageShell>
  );
}
