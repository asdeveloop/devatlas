import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { categories, guideTags, guides as guidesSchema, tags } from '../../db/schema';
import type { DrizzleService } from '../database/drizzle.service';

import type { CreateGuideDto } from './dto/create-guide.dto';
import type { GuideQueryDto } from './dto/guide-query.dto';
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
    guideId: string;
    tagId: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  category: GuideCategory | null;
};

export type GuidesListResult = {
  data: GuideRecord[];
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
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(query: GuideQueryDto): Promise<GuidesListResult> {
    const offset = (query.skip ?? 0);
    const limit = query.take ?? 20;

    const whereConditions = [
      query.difficulty ? eq(guidesSchema.difficulty, query.difficulty) : undefined,
      query.status ? eq(guidesSchema.status, query.status) : undefined,
      query.categoryId ? eq(guidesSchema.categoryId, query.categoryId) : undefined,
    ].filter(Boolean);

    const where = whereConditions.length > 0
      ? and(...(whereConditions as Parameters<typeof and>))
      : undefined;

    const [items, total] = await Promise.all([
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
        })
        .from(guidesSchema)
        .where(where)
        .limit(limit)
        .offset(offset),
      this.drizzle.db
        .select({ count: guidesSchema.id })
        .from(guidesSchema)
        .where(where)
        .execute()
        .then(([result]) => Number(result.count)),
    ]);

    return {
      data: items,
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
          guideId: guideTags.guideId,
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
          description: categories.icon,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
        },
      })
      .from(guidesSchema)
      .leftJoin(guideTags, eq(guidesSchema.id, guideTags.guideId))
      .leftJoin(tags, eq(guideTags.tagId, tags.id))
      .leftJoin(categories, eq(guidesSchema.categoryId, categories.id))
      .where(eq(guidesSchema.slug, slug))
      .execute()) as unknown as GuideQueryRow[];

    // Group by guide
    type GroupedGuide = Omit<GuideQueryRow, 'tags' | 'category'> & {
      tags: GuideTag[];
      category: GuideCategory | null;
    };

    const grouped = new Map<string, GroupedGuide>();

    for (const item of result) {
      const existing = grouped.get(item.id);
      if (existing) {
        if (item.tags) {
          existing.tags.push({
            id: item.tags.tagId,
            name: item.tags.name,
            slug: item.tags.slug,
            createdAt: item.tags.createdAt,
            updatedAt: item.tags.updatedAt,
          });
        }
        continue;
      }

      grouped.set(item.id, {
        ...item,
        tags: item.tags
          ? [{
              id: item.tags.tagId,
              name: item.tags.name,
              slug: item.tags.slug,
              createdAt: item.tags.createdAt,
              updatedAt: item.tags.updatedAt,
            }]
          : [],
        category: item.category || null,
      });
    }

    const firstGuide = grouped.values().next().value as GroupedGuide | undefined;
    return firstGuide ?? null;
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

    // Insert guide
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

    // Insert tags if provided
    if (data.tagIds?.length) {
      await drizzle
        .insert(guideTags)
        .values(
          data.tagIds.map((tagId) => ({
            guideId: guide.id,
            tagId,
          }))
        )
        .execute();
    }

    // Fetch guide with tags and category
    return await this.findBySlug(guide.slug);
  }

  async update(id: string, data: UpdateGuideDto): Promise<GuideWithRelations | null> {
    const drizzle = this.drizzle.db;

    // Update guide
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

    // Handle tags replacement
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
            }))
          )
          .execute();
      }
    }

    return await this.findBySlug(data.slug ?? result.slug);
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
      .select({ count: guidesSchema.id })
      .from(guidesSchema)
      .execute();
    return Number(result[0]?.count ?? 0);
  }
}
