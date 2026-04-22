import Link from 'next/link';

import { AppPageShell } from '../../../components/layout/app-page-shell';

export default function GuideNotFound() {
  return (
    <AppPageShell>
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          The guide you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/guides"
          className="mt-2 rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          Browse all guides
        </Link>
      </section>
    </AppPageShell>
  );
}
