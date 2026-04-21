import { Inject, Injectable } from '@nestjs/common';
import { and, asc, desc, eq, sql, type SQL } from 'drizzle-orm';

import { categories, guideTags, guides as guidesSchema, tags } from '../../db/schema';
import { DrizzleService } from '../database/drizzle.service';

import type { CreateGuideDto } from './dto/create-guide.dto';
import type { GuideQueryDto, GuideSortField } from './dto/guide-query.dto';
import type { UpdateGuideDto } from './dto/update-guide.dto';

export type GuideTag = {
  id: string;
  slug: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GuideCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GuideRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  readingTime: number | null;
  difficulty: string | null;
  status: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GuideWithRelations = GuideRecord & {
  tags: GuideTag[];
  category: GuideCategory | null;
};

type GuideQueryRow = GuideRecord & {
  tags: {
    id: string;
    tagId: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  category: GuideCategory | null;
};

export type GuidesListResult<TGuide = GuideRecord> = {
  data: TGuide[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

@Injectable()
export class GuidesRepository {
  constructor(@Inject(DrizzleService) private readonly drizzle: DrizzleService) {}

  async findAll(query: GuideQueryDto): Promise<GuidesListResult<GuideWithRelations>> {
    const offset = Number(query.skip ?? 0);
    const limit = Number(query.take ?? 20);

    const whereConditions = [
      query.difficulty ? eq(guidesSchema.difficulty, query.difficulty) : undefined,
      query.status ? eq(guidesSchema.status, query.status) : undefined,
      query.categoryId ? eq(guidesSchema.categoryId, query.categoryId) : undefined,
      query.categorySlug
        ? sql`${guidesSchema.categoryId} IN (SELECT id FROM ${categories} WHERE slug = ${query.categorySlug})`
        : undefined,
      query.tagSlug
        ? sql`${guidesSchema.id} IN (SELECT guide_id FROM ${guideTags} WHERE tag_id IN (SELECT id FROM ${tags} WHERE slug = ${query.tagSlug}))`
        : undefined,
    ].filter(Boolean);

    const where = whereConditions.length > 0
      ? and(...(whereConditions as Parameters<typeof and>))
      : undefined;

    const orderBy = this.buildOrderBy(query.sortBy, query.order);

    const [rows, total] = await Promise.all([
      this.drizzle.db
        .select({
          id: guidesSchema.id,
          slug: guidesSchema.slug,
          title: guidesSchema.title,
          description: guidesSchema.description,
          content: guidesSchema.content,
          readingTime: guidesSchema.readingTime,
          difficulty: guidesSchema.difficulty,
          status: guidesSchema.status,
          categoryId: guidesSchema.categoryId,
          createdAt: guidesSchema.createdAt,
          updatedAt: guidesSchema.updatedAt,
          tags: {
            id: guideTags.id,
            tagId: guideTags.tagId,
            name: tags.name,
            slug: tags.slug,
            createdAt: tags.createdAt,
            updatedAt: tags.updatedAt,
          },
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            icon: categories.icon,
            createdAt: categories.createdAt,
            updatedAt: categories.updatedAt,
          },
        })
        .from(guidesSchema)
        .leftJoin(categories, eq(guidesSchema.categoryId, categories.id))
        .leftJoin(guideTags, eq(guidesSchema.id, guideTags.guideId))
        .leftJoin(tags, eq(guideTags.tagId, tags.id))
        .where(where)
        .orderBy(...orderBy)
        .limit(limit)
        .offset(offset),
      this.drizzle.db
        .select({ count: sql<number>`count(*)` })
        .from(guidesSchema)
        .where(where)
        .execute()
        .then(([result]) => Number(result.count)),
    ]);

    return {
      data: this.groupGuides(rows as GuideQueryRow[]),
      meta: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNextPage: offset + limit < total,
        hasPrevPage: offset > 0,
      },
    };
  }

  async findBySlug(slug: string): Promise<GuideWithRelations | null> {
    const result = (await this.drizzle.db
      .select({
        id: guidesSchema.id,
        slug: guidesSchema.slug,
        title: guidesSchema.title,
        description: guidesSchema.description,
        content: guidesSchema.content,
        readingTime: guidesSchema.readingTime,
        difficulty: guidesSchema.difficulty,
        status: guidesSchema.status,
        categoryId: guidesSchema.categoryId,
        createdAt: guidesSchema.createdAt,
        updatedAt: guidesSchema.updatedAt,
        tags: {
          id: guideTags.id,
          tagId: guideTags.tagId,
          name: tags.name,
          slug: tags.slug,
          createdAt: tags.createdAt,
          updatedAt: tags.updatedAt,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          icon: categories.icon,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
        },
      })
      .from(guidesSchema)
      .leftJoin(guideTags, eq(guidesSchema.id, guideTags.guideId))
      .leftJoin(tags, eq(guideTags.tagId, tags.id))
      .leftJoin(categories, eq(guidesSchema.categoryId, categories.id))
      .where(eq(guidesSchema.slug, slug))
      .execute()) as GuideQueryRow[];

    const [guide] = this.groupGuides(result);
    return guide ?? null;
  }

  async findById(id: string): Promise<GuideRecord | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(guidesSchema)
      .where(eq(guidesSchema.id, id))
      .execute();
    return result ?? null;
  }

  async create(data: CreateGuideDto): Promise<GuideWithRelations | null> {
    const drizzle = this.drizzle.db;

    const [guide] = await drizzle
      .insert(guidesSchema)
      .values({
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        content: data.content ?? null,
        readingTime: data.readingTime ?? null,
        difficulty: data.difficulty ?? null,
        status: data.status ?? 'DRAFT',
        categoryId: data.categoryId,
      })
      .returning()
      .execute();

    if (data.tagIds?.length) {
      await drizzle
        .insert(guideTags)
        .values(
          data.tagIds.map((tagId) => ({
            guideId: guide.id,
            tagId,
          })),
        )
        .execute();
    }

    return this.findBySlug(guide.slug);
  }

  async update(id: string, data: UpdateGuideDto): Promise<GuideWithRelations | null> {
    const drizzle = this.drizzle.db;

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description ?? null;
    if (data.content !== undefined) updateData.content = data.content ?? null;
    if (data.readingTime !== undefined) updateData.readingTime = data.readingTime ?? null;
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    const [result] = await drizzle
      .update(guidesSchema)
      .set(updateData)
      .where(eq(guidesSchema.id, id))
      .returning()
      .execute();

    if (data.tagIds !== undefined) {
      await drizzle
        .delete(guideTags)
        .where(eq(guideTags.guideId, result.id))
        .execute();

      if (data.tagIds.length) {
        await drizzle
          .insert(guideTags)
          .values(
            data.tagIds.map((tagId) => ({
              guideId: result.id,
              tagId,
            })),
          )
          .execute();
      }
    }

    return this.findBySlug(data.slug ?? result.slug);
  }

  async delete(id: string): Promise<GuideRecord | null> {
    const [result] = await this.drizzle.db
      .delete(guidesSchema)
      .where(eq(guidesSchema.id, id))
      .returning()
      .execute();
    return result;
  }

  async count() {
    const result = await this.drizzle.db
      .select({ count: sql<number>`count(*)` })
      .from(guidesSchema)
      .execute();
    return Number(result[0]?.count ?? 0);
  }

  private buildOrderBy(sortBy?: GuideSortField, order: 'asc' | 'desc' = 'desc'): SQL[] {
    const sortColumn = {
      createdAt: guidesSchema.createdAt,
      readingTime: guidesSchema.readingTime,
      title: guidesSchema.title,
    }[sortBy ?? 'createdAt'];
    const direction = order === 'asc' ? asc : desc;

    return [direction(sortColumn), desc(guidesSchema.createdAt)];
  }

  private groupGuides(rows: GuideQueryRow[]): GuideWithRelations[] {
    const grouped = new Map<string, GuideWithRelations>();

    for (const row of rows) {
      const existing = grouped.get(row.id);
      if (existing) {
        if (row.tags && !existing.tags.some((tag) => tag.id === row.tags?.tagId)) {
          existing.tags.push({
            id: row.tags.tagId,
            name: row.tags.name,
            slug: row.tags.slug,
            createdAt: row.tags.createdAt,
            updatedAt: row.tags.updatedAt,
          });
        }
        continue;
      }

      grouped.set(row.id, {
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        content: row.content,
        readingTime: row.readingTime,
        difficulty: row.difficulty,
        status: row.status,
        categoryId: row.categoryId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        tags: row.tags
          ? [{
              id: row.tags.tagId,
              name: row.tags.name,
              slug: row.tags.slug,
              createdAt: row.tags.createdAt,
              updatedAt: row.tags.updatedAt,
            }]
          : [],
        category: row.category,
      });
    }

    return [...grouped.values()];
  }
}
