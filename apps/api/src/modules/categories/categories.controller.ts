import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import type { CategoryQueryDto } from './dto/category-query.dto';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(@Inject(CategoriesService) private readonly service: CategoriesService) {}

  @Get()
  async list(@Query() query: CategoryQueryDto) {
    return this.service.list(query);
  }

  @Get(':slug')
  async get(@Param('slug') slug: string) {
    return this.service.get(slug);
  }

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(slug, dto);
  }

  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    return this.service.delete(slug);
  }
}
