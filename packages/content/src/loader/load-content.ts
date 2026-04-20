import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

import { parseMdx } from '../parser';
import type { ParsedContent } from '../types';

async function walkDir(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await walkDir(fullPath)));
    } else if (['.mdx', '.md'].includes(extname(entry.name))) {
      paths.push(fullPath);
    }
  }

  return paths;
}

export interface LoadResult {
  parsed: ParsedContent[];
  errors: Array<{ filePath: string; error: Error }>;
}

export async function loadContent(contentDir: string): Promise<LoadResult> {
  const files = await walkDir(contentDir);
  const parsed: ParsedContent[] = [];
  const errors: LoadResult['errors'] = [];

  for (const filePath of files) {
    try {
      const raw = await readFile(filePath, 'utf-8');
      parsed.push(parseMdx(raw, filePath));
    } catch (error) {
      errors.push({ filePath, error: error as Error });
    }
  }

  return { parsed, errors };
}
