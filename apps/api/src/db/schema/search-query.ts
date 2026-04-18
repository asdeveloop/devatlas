// filepath: apps/api/src/db/schema/search-query.ts
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const searchQueries = pgTable('search_queries', {
  id: uuid('id').primaryKey().defaultRandom(),
  query: text('query').notNull(),
  resultsCount: integer('results_count').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
