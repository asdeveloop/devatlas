import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { ToolQueryDto } from './dto/tool-query.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { and, eq, sql } from 'drizzle-orm';
import { tools } from '../../db/schema';
import { tools as toolsSchema, toolTags, tags, categories } from '../../db/schema';

@Injectable()
export class ToolsRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(query: ToolQueryDto) {
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
      ? and(...whereConditions as never) 
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
        .then(([result]) => result.count),
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

  async findBySlug(slug: string) {
    const result = await this.drizzle.db
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
          tag: {
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
          },
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(toolsSchema)
      .leftJoin(toolTags, eq(toolsSchema.id, toolTags.toolId))
      .leftJoin(tags, eq(toolTags.tagId, tags.id))
      .leftJoin(categories, eq(toolsSchema.categoryId, categories.id))
      .where(eq(toolsSchema.slug, slug))
      .execute();

    // Group tags by tool
    const grouped = result.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = {
          ...item,
          tags: [],
          category: item.category || null,
        };
      }
      if (item.tags) {
        acc[item.id].tags.push(item.tags);
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped)[0] ?? null;
  }

  async create(data: CreateToolDto) {
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

  async update(slug: string, data: UpdateToolDto) {
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

  async delete(slug: string) {
    const [result] = await this.drizzle.db
      .delete(toolsSchema)
      .where(eq(toolsSchema.slug, slug))
      .returning()
      .execute();
    return result;
  }
}
