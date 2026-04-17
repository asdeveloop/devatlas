import { randomUUID } from 'node:crypto';
import type { Guide, ParsedContent, GuideFrontmatter } from '../types';

export function indexGuide(
  parsed: ParsedContent<GuideFrontmatter>,
  categoryId: string | null,
): Guide {
  const { frontmatter, body } = parsed;

  return {
    id: randomUUID(),
    slug: frontmatter.slug,
    title: frontmatter.title,
    description: frontmatter.summary,
    content: body,
    difficulty: frontmatter.difficulty ?? null,
    reading_time: frontmatter.reading_time ?? null,
    category_id: categoryId,
    created_at: new Date(),
    updated_at: new Date(),
  };
}
