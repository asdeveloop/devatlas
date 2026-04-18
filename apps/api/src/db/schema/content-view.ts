// filepath: apps/api/src/db/schema/content-view.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const contentViews = pgTable('content_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  contentType: text('content_type').notNull(),
  contentId: uuid('content_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
