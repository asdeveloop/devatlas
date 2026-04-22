import type { AiSummary } from '@devatlas/types';

interface AiSummaryCardProps {
  summary: AiSummary;
}

export function AiSummaryCard({ summary }: AiSummaryCardProps) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            AI Summary
          </p>
          <h2 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Quick context for {summary.title}</h2>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-emerald-800 dark:bg-neutral-900/60 dark:text-emerald-200">
          {summary.model}
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-neutral-700 dark:text-neutral-300">{summary.summary}</p>
    </section>
  );
}
