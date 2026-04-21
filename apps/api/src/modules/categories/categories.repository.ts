import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

import { categories } from '../../db/schema';
export type CategoryRecord = typeof categories.$inferSelect;
import { DrizzleService } from '../database/drizzle.service';

import type { CategoryQueryDto } from './dto/category-query.dto';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject(DrizzleService) private readonly drizzle: DrizzleService) {}

  async findAll(query: CategoryQueryDto) {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 50);
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.drizzle.db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          icon: categories.icon,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
        })
        .from(categories)
        .orderBy(categories.name)
        .limit(pageSize)
        .offset(offset),
      this.drizzle.db
        .select({ count: sql<number>`count(*)` })
        .from(categories)
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
      .from(categories)
      .where(eq(categories.slug, slug))
      .execute();
    return result ?? null;
  }

  async create(data: CreateCategoryDto) {
    const [result] = await this.drizzle.db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        icon: data.icon ?? null,
      })
      .returning()
      .execute();
    return result;
  }

  async update(slug: string, data: UpdateCategoryDto) {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.icon !== undefined) updateData.icon = data.icon ?? null;

    const [result] = await this.drizzle.db
      .update(categories)
      .set(updateData)
      .where(eq(categories.slug, slug))
      .returning()
      .execute();
    return result;
  }

  async delete(slug: string) {
    const [result] = await this.drizzle.db
      .delete(categories)
      .where(eq(categories.slug, slug))
      .returning()
      .execute();
    return result;
  }
}
