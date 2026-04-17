import { z } from 'zod';

// ─────────────────────────────────────────────
// Guide frontmatter schema
// ─────────────────────────────────────────────

export const guideFrontmatterSchema = z.object({
  slug: z
    .string()
    .min(1, 'slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case'),
  title: z.string().min(1, 'title is required').max(200),
  description: z.string().min(1, 'description is required').max(500),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  reading_time: z.number().int().positive('reading_time must be positive'),
  category: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'category must be kebab-case'),
  tags: z.array(z.string().min(1)).min(1, 'at least one tag is required'),
  related_guides: z.array(z.string()).optional().default([]),
  related_tools: z.array(z.string()).optional().default([]),
});

// ─────────────────────────────────────────────
// Tool frontmatter schema
// ─────────────────────────────────────────────

export const toolFrontmatterSchema = z.object({
  slug: z
    .string()
    .min(1, 'slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case'),
  name: z.string().min(1, 'name is required').max(200),
  description: z.string().min(1, 'description is required').max(500),
  category: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'category must be kebab-case'),
  tags: z.array(z.string().min(1)).min(1, 'at least one tag is required'),
  website: z.string().url('website must be a valid URL').optional(),
  github: z.string().url('github must be a valid URL').optional(),
  related_guides: z.array(z.string()).optional().default([]),
  related_tools: z.array(z.string()).optional().default([]),
});

// ─────────────────────────────────────────────
// Inferred types (canonical source of truth)
// ─────────────────────────────────────────────

export type GuideFrontmatterInput = z.input<typeof guideFrontmatterSchema>;
export type GuideFrontmatterOutput = z.output<typeof guideFrontmatterSchema>;

export type ToolFrontmatterInput = z.input<typeof toolFrontmatterSchema>;
export type ToolFrontmatterOutput = z.output<typeof toolFrontmatterSchema>;
