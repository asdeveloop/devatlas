import Link from 'next/link';

import { buildSearchUrl } from '../../../lib/search-params';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

interface ListFiltersProps {
  basePath: string;
  groups: FilterGroup[];
  currentParams: object;
}

function buildFilterHref(
  basePath: string,
  currentParams: object,
  key: string,
  value?: string,
) {
  const nextParams: Record<string, string | number | undefined> = {
    ...(currentParams as Record<string, string | number | undefined>),
    page: 1,
  };

  if (value) {
    nextParams[key] = value;
  } else {
    delete nextParams[key];
  }

  return buildSearchUrl(basePath, nextParams);
}

export function ListFilters({ basePath, groups, currentParams }: ListFiltersProps) {
  const currentParamsRecord = currentParams as Record<string, string | number | undefined>;

  return (
    <div className="mb-8 space-y-5 rounded-2xl border border-neutral-200 bg-white/70 p-5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/40">
      {groups.map((group) => {
        const selectedValue =
          typeof currentParamsRecord[group.key] === 'string' ? String(currentParamsRecord[group.key]) : undefined;

        return (
          <section key={group.key} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">{group.label}</h2>
              {selectedValue ? (
                <Link href={buildFilterHref(basePath, currentParamsRecord, group.key)} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
                  Clear
                </Link>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const isActive = selectedValue === option.value;

                return (
                  <Link
                    key={option.value}
                    href={buildFilterHref(basePath, currentParamsRecord, group.key, option.value)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100'
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
