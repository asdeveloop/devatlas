import fs from 'node:fs';
import { resolve } from 'node:path';

type MigrationJournal = {
  entries?: Array<{
    tag: string;
    when: number;
  }>;
};

function requireDatabaseUrl(): string {
  const databaseUrl = process.env['DATABASE_URL'];

  if (!databaseUrl) {
    throw new Error('Set DATABASE_URL before running db:rollback:plan.');
  }

  return databaseUrl;
}

function loadJournal(): MigrationJournal {
  const journalPath = resolve(process.cwd(), 'drizzle/meta/_journal.json');

  if (!fs.existsSync(journalPath)) {
    throw new Error(`Migration journal not found at ${journalPath}.`);
  }

  return JSON.parse(fs.readFileSync(journalPath, 'utf8')) as MigrationJournal;
}

function main(): void {
  const databaseUrl = requireDatabaseUrl();
  const journal = loadJournal();
  const entries = journal.entries ?? [];
  const latestMigration = entries.at(-1);

  if (!latestMigration) {
    throw new Error('No applied migration metadata found in drizzle/meta/_journal.json.');
  }

  const migrationFile = resolve(process.cwd(), 'drizzle', `${latestMigration.tag}.sql`);
  const backupHint = process.env['ROLLBACK_BACKUP_HINT'] ?? 'Take a fresh logical or snapshot backup before applying a compensating migration.';

  console.log('DevAtlas DB rollback plan');
  console.log('========================');
  console.log(`Database: ${databaseUrl}`);
  console.log(`Latest migration tag: ${latestMigration.tag}`);
  console.log(`Migration file: ${migrationFile}`);
  console.log('');
  console.log('Canonical rollback workflow:');
  console.log(`1. ${backupHint}`);
  console.log('2. Inspect the latest migration SQL and identify the schema/data changes to revert.');
  console.log('3. Create a new compensating migration; never edit an already committed migration file.');
  console.log('4. Validate the resulting schema diff with `pnpm --filter @devatlas/api db:check`.');
  console.log('5. Apply the compensating migration with `pnpm --filter @devatlas/api db:migrate`.');
  console.log('6. If rollback touches content-derived tables, rerun `pnpm --filter @devatlas/api db:seed`.');
  console.log('7. Verify health/readiness after rollback before reopening traffic.');
}

try {
  main();
} catch (error: unknown) {
  console.error('Rollback planning failed:', error);
  process.exit(1);
}
