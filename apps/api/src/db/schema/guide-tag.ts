// filepath: apps/api/src/db/schema/guide-tag.ts
import { relations } from 'drizzle-orm';
import { index, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { guides } from './guide';
import { tags } from './tag';

export const guideTags = pgTable(
  'guide_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guideId: uuid('guide_id')
      .notNull()
      .references(() => guides.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    uniqueGuideTag: uniqueIndex('uq_guide_tags').on(t.guideId, t.tagId),
    guideIdx: index('idx_guide_tags_guide').on(t.guideId),
    tagIdx: index('idx_guide_tags_tag').on(t.tagId),
  }),
);

export const guideTagsRelations = relations(guideTags, ({ one }) => ({
  guide: one(guides, {
    fields: [guideTags.guideId],
    references: [guides.id],
  }),
  tag: one(tags, {
    fields: [guideTags.tagId],
    references: [tags.id],
  }),
}));
