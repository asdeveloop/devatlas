import { z } from 'zod';

import { slugSchema } from './common';

export const createCategorySchema = z.object({
  slug: slugSchema,
  name: z.string().min(2).max(100),
  description: z.string().max(500).nullable().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryQuerySchema = z.object({
  search: z.string().max(200).optional(),
});

export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
