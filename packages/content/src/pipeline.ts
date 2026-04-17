export { buildContentIndex, type ContentIndex } from './pipeline/build-content-index';
import { buildRelationsFromGuide, buildRelationsFromTool, type ContentRelation } from './indexer/relation-builder';
import { buildGuideSearchDoc, buildToolSearchDoc, type SearchDocument } from './indexer/search-indexer';
import type {
  ContentError
} from './types/common';
import type { GuideRecord } from './types/guide';
import type { ToolRecord } from './types/tool';

import { mapGuideToRecord, mapToolToRecord } from './indexer';
import { scanContentFiles, type ScanOptions } from './loader/file-scanner';
import { loadMdxFiles } from './loader/mdx-loader';
import { validateGuideFrontmatter, validateToolFrontmatter } from './validator';

// ─────────────────────────────────────────────
// Pipeline output
// ─────────────────────────────────────────────

export interface PipelineOutput {
  guides: GuideRecord[];
  tools: ToolRecord[];
  relations: ContentRelation[];
  searchDocuments: SearchDocument[];
  errors: ContentError[];
  stats: {
    totalFiles: number;
    guidesProcessed: number;
    toolsProcessed: number;
    errorsCount: number;
  };
}

// ─────────────────────────────────────────────
// Main pipeline
// ─────────────────────────────────────────────

/**
 * Runs the full content processing pipeline:
 * scan → load → parse → validate → map → index
 */
export async function processContent(
  options: ScanOptions,
): Promise<PipelineOutput> {
  const errors: ContentError[] = [];
  const guides: GuideRecord[] = [];
  const tools: ToolRecord[] = [];
  const relations: ContentRelation[] = [];
  const searchDocuments: SearchDocument[] = [];

  // 1. Scan
  const scannedFiles = await scanContentFiles(options);

  // 2. Load
  const rawContents = await loadMdxFiles(scannedFiles);

  // 3. Validate & Map

  for (const raw of rawContents) {
    const { contentType, frontmatter, body, filePath } = raw;

    if (contentType === 'guide') {
      const validation = validateGuideFrontmatter(frontmatter, filePath);

      if (!validation.ok) {
        errors.push(...validation.errors);
        continue;
      }

      const record = mapGuideToRecord(validation.data, body);
      guides.push(record);

      relations.push(
        ...buildRelationsFromGuide(record.slug, validation.data),
      );

      searchDocuments.push(buildGuideSearchDoc(record));
    }

    if (contentType === 'tool') {
      const validation = validateToolFrontmatter(frontmatter, filePath);

      if (!validation.ok) {
        errors.push(...validation.errors);
        continue;
      }

      const record = mapToolToRecord(validation.data, body);
      tools.push(record);

      relations.push(
        ...buildRelationsFromTool(record.slug, validation.data),
      );

      searchDocuments.push(buildToolSearchDoc(record));
    }
  }

  return {
    guides,
    tools,
    relations,
    searchDocuments,
    errors,
    stats: {
      totalFiles: scannedFiles.length,
      guidesProcessed: guides.length,
      toolsProcessed: tools.length,
      errorsCount: errors.length,
    },
  };
}
