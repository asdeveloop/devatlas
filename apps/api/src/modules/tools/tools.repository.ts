import { Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';

import { categories, tags, toolTags, tools, tools as toolsSchema } from '../../db/schema';
import type { DrizzleService } from '../database/drizzle.service';

import type { CreateToolDto } from './dto/create-tool.dto';
import type { ToolQueryDto } from './dto/tool-query.dto';
import type { UpdateToolDto } from './dto/update-tool.dto';

export type ToolTag = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

type ToolCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ToolRecord = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  website: string | null;
  github: string | null;
  icon: string | null;
  active: boolean;
  tier: string;
  price: string;
  popularity: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ToolWithRelations = ToolRecord & {
  tags: ToolTag[];
  category: ToolCategory | null;
};

type ToolQueryRow = ToolRecord & {
  tags: {
    id: string;
    tagId: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  category: ToolCategory | null;
};

export type ToolListResult = {
  data: ToolRecord[];
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
export class ToolsRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(query: ToolQueryDto): Promise<ToolListResult> {
    const offset = (query.page - 1) * query.pageSize;

    const whereConditions = [
      query.tier ? eq(tools.tier, query.tier) : undefined,
      query.price ? eq(tools.price, query.price) : undefined,
      query.categorySlug
        ? sql`${tools.categoryId} IN (SELECT id FROM ${categories} WHERE slug = ${query.categorySlug})`
        : undefined,
      query.tagSlug
        ? sql`${tools.id} IN (SELECT tool_id FROM ${toolTags} WHERE tag_id IN (SELECT id FROM ${tags} WHERE slug = ${query.tagSlug}))`
        : undefined,
    ].filter(Boolean);

    const where = whereConditions.length > 0
      ? and(...(whereConditions as Parameters<typeof and>))
      : undefined;

    const [items, total] = await Promise.all([
      this.drizzle.db
        .select({
          id: tools.id,
          slug: tools.slug,
          name: tools.name,
          description: tools.description,
          website: tools.website,
          github: tools.github,
          icon: tools.icon,
          active: tools.active,
          tier: tools.tier,
          price: tools.price,
          popularity: tools.popularity,
          categoryId: tools.categoryId,
          createdAt: tools.createdAt,
          updatedAt: tools.updatedAt,
        })
        .from(tools)
        .where(where)
        .orderBy(sql`${tools.popularity} DESC`)
        .limit(query.pageSize)
        .offset(offset),
      this.drizzle.db
        .select({ count: tools.id })
        .from(tools)
        .where(where)
        .execute()
        .then(([result]) => Number(result.count)),
    ]);

    return {
      data: items,
      meta: {
        page: query.page,
        limit: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
        hasNextPage: query.page * query.pageSize < total,
        hasPrevPage: query.page > 1,
      },
    };
  }

  async findBySlug(slug: string): Promise<ToolWithRelations | null> {
    const result = (await this.drizzle.db
      .select({
        id: toolsSchema.id,
        slug: toolsSchema.slug,
        name: toolsSchema.name,
        description: toolsSchema.description,
        website: toolsSchema.website,
        github: toolsSchema.github,
        icon: toolsSchema.icon,
        active: toolsSchema.active,
        tier: toolsSchema.tier,
        price: toolsSchema.price,
        popularity: toolsSchema.popularity,
        categoryId: toolsSchema.categoryId,
        createdAt: toolsSchema.createdAt,
        updatedAt: toolsSchema.updatedAt,
        tags: {
          id: toolTags.id,
          tagId: toolTags.tagId,
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
      .from(toolsSchema)
      .leftJoin(toolTags, eq(toolsSchema.id, toolTags.toolId))
      .leftJoin(tags, eq(toolTags.tagId, tags.id))
      .leftJoin(categories, eq(toolsSchema.categoryId, categories.id))
      .where(eq(toolsSchema.slug, slug))
      .execute()) as unknown as ToolQueryRow[];

    // Group tags by tool
    type GroupedTool = Omit<ToolQueryRow, 'tags' | 'category'> & {
      tags: ToolTag[];
      category: ToolCategory | null;
    };

    const grouped = new Map<string, GroupedTool>();

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

    const firstTool = grouped.values().next().value as GroupedTool | undefined;
    return firstTool ?? null;
  }

  async create(data: CreateToolDto): Promise<ToolWithRelations | null> {
    const drizzle = this.drizzle.db;

    // Insert tool
    const [tool] = await drizzle
      .insert(toolsSchema)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        website: data.website ?? null,
        github: data.github ?? null,
        icon: data.icon ?? null,
        active: data.active ?? true,
        tier: data.tier,
        price: data.price,
        categoryId: data.categoryId,
      })
      .returning()
      .execute();

    // Insert tags if provided
    if (data.tagIds?.length) {
      await drizzle
        .insert(toolTags)
        .values(
          data.tagIds.map((tagId) => ({
            toolId: tool.id,
            tagId,
          }))
        )
        .execute();
    }

    // Fetch tool with tags and category
    return await this.findBySlug(tool.slug);
  }

  async update(slug: string, data: UpdateToolDto): Promise<ToolWithRelations | null> {
    const drizzle = this.drizzle.db;

    // Update tool
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description ?? null;
    if (data.website !== undefined) updateData.website = data.website ?? null;
    if (data.github !== undefined) updateData.github = data.github ?? null;
    if (data.icon !== undefined) updateData.icon = data.icon ?? null;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.tier !== undefined) updateData.tier = data.tier;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    const [result] = await drizzle
      .update(toolsSchema)
      .set(updateData)
      .where(eq(toolsSchema.slug, slug))
      .returning()
      .execute();

    // Handle tags replacement
    if (data.tagIds !== undefined) {
      await drizzle
        .delete(toolTags)
        .where(eq(toolTags.toolId, result.id))
        .execute();

      if (data.tagIds.length) {
        await drizzle
          .insert(toolTags)
          .values(
            data.tagIds.map((tagId) => ({
              toolId: result.id,
              tagId,
            }))
          )
          .execute();
      }
    }

    return await this.findBySlug(data.slug ?? slug);
  }

  async delete(slug: string): Promise<ToolRecord | null> {
    const [result] = await this.drizzle.db
      .delete(toolsSchema)
      .where(eq(toolsSchema.slug, slug))
      .returning()
      .execute();
    return result;
  }
}
