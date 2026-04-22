export type NavigationItem = {
  href: string;
  label: string;
  match: 'exact' | 'prefix';
};

export const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Overview', match: 'exact' },
  { href: '/guides', label: 'Guides', match: 'prefix' },
  { href: '/tools', label: 'Tools', match: 'prefix' },
  { href: '/categories', label: 'Categories', match: 'prefix' },
];
