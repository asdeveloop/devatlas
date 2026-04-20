import { readdir } from 'node:fs/promises';
import path from 'node:path';

import type { ContentType } from '../types/common';

export interface ScanOptions {
  contentDir: string;
  pattern?: string;
}

export interface ScannedFile {
  absolutePath: string;
  relativePath: string;
  contentType: ContentType;
}

async function collectMdxFiles(dir: string, rootDir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(absolutePath, rootDir)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(path.relative(rootDir, absolutePath));
    }
  }

  return files;
}

export async function scanContentFiles(options: ScanOptions): Promise<ScannedFile[]> {
  const resolvedDir = path.resolve(options.contentDir);
  const files = await collectMdxFiles(resolvedDir, resolvedDir);

  return files.sort().map((relativePath) => ({
    absolutePath: path.join(resolvedDir, relativePath),
    relativePath,
    contentType: inferContentType(relativePath),
  }));
}

export function inferContentType(filePath: string): ContentType {
  const normalized = filePath.replace(/\\/g, '/');

  if (normalized.startsWith('guides/') || normalized.includes('/guides/')) {
    return 'guide';
  }

  if (normalized.startsWith('tools/') || normalized.includes('/tools/')) {
    return 'tool';
  }

  throw new Error(
    `Cannot infer content type from path: "${filePath}". Expected path to contain "guides/" or "tools/".`,
  );
}
