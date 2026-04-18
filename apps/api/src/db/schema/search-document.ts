// filepath: apps/api/src/db/schema/search-document.ts
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const searchDocuments = pgTable('search_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  contentType: text('content_type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull().default('DRAFT'),
  tags: text('tags').array(),
  category: text('category').notNull(),
  url: text('url').notNull(),
});
