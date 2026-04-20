// filepath: apps/api/src/db/schema/tool-tag.ts
import { relations } from 'drizzle-orm';
import { index, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tags } from './tag';
import { tools } from './tool';

export const toolTags = pgTable(
  'tool_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    toolId: uuid('tool_id')
      .notNull()
      .references(() => tools.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    uniqueToolTag: uniqueIndex('uq_tool_tags').on(t.toolId, t.tagId),
    toolIdx: index('idx_tool_tags_tool').on(t.toolId),
    tagIdx: index('idx_tool_tags_tag').on(t.tagId),
  }),
);

export const toolTagsRelations = relations(toolTags, ({ one }) => ({
  tool: one(tools, {
    fields: [toolTags.toolId],
    references: [tools.id],
  }),
  tag: one(tags, {
    fields: [toolTags.tagId],
    references: [tags.id],
  }),
}));
