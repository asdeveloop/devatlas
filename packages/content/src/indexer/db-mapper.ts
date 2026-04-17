import type { GuideFrontmatter, GuideRecord } from '../types/guide';
import type { ToolFrontmatter, ToolRecord } from '../types/tool';

/**
 * Maps validated guide frontmatter + body → a flat record for DB insertion.
 */
export function mapGuideToRecord(
  frontmatter: GuideFrontmatter,
  body: string,
): GuideRecord {
  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    content: body,
    difficulty: frontmatter.difficulty,
    readingTime: frontmatter.reading_time,
    categorySlug: frontmatter.category,
    tags: frontmatter.tags,
  };
}

/**
 * Maps validated tool frontmatter + body → a flat record for DB insertion.
 */
export function mapToolToRecord(
  frontmatter: ToolFrontmatter,
  body: string,
): ToolRecord {
  return {
    slug: frontmatter.slug,
    name: frontmatter.name,
    description: frontmatter.description,
    content: body,
    categorySlug: frontmatter.category,
    tags: frontmatter.tags,
    website: frontmatter.website ?? null,
    github: frontmatter.github ?? null,
  };
}
