import { z } from 'zod';

import { ContentStatus, Difficulty } from '../content/enums';

import { paginationSchema, slugSchema, sortOrderSchema, uuidArraySchema, uuidSchema } from './common';

// ── Create ───────────────────────────────────────────

export const createGuideSchema = z.object({
  title: z.string().min(3).max(200),
  slug: slugSchema,
  description: z.string().min(10).max(500),
  content: z.string().min(1, 'Content cannot be empty'),
  difficulty: z.nativeEnum(Difficulty),
  readingTime: z.number().int().min(1).max(120),
  categoryId: uuidSchema,
  tagIds: uuidArraySchema.optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
});

export type CreateGuideInput = z.infer<typeof createGuideSchema>;

// ── Update ───────────────────────────────────────────

export const updateGuideSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: slugSchema.optional(),
  description: z.string().min(10).max(500).optional(),
  content: z.string().min(1).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  readingTime: z.number().int().min(1).max(120).optional(),
  categoryId: uuidSchema.optional(),
  tagIds: uuidArraySchema.optional(),
  status: z.nativeEnum(ContentStatus).optional(),
});

export type UpdateGuideInput = z.infer<typeof updateGuideSchema>;

// ── Query (List + Filter) ────────────────────────────

export const guideQuerySchema = paginationSchema.extend({
  categorySlug: z.string().optional(),
  tagSlug: z.string().optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  search: z.string().max(200).optional(),
  sortBy: z.enum(['createdAt', 'readingTime', 'title']).default('createdAt'),
  sortOrder: sortOrderSchema,
});

export type GuideQueryInput = z.infer<typeof guideQuerySchema>;
