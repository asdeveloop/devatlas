import { AppPageShell } from '../components/layout/app-page-shell';
import { getGuides } from '../features/guides/api/get-guides';
import { PlatformOverview } from '../features/home/components/platform-overview';
import { getTools } from '../features/tools/api/get-tools';

export const dynamic = 'force-dynamic';

export default async function HomePage(): Promise<React.JSX.Element> {
  const [guides, tools] = await Promise.all([getGuides({ limit: 6 }), getTools({ page: 1, limit: 6 })]);

  return (
    <AppPageShell>
      <PlatformOverview guideCount={guides.data.length} toolCount={tools.data.length} />
    </AppPageShell>
  );
}
