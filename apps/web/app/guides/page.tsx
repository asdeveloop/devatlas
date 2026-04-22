import type { Metadata } from 'next';

import { AppPageShell } from '../../components/layout/app-page-shell';
import { ContentPageSection } from '../../components/layout/content-page-section';
import { getGuides } from '../../features/guides/api/get-guides';
import { GuidesList } from '../../features/guides/components/guides-list';
import { ListFilters } from '../../features/guides/components/list-filters';
import { Pagination } from '../../features/guides/components/pagination';
import { getTaxonomyFilters, parseGuideListParams } from '../../lib/list-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Guides - DevAtlas',
  description: 'Browse developer guides and tutorials',
};

type GuidesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams;
  const queryParams = parseGuideListParams(params);
  const [response, taxonomy] = await Promise.all([getGuides(queryParams), getTaxonomyFilters()]);

  return (
    <AppPageShell>
      <ContentPageSection
        title="Guides"
        description="In-depth tutorials and walkthroughs for developers."
      >
        <ListFilters
          basePath="/guides"
          currentParams={queryParams}
          groups={taxonomy.groups}
        />
        <GuidesList guides={response.data} />
        <Pagination meta={response.meta} basePath="/guides" currentParams={queryParams} />
      </ContentPageSection>
    </AppPageShell>
  );
}
