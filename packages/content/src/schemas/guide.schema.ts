import { z } from 'zod';

export const guideFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  reading_time: z.number().int().nonnegative().optional(),
  author: z.string().optional(),
  published_at: z.string().datetime({ offset: true }).optional(),
  related_guides: z.array(z.string()).optional(),
  related_tools: z.array(z.string()).optional(),
  related_ai_resources: z.array(z.string()).optional(),
});

export type ValidatedGuideFrontmatter = z.infer<typeof guideFrontmatterSchema>;
