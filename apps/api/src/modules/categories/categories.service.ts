import { Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';

import type { CategoriesRepository } from './categories.repository';
import type { CategoryQueryDto } from './dto/category-query.dto';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoriesRepository) {}

  async list(query: CategoryQueryDto) {
    return this.repo.findAll(query);
  }

  async get(slug: string) {
    const category = await this.repo.findBySlug(slug);
    if (!category) throw ErrorFactory.CategoryNotFound();
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.repo.findBySlug(dto.slug);
    if (exists) throw ErrorFactory.SlugConflict();
    return this.repo.create(dto);
  }

  async update(slug: string, dto: UpdateCategoryDto) {
    const exists = await this.repo.findBySlug(slug);
    if (!exists) throw ErrorFactory.CategoryNotFound();
    return this.repo.update(slug, dto);
  }

  async delete(slug: string) {
    const exists = await this.repo.findBySlug(slug);
    if (!exists) throw ErrorFactory.CategoryNotFound();
    return this.repo.delete(slug);
  }
}
