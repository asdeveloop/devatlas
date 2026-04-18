// filepath: apps/api/src/db/schema/ai-answer.ts
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const aiAnswers = pgTable('ai_answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sources: jsonb('sources').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
