import type { PrismaClient } from "@prisma/client";
import { indexGuide } from "../indexer/guide-indexer.js";
import { indexRelations } from "../indexer/relation-indexer.js";
import { indexSearchDocument } from "../indexer/search-indexer.js";
import { indexTool } from "../indexer/tool-indexer.js";
import { loadMdxFiles } from "../loader/index.js";
import { parseMdx } from "../parser/index.js";
import type { GuideFrontmatterInput } from "../schemas/guide.schema.js";
import { guideFrontmatterSchema, toolFrontmatterSchema } from "../schemas/index.js";
import type { ToolFrontmatterInput } from "../schemas/tool.schema.js";

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

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function runContentPipeline(
  prisma: PrismaClient,
  options: PipelineOptions,
): Promise<PipelineResult> {
  const { guidesDir, toolsDir, baseUrl = "" } = options;
  const result: PipelineResult = { guidesIndexed: 0, toolsIndexed: 0, errors: [] };

  // ── Index Guides ──
  const guideFiles = await loadMdxFiles(guidesDir);

  for (const [file, raw] of guideFiles) {
    try {
      const { frontmatter, body } = parseMdx(raw, guideFrontmatterSchema);
      const fm = frontmatter as GuideFrontmatterInput;
      const readingTime = estimateReadingTime(body);

      await indexGuide(prisma, { frontmatter: fm, body, readingTime });

      await indexSearchDocument(prisma, {
        contentType: "guide",
        title: fm.title,
        description: fm.summary,
        content: body,
        tags: fm.tags,
        category: fm.category,
        url: `${baseUrl}/guides/${fm.slug}`,
      });

      // Index relations
      if (fm.related_guides?.length) {
        await indexRelations(prisma, {
          sourceType: "guide",
          sourceSlug: fm.slug,
          targetType: "guide",
          targetSlugs: fm.related_guides,
          relationType: "related",
        });
      }
      if (fm.related_tools?.length) {
        await indexRelations(prisma, {
          sourceType: "guide",
          sourceSlug: fm.slug,
          targetType: "tool",
          targetSlugs: fm.related_tools,
          relationType: "uses",
        });
      }

      result.guidesIndexed++;
    } catch (err) {
      result.errors.push({ file, error: String(err) });
    }
  }

  // ── Index Tools ──
  const toolFiles = await loadMdxFiles(toolsDir);

  for (const [file, raw] of toolFiles) {
    try {
      const { frontmatter, body } = parseMdx(raw, toolFrontmatterSchema);
      const fm = frontmatter as ToolFrontmatterInput;

      await indexTool(prisma, { frontmatter: fm, body });

      await indexSearchDocument(prisma, {
        contentType: "tool",
        title: fm.name,
        description: fm.description,
        content: body,
        tags: fm.tags,
        category: fm.category,
        url: `${baseUrl}/tools/${fm.slug}`,
      });

      if (fm.related_guides?.length) {
        await indexRelations(prisma, {
          sourceType: "tool",
          sourceSlug: fm.slug,
          targetType: "guide",
          targetSlugs: fm.related_guides,
          relationType: "related",
        });
      }
      if (fm.related_tools?.length) {
        await indexRelations(prisma, {
          sourceType: "tool",
          sourceSlug: fm.slug,
          targetType: "tool",
          targetSlugs: fm.related_tools,
          relationType: "related",
        });
      }

      result.toolsIndexed++;
    } catch (err) {
      result.errors.push({ file, error: String(err) });
    }
  }

  return result;
}
