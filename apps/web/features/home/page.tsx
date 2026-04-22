import { PageShell } from '../../components/layout/page-shell';
import { getGuides } from '../guides/api/get-guides';
import { SiteHeader } from '../navigation';
import { getTools } from '../tools/api/get-tools';

import { PlatformOverview } from './components/platform-overview';

export const dynamic = 'force-dynamic';

export default async function HomePage(): Promise<React.JSX.Element> {
  const [guides, tools] = await Promise.all([getGuides({ limit: 6 }), getTools({ page: 1, limit: 6 })]);

  return (
    <PageShell>
      <SiteHeader />
      <PlatformOverview guideCount={guides.data.length} toolCount={tools.data.length} />
    </PageShell>
  );
}
