import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagQueryDto } from './dto/tag-query.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: TagQueryDto) {
    const skip = (query.page - 1) * query.pageSize;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
        skip,
        take: query.pageSize,
        orderBy: { name: 'asc' },
      }),
      this.prisma.tag.count(),
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
    return this.prisma.tag.findUnique({ where: { slug } });
  }

  async create(data: CreateTagDto) {
    return this.prisma.tag.create({ data });
  }

  async update(slug: string, data: UpdateTagDto) {
    return this.prisma.tag.update({ where: { slug }, data });
  }

  async delete(slug: string) {
    return this.prisma.tag.delete({ where: { slug } });
  }
}
