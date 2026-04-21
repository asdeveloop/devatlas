import type { ToolListParams } from '@devatlas/types';
import type { Metadata } from 'next';

import { PageShell } from '../../components/layout/page-shell';
import { getCategories } from '../categories/api/get-categories';
import { ListFilters } from '../guides/components/list-filters';
import { Pagination } from '../guides/components/pagination';
import { SiteHeader } from '../navigation';
import { getTags } from '../tags/api/get-tags';

import { getTools } from './api/get-tools';
import { ToolsList } from './components/tools-list';

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

  const queryParams: ToolListParams = {
    page: params['page'] ? Number(params['page']) : 1,
    limit: params['limit'] ? Number(params['limit']) : 12,
    categorySlug: typeof params['categorySlug'] === 'string' ? params['categorySlug'] : undefined,
    tagSlug: typeof params['tagSlug'] === 'string' ? params['tagSlug'] : undefined,
    tier: typeof params['tier'] === 'string' ? (params['tier'] as ToolListParams['tier']) : undefined,
    price: typeof params['price'] === 'string' ? (params['price'] as ToolListParams['price']) : undefined,
  };

  const [response, categories, tags] = await Promise.all([
    getTools(queryParams),
    getCategories({ page: 1, limit: 50 }),
    getTags({ page: 1, limit: 50 }),
  ]);

  return (
    <PageShell>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Tools</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Explore vetted developer tooling with category context and quick metadata.
          </p>
        </div>
        <ListFilters
          basePath="/tools"
          currentParams={queryParams}
          groups={[
            {
              key: 'categorySlug',
              label: 'Category',
              options: categories.data.map((category) => ({
                label: category.name,
                value: category.slug,
              })),
            },
            {
              key: 'tagSlug',
              label: 'Tag',
              options: tags.data.map((tag) => ({
                label: tag.name,
                value: tag.slug,
              })),
            },
          ]}
        />
        <ToolsList tools={response.data} />
        <Pagination meta={response.meta} basePath="/tools" currentParams={queryParams} />
      </section>
    </PageShell>
  );
}
