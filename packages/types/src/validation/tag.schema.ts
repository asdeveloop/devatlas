import { z } from 'zod';

import { slugSchema } from './common';

export const createTagSchema = z.object({
  slug: slugSchema,
  name: z.string().min(2).max(100),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const updateTagSchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().min(2).max(100).optional(),
});

export type UpdateTagInput = z.infer<typeof updateTagSchema>;

export const tagQuerySchema = z.object({
  search: z.string().max(200).optional(),
});

export type TagQueryInput = z.infer<typeof tagQuerySchema>
