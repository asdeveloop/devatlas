import { EntityType, type RelationType } from '@devatlas/types';
import { Inject, Injectable } from '@nestjs/common';
import { and, eq, inArray, sql } from 'drizzle-orm';

import { categories, contentRelations, guideTags, guides, tags, toolTags, tools } from '../../db/schema';
import { DrizzleService } from '../database/drizzle.service';

export type RelatedContentRecord = {
  id: string;
  slug: string;
  contentType: 'guide' | 'tool';
  title: string;
  description: string;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  tags: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  relationType: RelationType;
  weight: number | null;
  url: string;
};

@Injectable()
export class ContentRelationsRepository {
  constructor(@Inject(DrizzleService) private readonly drizzle: DrizzleService) {}

  async createRelation(input: {
    sourceType: EntityType;
    sourceId: string;
    targetType: EntityType;
    targetId: string;
    relationType: RelationType;
    weight?: number;
  }) {
    const [relation] = await this.drizzle.db
      .insert(contentRelations)
      .values({
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        targetType: input.targetType,
        targetId: input.targetId,
        relationType: input.relationType,
        weight: input.weight ?? null,
      })
      .returning()
      .execute();

    return relation;
  }

  async findRelatedBySource(sourceType: EntityType, sourceId: string): Promise<RelatedContentRecord[]> {
    const relationRows = await this.drizzle.db
      .select({
        targetId: contentRelations.targetId,
        targetType: contentRelations.targetType,
        relationType: contentRelations.relationType,
        weight: contentRelations.weight,
      })
      .from(contentRelations)
      .where(and(eq(contentRelations.sourceType, sourceType), eq(contentRelations.sourceId, sourceId)))
      .orderBy(sql`${contentRelations.weight} desc nulls last`, contentRelations.createdAt)
      .execute();

    if (!relationRows.length) {
      return [];
    }

    const guideIds = relationRows.filter((row) => row.targetType === EntityType.GUIDE).map((row) => row.targetId);
    const toolIds = relationRows.filter((row) => row.targetType === EntityType.TOOL).map((row) => row.targetId);

    const [guideRows, toolRows] = await Promise.all([
      guideIds.length
        ? this.drizzle.db
            .select({
              id: guides.id,
              slug: guides.slug,
              title: guides.title,
              description: guides.description,
              categoryId: categories.id,
              categorySlug: categories.slug,
              categoryName: categories.name,
              tagId: tags.id,
              tagSlug: tags.slug,
              tagName: tags.name,
            })
            .from(guides)
            .innerJoin(categories, eq(guides.categoryId, categories.id))
            .leftJoin(guideTags, eq(guides.id, guideTags.guideId))
            .leftJoin(tags, eq(guideTags.tagId, tags.id))
            .where(inArray(guides.id, guideIds))
            .execute()
        : Promise.resolve([]),
      toolIds.length
        ? this.drizzle.db
            .select({
              id: tools.id,
              slug: tools.slug,
              title: tools.name,
              description: tools.description,
              categoryId: categories.id,
              categorySlug: categories.slug,
              categoryName: categories.name,
              tagId: tags.id,
              tagSlug: tags.slug,
              tagName: tags.name,
            })
            .from(tools)
            .innerJoin(categories, eq(tools.categoryId, categories.id))
            .leftJoin(toolTags, eq(tools.id, toolTags.toolId))
            .leftJoin(tags, eq(toolTags.tagId, tags.id))
            .where(inArray(tools.id, toolIds))
            .execute()
        : Promise.resolve([]),
    ]);

    const guideMap = this.groupRelatedRows(guideRows, 'guide');
    const toolMap = this.groupRelatedRows(toolRows, 'tool');

    return relationRows.flatMap((relation) => {
      const item = relation.targetType === EntityType.GUIDE
        ? guideMap.get(relation.targetId)
        : toolMap.get(relation.targetId);

      if (!item) {
        return [];
      }

      return [{
        ...item,
        relationType: relation.relationType as RelationType,
        weight: relation.weight,
      }];
    });
  }

  private groupRelatedRows(
    rows: Array<{
      id: string;
      slug: string;
      title: string;
      description: string | null;
      categoryId: string;
      categorySlug: string;
      categoryName: string;
      tagId: string | null;
      tagSlug: string | null;
      tagName: string | null;
    }>,
    contentType: 'guide' | 'tool',
  ) {
    const grouped = new Map<string, Omit<RelatedContentRecord, 'relationType' | 'weight'>>();

    for (const row of rows) {
      const existing = grouped.get(row.id);
      const tag = row.tagId && row.tagSlug && row.tagName
        ? { id: row.tagId, slug: row.tagSlug, name: row.tagName }
        : null;

      if (existing) {
        if (tag && !existing.tags.some((item) => item.id === tag.id)) {
          existing.tags.push(tag);
        }
        continue;
      }

      grouped.set(row.id, {
        id: row.id,
        slug: row.slug,
        contentType,
        title: row.title,
        description: row.description ?? '',
        category: {
          id: row.categoryId,
          slug: row.categorySlug,
          name: row.categoryName,
        },
        tags: tag ? [tag] : [],
        url: contentType === 'guide' ? `/guides/${row.slug}` : `/tools/${row.slug}`,
      });
    }

    return grouped;
  }
}
