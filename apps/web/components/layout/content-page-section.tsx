import type { ReactNode } from 'react';

type ContentPageSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function ContentPageSection({
  title,
  description,
  children,
}: ContentPageSectionProps): React.JSX.Element {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
      </div>
      {children}
    </section>
  );
}
