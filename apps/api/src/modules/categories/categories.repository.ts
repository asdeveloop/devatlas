import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { categories } from '../../db/schema';
import type { DrizzleService } from '../database/drizzle.service';

import type { CategoryQueryDto } from './dto/category-query.dto';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(query: CategoryQueryDto) {
    const offset = (query.page - 1) * query.pageSize;
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
        .limit(query.pageSize)
        .offset(offset),
      this.drizzle.db
        .select({ count: categories.id })
        .from(categories)
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
