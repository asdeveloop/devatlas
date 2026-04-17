// ─────────────────────────────────────────────
// Shared types for the content engine
// ─────────────────────────────────────────────

export type ContentType = 'guide' | 'tool';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type RelationType = 'related' | 'prerequisite' | 'next' | 'uses';

export interface RawContent {
  /** Absolute path to the .mdx file */
  filePath: string;
  /** Parsed frontmatter key-value pairs */
  frontmatter: Record<string, unknown>;
  /** MDX body (without frontmatter) */
  body: string;
  /** Inferred content type based on file path */
  contentType: ContentType;
}

export interface ProcessedContent<TFrontmatter> {
  /** Validated and typed frontmatter */
  frontmatter: TFrontmatter;
  /** Raw MDX body */
  body: string;
  /** Inferred content type */
  contentType: ContentType;
  /** Source file path */
  filePath: string;
}

export interface ContentError {
  filePath: string;
  message: string;
  field?: string;
}

export interface ProcessingResult<T> {
  success: T[];
  errors: ContentError[];
}
