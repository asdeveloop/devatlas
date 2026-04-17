import { z } from 'zod';
import { ToolStatus } from '../content/enums';
import { paginationSchema, slugSchema, sortOrderSchema, uuidArraySchema, uuidSchema } from './common';

// ── Create ───────────────────────────────────────────

export const createToolSchema = z.object({
  name: z.string().min(2).max(100),
  slug: slugSchema,
  description: z.string().min(10).max(1000),
  website: z.string().url('Invalid URL').nullable().optional(),
  github: z.string().url('Invalid URL').nullable().optional(),
  categoryId: uuidSchema,
  tagIds: uuidArraySchema.optional(),
  status: z.nativeEnum(ToolStatus).default(ToolStatus.ACTIVE),
});

export type CreateToolInput = z.infer<typeof createToolSchema>;

// ── Update ───────────────────────────────────────────

export const updateToolSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: slugSchema.optional(),
  description: z.string().min(10).max(1000).optional(),
  website: z.string().url().nullable().optional(),
  github: z.string().url().nullable().optional(),
  categoryId: uuidSchema.optional(),
  tagIds: uuidArraySchema.optional(),
  status: z.nativeEnum(ToolStatus).optional(),
});

export type UpdateToolInput = z.infer<typeof updateToolSchema>;

// ── Query ────────────────────────────────────────────

export const toolQuerySchema = paginationSchema.extend({
  categorySlug: z.string().optional(),
  tagSlug: z.string().optional(),
  status: z.nativeEnum(ToolStatus).optional(),
  search: z.string().max(200).optional(),
  sortBy: z.enum(['name', 'popularityScore', 'createdAt']).default('popularityScore'),
  sortOrder: sortOrderSchema,
});

export type ToolQueryInput = z.infer<typeof toolQuerySchema>;
