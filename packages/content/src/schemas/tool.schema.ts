import { z } from 'zod';

export const toolFrontmatterSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  website: z.string().url().optional(),
  related_guides: z.array(z.string()).optional(),
  related_tools: z.array(z.string()).optional(),
});

export type ValidatedToolFrontmatter = z.infer<typeof toolFrontmatterSchema>;
