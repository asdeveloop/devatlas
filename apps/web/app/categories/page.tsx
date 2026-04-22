import type { Metadata } from 'next';

import { AppPageShell } from '../../components/layout/app-page-shell';
import { ContentPageSection } from '../../components/layout/content-page-section';
import { getCategories } from '../../features/categories/api/get-categories';
import { CategoriesList } from '../../features/categories/components/categories-list';
import { Pagination } from '../../features/guides/components/pagination';
import { parseCategoryListParams } from '../../lib/list-page';

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
  const queryParams = parseCategoryListParams(params);
  const response = await getCategories(queryParams);

  return (
    <AppPageShell>
      <ContentPageSection
        title="Categories"
        description="Content domains used to organize guides and tools across the platform."
      >
        <CategoriesList categories={response.data} />
        <Pagination meta={response.meta} basePath="/categories" currentParams={queryParams} />
      </ContentPageSection>
    </AppPageShell>
  );
}
