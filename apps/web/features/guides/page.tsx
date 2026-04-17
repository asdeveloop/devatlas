import type { GuideListParams } from '@devatlas/types';
import type { Metadata } from 'next';
import { PageShell } from '../../components/layout/page-shell';
import { getGuides } from '../../features/guides/api/get-guides';
import { GuidesList } from '../../features/guides/components/guides-list';
import { Pagination } from '../../features/guides/components/pagination';
import { SiteHeader } from '../../features/navigation';

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

  const queryParams: GuideListParams = {
    page: params['page'] ? Number(params['page']) : 1,
    limit: params['limit'] ? Number(params['limit']) : 12,
    categorySlug: typeof params['categorySlug'] === 'string' ? params['categorySlug'] : undefined,
    difficulty:
      typeof params['difficulty'] === 'string'
        ? (params['difficulty'] as GuideListParams['difficulty'])
        : undefined,
    search: typeof params['search'] === 'string' ? params['search'] : undefined,
    sortBy:
      typeof params['sortBy'] === 'string'
        ? (params['sortBy'] as GuideListParams['sortBy'])
        : 'createdAt',
    sortOrder:
      typeof params['sortOrder'] === 'string'
        ? (params['sortOrder'] as GuideListParams['sortOrder'])
        : 'desc',
  };

  const response = await getGuides(queryParams);

  return (
    <PageShell>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Guides</h1>
          <p className="text-neutral-600 dark:text-neutral-400">In-depth tutorials and walkthroughs for developers.</p>
        </div>
        <GuidesList guides={response.data} />
        <Pagination meta={response.meta} basePath="/guides" currentParams={queryParams} />
      </section>
    </PageShell>
  );
}
