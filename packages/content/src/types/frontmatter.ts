export interface GuideFrontmatter {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  reading_time?: number;
  author?: string;
  published_at?: string;
  related_guides?: string[];
  related_tools?: string[];
  related_ai_resources?: string[];
}

export interface ToolFrontmatter {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  website?: string;
  related_guides?: string[];
  related_tools?: string[];
}

export type ContentKind = 'guide' | 'tool';

export interface ParsedContent<T = GuideFrontmatter | ToolFrontmatter> {
  kind: ContentKind;
  frontmatter: T;
  body: string;
  filePath: string;
}
