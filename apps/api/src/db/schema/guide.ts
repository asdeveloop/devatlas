// filepath: apps/api/src/db/schema/guide.ts
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { categories } from './category';
import { contentStatusEnum, difficultyEnum } from './enums';
import { guideTags } from './guide-tag';

export const guides = pgTable('Guide', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  readingTime: integer('readingTime'),
  difficulty: difficultyEnum('difficulty'),
  status: contentStatusEnum('status').notNull().default('DRAFT'),
  categoryId: uuid('categoryId').notNull().references(() => categories.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const guidesRelations = relations(guides, ({ one, many }) => ({
  category: one(categories, {
    fields: [guides.categoryId],
    references: [categories.id],
  }),
  tags: many(guideTags),
}));
