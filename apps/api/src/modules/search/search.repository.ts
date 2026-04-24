import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

import { categories, guideTags, guides, searchDocuments, searchQueries, tags, toolTags, tools } from '../../db/schema';
import { DrizzleService } from '../database/drizzle.service';

export type SearchResultRecord = {
  id: string;
  contentType: string;
  title: string;
  description: string;
  category: string;
  url: string;
  tags: string[] | null;
  score: number;
};

@Injectable()
export class SearchRepository {
  constructor(@Inject(DrizzleService) private readonly drizzle: DrizzleService) {}

  async search(query: string, limit: number): Promise<SearchResultRecord[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    const vector = sql`setweight(to_tsvector('simple', coalesce(${searchDocuments.title}, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(${searchDocuments.description}, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(${searchDocuments.content}, '')), 'C') ||
      setweight(to_tsvector('simple', coalesce(array_to_string(${searchDocuments.tags}, ' '), '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(${searchDocuments.category}, '')), 'C')`;
    const querySql = sql`websearch_to_tsquery('simple', ${normalizedQuery})`;
    const score = sql<number>`ts_rank(${vector}, ${querySql})`;

    return this.drizzle.db
      .select({
        id: searchDocuments.id,
        contentType: searchDocuments.contentType,
        title: searchDocuments.title,
        description: searchDocuments.description,
        category: searchDocuments.category,
        url: searchDocuments.url,
        tags: searchDocuments.tags,
        score,
      })
      .from(searchDocuments)
      .where(sql`${searchDocuments.status} = 'PUBLISHED' and ${vector} @@ ${querySql}`)
      .orderBy(sql`${score} desc`, searchDocuments.title)
      .limit(limit)
      .execute();
  }

  async logQuery(query: string, resultsCount: number): Promise<void> {
    await this.drizzle.db.insert(searchQueries).values({
      query,
      resultsCount,
    }).execute();
  }

  async replaceIndexWithGuides(): Promise<number> {
    await this.drizzle.db.delete(searchDocuments).where(eq(searchDocuments.contentType, 'guide')).execute();

    const guideRows = await this.drizzle.db
      .select({
        id: guides.id,
        title: guides.title,
        description: guides.description,
        content: guides.content,
        status: guides.status,
        category: categories.slug,
        url: sql<string>`'/guides/' || ${guides.slug}`,
        tags: sql<string[] | null>`array_remove(array_agg(distinct ${tags.slug}), null)`,
      })
      .from(guides)
      .innerJoin(categories, eq(guides.categoryId, categories.id))
      .leftJoin(guideTags, eq(guides.id, guideTags.guideId))
      .leftJoin(tags, eq(guideTags.tagId, tags.id))
      .groupBy(guides.id, categories.slug)
      .execute();

    if (!guideRows.length) {
      return 0;
    }

    await this.drizzle.db.insert(searchDocuments).values(
      guideRows.map((guide) => ({
        id: guide.id,
        contentType: 'guide',
        title: guide.title,
        description: guide.description ?? '',
        content: guide.content ?? '',
        status: guide.status,
        tags: guide.tags ?? [],
        category: guide.category,
        url: guide.url,
      })),
    ).execute();

    return guideRows.length;
  }

  async replaceIndexWithTools(): Promise<number> {
    await this.drizzle.db.delete(searchDocuments).where(eq(searchDocuments.contentType, 'tool')).execute();

    const toolRows = await this.drizzle.db
      .select({
        id: tools.id,
        title: tools.name,
        description: tools.description,
        content: sql<string>`concat_ws(' ', ${tools.description}, ${tools.website}, ${tools.github})`,
        status: sql<string>`case when ${tools.active} then 'PUBLISHED' else 'ARCHIVED' end`,
        category: categories.slug,
        url: sql<string>`'/tools/' || ${tools.slug}`,
        tags: sql<string[] | null>`array_remove(array_agg(distinct ${tags.slug}), null)`,
      })
      .from(tools)
      .innerJoin(categories, eq(tools.categoryId, categories.id))
      .leftJoin(toolTags, eq(tools.id, toolTags.toolId))
      .leftJoin(tags, eq(toolTags.tagId, tags.id))
      .groupBy(tools.id, categories.slug)
      .execute();

    if (!toolRows.length) {
      return 0;
    }

    await this.drizzle.db.insert(searchDocuments).values(
      toolRows.map((tool) => ({
        id: tool.id,
        contentType: 'tool',
        title: tool.title,
        description: tool.description ?? '',
        content: tool.content,
        status: tool.status,
        tags: tool.tags ?? [],
        category: tool.category,
        url: tool.url,
      })),
    ).execute();

    return toolRows.length;
  }
}
