import type { CategoryListParams } from '@devatlas/types';
import type { Metadata } from 'next';

import { PageShell } from '../../components/layout/page-shell';
import { Pagination } from '../guides/components/pagination';
import { SiteHeader } from '../navigation';

import { getCategories } from './api/get-categories';
import { CategoriesList } from './components/categories-list';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Categories - DevAtlas',
  description: 'Browse DevAtlas categories for guides and tools.',
};

type CategoriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const params = await searchParams;

  const queryParams: CategoryListParams = {
    page: params['page'] ? Number(params['page']) : 1,
    limit: params['limit'] ? Number(params['limit']) : 12,
  };

  const response = await getCategories(queryParams);

  return (
    <PageShell>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Content domains used to organize guides and tools across the platform.
          </p>
        </div>
        <CategoriesList categories={response.data} />
        <Pagination meta={response.meta} basePath="/categories" currentParams={queryParams} />
      </section>
    </PageShell>
  );
}
