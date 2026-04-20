import fs from 'node:fs/promises';

import matter from 'gray-matter';

import type { ContentType, RawContent } from '../types/common';

/**
 * Loads and parses a single .mdx file, splitting frontmatter from body.
 */
export async function loadMdxFile(
  filePath: string,
  contentType: ContentType,
): Promise<RawContent> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    filePath,
    frontmatter: data,
    body: content.trim(),
    contentType,
  };
}

/**
 * Loads multiple .mdx files in parallel with concurrency control.
 */
export async function loadMdxFiles(
  files: Array<{ absolutePath: string; contentType: ContentType }>,
  concurrency = 10,
): Promise<RawContent[]> {
  const results: RawContent[] = [];

  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((f) => loadMdxFile(f.absolutePath, f.contentType)),
    );
    results.push(...batchResults);
  }

  return results;
}
