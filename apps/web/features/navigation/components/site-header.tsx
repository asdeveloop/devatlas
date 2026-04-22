'use client';

import { Container, Navbar } from '@devatlas/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navigationItems } from '../navigation-items';

function isActive(pathname: string, href: string, match: 'exact' | 'prefix'): boolean {
  if (match === 'exact') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Navbar>
      <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            DevAtlas Platform
          </p>
          <p className="text-sm font-medium text-foreground">Engineering foundation</p>
        </div>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-2 text-sm font-medium">
          {navigationItems.map((item) => {
            const active = isActive(pathname, item.href, item.match);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'rounded-full px-3 py-1.5 transition-colors',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </Navbar>
  );
}
