// filepath: apps/api/src/db/schema/tag.ts
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { guideTags } from './guide-tag';
import { toolTags } from './tool-tag';

export const tags = pgTable('Tag', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  guideTags: many(guideTags),
  toolTags: many(toolTags),
}));
