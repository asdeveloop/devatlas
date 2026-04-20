// filepath: apps/api/src/db/schema/tool.ts
import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { categories } from './category';
import { toolPriceEnum, toolTierEnum } from './enums';
import { toolTags } from './tool-tag';

export const tools = pgTable('Tool', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  website: text('website'),
  github: text('github'),
  icon: text('icon'),
  active: boolean('active').notNull().default(true),
  tier: toolTierEnum('tier').notNull(),
  price: toolPriceEnum('price').notNull(),
  popularity: integer('popularity').notNull().default(0),
  categoryId: uuid('categoryId')
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const toolsRelations = relations(tools, ({ one, many }) => ({
  category: one(categories, {
    fields: [tools.categoryId],
    references: [categories.id],
  }),
  tags: many(toolTags),
}));
