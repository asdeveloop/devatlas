import { spawnSync } from 'node:child_process';

function run(command: string, args: string[], label: string): void {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? 'unknown'}.`);
  }
}

function main(): void {
  if (!process.env['CONTENT_DIR']) {
    throw new Error('Set CONTENT_DIR before running db:seed.');
  }

  run('pnpm', ['content:ingest'], 'content ingestion');

  if (process.env['SEARCH_REINDEX_AFTER_SEED'] === '1') {
    run('pnpm', ['search:reindex'], 'search reindex');
  }
}

try {
  main();
} catch (error: unknown) {
  console.error('Database seed failed:', error);
  process.exit(1);
}
