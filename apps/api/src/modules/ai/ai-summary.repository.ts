import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';

import { aiSummaries, categories, guideTags, guides, tags, toolTags, tools } from '../../db/schema';
import { DrizzleService } from '../database/drizzle.service';

export type AiContentType = 'guide' | 'tool';

export type AiSummaryRecord = {
  id: string;
  contentType: AiContentType;
  contentId: string;
  summary: string;
  model: string;
  createdAt: Date;
};

export type AiSummarySource = {
  contentType: AiContentType;
  contentId: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  category: string;
  tags: string[];
  metadata: Record<string, string | boolean | null>;
};

@Injectable()
export class AiSummaryRepository {
  constructor(@Inject(DrizzleService) private readonly drizzle: DrizzleService) {}

  async findLatestByContent(contentType: AiContentType, contentId: string): Promise<AiSummaryRecord | null> {
    const [record] = await this.drizzle.db
      .select()
      .from(aiSummaries)
      .where(and(eq(aiSummaries.contentType, contentType), eq(aiSummaries.contentId, contentId)))
      .orderBy(sql`${aiSummaries.createdAt} desc`)
      .limit(1)
      .execute();

    return (record as AiSummaryRecord | undefined) ?? null;
  }

  async saveSummary(input: {
    contentType: AiContentType;
    contentId: string;
    summary: string;
    model: string;
  }): Promise<AiSummaryRecord> {
    const existing = await this.findLatestByContent(input.contentType, input.contentId);

    if (existing) {
      const [updated] = await this.drizzle.db
        .update(aiSummaries)
        .set({
          summary: input.summary,
          model: input.model,
          createdAt: new Date(),
        })
        .where(eq(aiSummaries.id, existing.id))
        .returning()
        .execute();

      return updated as AiSummaryRecord;
    }

    const [created] = await this.drizzle.db
      .insert(aiSummaries)
      .values(input)
      .returning()
      .execute();

    return created as AiSummaryRecord;
  }

  async findSourceBySlug(contentType: AiContentType, slug: string): Promise<AiSummarySource | null> {
    if (contentType === 'guide') {
      const [guide] = await this.drizzle.db
        .select({
          contentId: guides.id,
          slug: guides.slug,
          title: guides.title,
          description: guides.description,
          body: guides.content,
          category: categories.name,
          tags: sql<string[] | null>`array_remove(array_agg(distinct ${tags.name}), null)`,
          difficulty: guides.difficulty,
        })
        .from(guides)
        .innerJoin(categories, eq(guides.categoryId, categories.id))
        .leftJoin(guideTags, eq(guides.id, guideTags.guideId))
        .leftJoin(tags, eq(guideTags.tagId, tags.id))
        .where(and(eq(guides.slug, slug), eq(guides.status, 'PUBLISHED')))
        .groupBy(guides.id, categories.name)
        .execute();

      if (!guide) {
        return null;
      }

      return {
        contentType,
        contentId: guide.contentId,
        slug: guide.slug,
        title: guide.title,
        description: guide.description ?? '',
        body: guide.body ?? '',
        category: guide.category,
        tags: guide.tags ?? [],
        metadata: {
          difficulty: guide.difficulty,
        },
      };
    }

    const [tool] = await this.drizzle.db
      .select({
        contentId: tools.id,
        slug: tools.slug,
        title: tools.name,
        description: tools.description,
        body: sql<string>`concat_ws(' ', ${tools.description}, ${tools.website}, ${tools.github})`,
        category: categories.name,
        tags: sql<string[] | null>`array_remove(array_agg(distinct ${tags.name}), null)`,
        tier: tools.tier,
        price: tools.price,
        active: tools.active,
      })
      .from(tools)
      .innerJoin(categories, eq(tools.categoryId, categories.id))
      .leftJoin(toolTags, eq(tools.id, toolTags.toolId))
      .leftJoin(tags, eq(toolTags.tagId, tags.id))
      .where(and(eq(tools.slug, slug), eq(tools.active, true)))
      .groupBy(tools.id, categories.name)
      .execute();

    if (!tool) {
      return null;
    }

    return {
      contentType,
      contentId: tool.contentId,
      slug: tool.slug,
      title: tool.title,
      description: tool.description ?? '',
      body: tool.body,
      category: tool.category,
      tags: tool.tags ?? [],
      metadata: {
        tier: tool.tier,
        price: tool.price,
        active: tool.active,
      },
    };
  }

  async listSourcesMissingSummaries(): Promise<AiSummarySource[]> {
    const guideRows = await this.drizzle.db
      .select({ slug: guides.slug })
      .from(guides)
      .where(eq(guides.status, 'PUBLISHED'))
      .execute();

    const toolRows = await this.drizzle.db
      .select({ slug: tools.slug })
      .from(tools)
      .where(eq(tools.active, true))
      .execute();

    const sources = await Promise.all([
      ...guideRows.map((guide) => this.findSourceBySlug('guide', guide.slug)),
      ...toolRows.map((tool) => this.findSourceBySlug('tool', tool.slug)),
    ]);

    const enriched = await Promise.all(
      sources
        .filter((source): source is AiSummarySource => Boolean(source))
        .map(async (source) => ({
          source,
          existing: await this.findLatestByContent(source.contentType, source.contentId),
        })),
    );

    return enriched.filter((entry) => !entry.existing).map((entry) => entry.source);
  }
}
