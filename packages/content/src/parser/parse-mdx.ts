import matter from 'gray-matter';
import { guideFrontmatterSchema } from '../schemas/guide.schema';
import { toolFrontmatterSchema } from '../schemas/tool.schema';
import type { ParsedContent, GuideFrontmatter, ToolFrontmatter, ContentKind } from '../types';

export class ContentParseError extends Error {
  constructor(
    public readonly filePath: string,
    public readonly issues: string[],
  ) {
    super(`Failed to parse ${filePath}: ${issues.join(', ')}`);
    this.name = 'ContentParseError';
  }
}

function detectKind(filePath: string): ContentKind {
  if (filePath.includes('/guides/')) return 'guide';
  if (filePath.includes('/tools/')) return 'tool';
  throw new ContentParseError(filePath, ['Cannot detect content kind from path']);
}

export function parseMdx(raw: string, filePath: string): ParsedContent {
  const { data, content } = matter(raw);
  const kind = detectKind(filePath);

  const schema = kind === 'guide' ? guideFrontmatterSchema : toolFrontmatterSchema;
  const result = schema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`,
    );
    throw new ContentParseError(filePath, issues);
  }

  return {
    kind,
    frontmatter: result.data as GuideFrontmatter | ToolFrontmatter,
    body: content.trim(),
    filePath,
  };
}
