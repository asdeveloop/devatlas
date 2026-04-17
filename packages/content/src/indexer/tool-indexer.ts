import { randomUUID } from 'node:crypto';
import type { Tool, ParsedContent, ToolFrontmatter } from '../types';

export function indexTool(
  parsed: ParsedContent<ToolFrontmatter>,
  categoryId: string | null,
): Tool {
  const { frontmatter } = parsed;

  return {
    id: randomUUID(),
    slug: frontmatter.slug,
    name: frontmatter.name,
    description: frontmatter.description,
    website: frontmatter.website ?? null,
    github: null,
    category_id: categoryId,
    popularity_score: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };
}
