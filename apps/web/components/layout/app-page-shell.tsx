import type { ReactNode } from 'react';

import { SiteHeader } from '../../features/navigation';

import { PageShell } from './page-shell';

type AppPageShellProps = {
  children: ReactNode;
};

export function AppPageShell({ children }: AppPageShellProps): React.JSX.Element {
  return (
    <PageShell>
      <SiteHeader />
      {children}
    </PageShell>
  );
}
