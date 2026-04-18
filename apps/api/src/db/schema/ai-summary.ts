// filepath: apps/api/src/db/schema/ai-summary.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const aiSummaries = pgTable('ai_summaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  contentType: text('content_type').notNull(),
  contentId: uuid('content_id').notNull(),
  summary: text('summary').notNull(),
  model: text('model').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
