import { indexRelations } from '../indexer/relation-indexer.js';
import { loadMdxFiles } from '../loader/index.js';
import { parseMdx } from '../parser/index.js';
import { guideFrontmatterSchema, toolFrontmatterSchema } from '../schemas/index.js';
import type { RelationType } from '../types/index.js';

export interface ContentPipelineDb {
  guides: {
    findBySlug(slug: string): Promise<{ id: string; slug: string } | null>;
  };
  tools: {
    findBySlug(slug: string): Promise<{ id: string; slug: string } | null>;
  };
  relations: {
    exists(input: {
      sourceType: string;
      sourceId: string;
      targetType: string;
      targetId: string;
      relationType: RelationType;
    }): Promise<boolean>;
    create(input: {
      sourceType: string;
      sourceId: string;
      targetType: string;
      targetId: string;
      relationType: RelationType;
    }): Promise<void>;
  };
}

export interface PipelineOptions {
  guidesDir: string;
  toolsDir: string;
  baseUrl?: string;
}

export interface PipelineResult {
  guidesIndexed: number;
  toolsIndexed: number;
  errors: Array<{ file: string; error: string }>;
}

export async function runContentPipeline(
  db: ContentPipelineDb,
  options: PipelineOptions,
): Promise<PipelineResult> {
  const result: PipelineResult = { guidesIndexed: 0, toolsIndexed: 0, errors: [] };

  const guideFiles = await loadMdxFiles(options.guidesDir);
  for (const [file, raw] of guideFiles) {
    try {
      const { frontmatter } = parseMdx(raw, guideFrontmatterSchema);
      if (frontmatter.related_guides?.length) {
        await indexRelations(db, {
          sourceType: 'guide',
          sourceSlug: frontmatter.slug,
          targetType: 'guide',
          targetSlugs: frontmatter.related_guides,
          relationType: 'related',
        });
      }
      if (frontmatter.related_tools?.length) {
        await indexRelations(db, {
          sourceType: 'guide',
          sourceSlug: frontmatter.slug,
          targetType: 'tool',
          targetSlugs: frontmatter.related_tools,
          relationType: 'uses',
        });
      }
      result.guidesIndexed++;
    } catch (err) {
      result.errors.push({ file, error: String(err) });
    }
  }

  const toolFiles = await loadMdxFiles(options.toolsDir);
  for (const [file, raw] of toolFiles) {
    try {
      const { frontmatter } = parseMdx(raw, toolFrontmatterSchema);
      if (frontmatter.related_guides?.length) {
        await indexRelations(db, {
          sourceType: 'tool',
          sourceSlug: frontmatter.slug,
          targetType: 'guide',
          targetSlugs: frontmatter.related_guides,
          relationType: 'related',
        });
      }
      if (frontmatter.related_tools?.length) {
        await indexRelations(db, {
          sourceType: 'tool',
          sourceSlug: frontmatter.slug,
          targetType: 'tool',
          targetSlugs: frontmatter.related_tools,
          relationType: 'related',
        });
      }
      result.toolsIndexed++;
    } catch (err) {
      result.errors.push({ file, error: String(err) });
    }
  }

  return result;
}
