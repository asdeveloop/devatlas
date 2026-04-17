import { PageShell } from '../components/layout/page-shell';
import { getGuides } from '../features/guides/api/get-guides';
import { PlatformOverview } from '../features/home';
import { SiteHeader } from '../features/navigation';
import { getTools } from '../features/tools/api/get-tools';

export const dynamic = 'force-dynamic';

export default async function HomePage(): Promise<React.JSX.Element> {
  const [guides, tools] = await Promise.all([getGuides({ limit: 6 }), getTools({ page: 1, pageSize: 6 })]);

  return (
    <PageShell>
      <SiteHeader />
      <PlatformOverview guideCount={guides.data.length} toolCount={tools.data.length} />
    </PageShell>
  );
}
