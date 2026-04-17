import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CategoryQueryDto } from './dto/category-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CategoryQueryDto) {
    const skip = (query.page - 1) * query.pageSize;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        skip,
        take: query.pageSize,
        orderBy: { name: 'asc' },
      }),
      this.prisma.category.count(),
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
    return this.prisma.category.findUnique({ where: { slug } });
  }

  async create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  async update(slug: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { slug }, data });
  }

  async delete(slug: string) {
    return this.prisma.category.delete({ where: { slug } });
  }
}
