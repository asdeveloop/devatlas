import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { tags } from '../../db/schema';
import type { DrizzleService } from '../database/drizzle.service';

import type { CreateTagDto } from './dto/create-tag.dto';
import type { TagQueryDto } from './dto/tag-query.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(query: TagQueryDto) {
    const offset = (query.page - 1) * query.pageSize;
    const [items, total] = await Promise.all([
      this.drizzle.db
        .select({
          id: tags.id,
          name: tags.name,
          slug: tags.slug,
          createdAt: tags.createdAt,
          updatedAt: tags.updatedAt,
        })
        .from(tags)
        .orderBy(tags.name)
        .limit(query.pageSize)
        .offset(offset),
      this.drizzle.db
        .select({ count: tags.id })
        .from(tags)
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

  async findBySlug(slug: string) {
    const [result] = await this.drizzle.db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .execute();
    return result ?? null;
  }

  async create(data: CreateTagDto) {
    const [result] = await this.drizzle.db
      .insert(tags)
      .values({
        name: data.name,
        slug: data.slug,
      })
      .returning()
      .execute();
    return result;
  }

  async update(slug: string, data: UpdateTagDto) {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    const [result] = await this.drizzle.db
      .update(tags)
      .set(updateData)
      .where(eq(tags.slug, slug))
      .returning()
      .execute();
    return result;
  }

  async delete(slug: string) {
    const [result] = await this.drizzle.db
      .delete(tags)
      .where(eq(tags.slug, slug))
      .returning()
      .execute();
    return result;
  }
}
