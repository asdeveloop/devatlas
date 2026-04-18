// filepath: apps/api/src/db/schema/category.ts
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { guides } from './guide';
import { tools } from './tool';

export const categories = pgTable('Category', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  guides: many(guides),
  tools: many(tools),
}));
