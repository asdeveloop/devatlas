// filepath: apps/api/src/db/schema/enums.ts
import { pgEnum } from 'drizzle-orm/pg-core';

export const difficultyEnum = pgEnum('Difficulty', [
  'beginner',
  'intermediate',
  'advanced',
]);

export const contentStatusEnum = pgEnum('ContentStatus', [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
]);

export const toolTierEnum = pgEnum('ToolTier', [
  'FREE',
  'FREEMIUM',
  'PRO',
  'ENTERPRISE',
]);

export const toolPriceEnum = pgEnum('ToolPrice', ['FREE', 'PAID', 'MIXED']);

export const toolStatusEnum = pgEnum('ToolStatus', [
  'ACTIVE',
  'DEPRECATED',
  'ARCHIVED',
]);

export const entityTypeEnum = pgEnum('EntityType', ['GUIDE', 'TOOL']);

export const relationTypeEnum = pgEnum('RelationType', [
  'RELATES_TO',
  'MENTIONS',
  'PREREQUISITE',
  'ALTERNATIVE',
]);
