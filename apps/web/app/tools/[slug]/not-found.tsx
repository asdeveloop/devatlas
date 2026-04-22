import { AppPageShell } from '../../../components/layout/app-page-shell';

export default function ToolNotFound() {
  return (
    <AppPageShell>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Tool not found</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          The requested tool does not exist or is no longer available.
        </p>
      </div>
    </AppPageShell>
  );
}
