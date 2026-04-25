// filepath: apps/api/src/db/migrate.ts
import { resolve } from 'node:path';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env['DATABASE_URL'];

  if (!databaseUrl) {
    throw new Error('Set DATABASE_URL before running db:migrate.');
  }

  return databaseUrl;
}

async function runMigrations(): Promise<void> {
  const pool = new Pool({
    connectionString: requireDatabaseUrl(),
  });

  const db = drizzle(pool);
  const migrationsFolder = resolve(process.cwd(), 'drizzle');

  console.log(`Running migrations from ${migrationsFolder}...`);
  await migrate(db, { migrationsFolder });
  console.log('Migrations complete.');

  await pool.end();
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
