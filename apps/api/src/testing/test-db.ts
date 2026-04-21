import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../db/schema';

const connectionString = process.env['TEST_DATABASE_URL'] ?? process.env['DATABASE_URL'];

export const hasTestDatabaseConfig = Boolean(connectionString);

export type TestDatabase = ReturnType<typeof drizzle<typeof schema>>;

export function createTestDatabase() {
  if (!connectionString) {
    throw new Error('Set TEST_DATABASE_URL or DATABASE_URL to run database-backed tests.');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  return {
    db,
    pool,
    async reset() {
      await db.execute(sql`
        TRUNCATE TABLE
          "Guide",
          "Tool",
          "Category",
          "Tag",
          guide_tags,
          tool_tags,
          content_relations,
          search_documents,
          ai_summaries,
          ai_answers,
          search_queries,
          content_views
        RESTART IDENTITY CASCADE
      `);
    },
    async close() {
      await pool.end();
    },
  };
}
