import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

import { tags } from '../../db/schema';
export type TagRecord = typeof tags.$inferSelect;
import { DrizzleService } from '../database/drizzle.service';

import type { CreateTagDto } from './dto/create-tag.dto';
import type { TagQueryDto } from './dto/tag-query.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsRepository {
  constructor(@Inject(DrizzleService) private readonly drizzle: DrizzleService) {}

  async findAll(query: TagQueryDto) {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 100);
    const offset = (page - 1) * pageSize;
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
        .limit(pageSize)
        .offset(offset),
      this.drizzle.db
        .select({ count: sql<number>`count(*)` })
        .from(tags)
        .execute()
        .then(([result]) => Number(result.count)),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit: pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        hasNextPage: page * pageSize < total,
        hasPrevPage: page > 1,
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
