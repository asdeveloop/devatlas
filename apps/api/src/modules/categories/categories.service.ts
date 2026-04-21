import type { Category, CategoryListItem } from '@devatlas/types';
import { Inject, Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';

import { CategoriesRepository } from './categories.repository';
import type { CategoryQueryDto } from './dto/category-query.dto';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryMapper } from './mapper/category.mapper';

@Injectable()
export class CategoriesService {
  constructor(@Inject(CategoriesRepository) private readonly repo: CategoriesRepository) {}

  async list(query: CategoryQueryDto): Promise<{
    data: CategoryListItem[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    const result = await this.repo.findAll(query);
    return {
      data: result.data.map((category) => CategoryMapper.toDomain(category)),
      meta: result.meta,
    };
  }

  async get(slug: string): Promise<Category> {
    const category = await this.repo.findBySlug(slug);
    if (!category) throw ErrorFactory.CategoryNotFound();
    return CategoryMapper.toDomain(category);
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const exists = await this.repo.findBySlug(dto.slug);
    if (exists) throw ErrorFactory.SlugConflict();
    return CategoryMapper.toDomain(await this.repo.create(dto));
  }

  async update(slug: string, dto: UpdateCategoryDto): Promise<Category> {
    const exists = await this.repo.findBySlug(slug);
    if (!exists) throw ErrorFactory.CategoryNotFound();
    return CategoryMapper.toDomain(await this.repo.update(slug, dto));
  }

  async delete(slug: string): Promise<Category> {
    const exists = await this.repo.findBySlug(slug);
    if (!exists) throw ErrorFactory.CategoryNotFound();
    return CategoryMapper.toDomain(await this.repo.delete(slug));
  }
}
