// filepath: apps/api/src/db/schema/content-relation.ts
import {
  doublePrecision,
  index,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { entityTypeEnum, relationTypeEnum } from './enums';

export const contentRelations = pgTable(
  'content_relations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sourceType: entityTypeEnum('source_type').notNull(),
    sourceId: uuid('source_id').notNull(),
    targetType: entityTypeEnum('target_type').notNull(),
    targetId: uuid('target_id').notNull(),
    relationType: relationTypeEnum('relation_type').notNull(),
    weight: doublePrecision('weight'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sourceIdx: index('idx_content_relations_source').on(t.sourceId),
    targetIdx: index('idx_content_relations_target').on(t.targetId),
  }),
);
