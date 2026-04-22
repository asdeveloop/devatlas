import type { Metadata } from 'next';

import { AppPageShell } from '../../components/layout/app-page-shell';
import { ContentPageSection } from '../../components/layout/content-page-section';
import { ListFilters } from '../../features/guides/components/list-filters';
import { Pagination } from '../../features/guides/components/pagination';
import { getTools } from '../../features/tools/api/get-tools';
import { ToolsList } from '../../features/tools/components/tools-list';
import { getTaxonomyFilters, parseToolListParams } from '../../lib/list-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tools - DevAtlas',
  description: 'Browse the DevAtlas developer tools catalog.',
};

type ToolsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams;
  const queryParams = parseToolListParams(params);
  const [response, taxonomy] = await Promise.all([getTools(queryParams), getTaxonomyFilters()]);

  return (
    <AppPageShell>
      <ContentPageSection
        title="Tools"
        description="Explore vetted developer tooling with category context and quick metadata."
      >
        <ListFilters
          basePath="/tools"
          currentParams={queryParams}
          groups={taxonomy.groups}
        />
        <ToolsList tools={response.data} />
        <Pagination meta={response.meta} basePath="/tools" currentParams={queryParams} />
      </ContentPageSection>
    </AppPageShell>
  );
}
