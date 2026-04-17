import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { ToolQueryDto } from './dto/tool-query.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

@Injectable()
export class ToolsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ToolQueryDto) {
    const skip = (query.page - 1) * query.pageSize;
    const where = {
      ...(query.tagSlug
        ? { tags: { some: { tag: { slug: query.tagSlug } } } }
        : {}),
      ...(query.categorySlug ? { category: { slug: query.categorySlug } } : {}),
      ...(query.tier ? { tier: query.tier } : {}),
      ...(query.price ? { price: query.price } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.tool.findMany({
        skip,
        take: query.pageSize,
        where,
        include: {
          tags: { include: { tag: true } },
          category: true,
        },
        orderBy: { popularity: 'desc' },
      }),
      this.prisma.tool.count({ where }),
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
    return this.prisma.tool.findUnique({
      where: { slug },
      include: {
        tags: { include: { tag: true } },
        category: true,
      },
    });
  }

  async create(data: CreateToolDto) {
    return this.prisma.tool.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        website: data.website,
        github: data.github,
        icon: data.icon,
        tier: data.tier,
        price: data.price,
        active: data.active ?? true,
        categoryId: data.categoryId,
        tags: data.tagIds?.length
          ? {
              create: data.tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
            }
          : undefined,
      },
      include: {
        tags: { include: { tag: true } },
        category: true,
      },
    });
  }

  async update(slug: string, data: UpdateToolDto) {
    return this.prisma.tool.update({
      where: { slug },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        website: data.website,
        github: data.github,
        icon: data.icon,
        tier: data.tier,
        price: data.price,
        active: data.active,
        categoryId: data.categoryId,
        tags: data.tagIds
          ? {
              deleteMany: {},
              create: data.tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
            }
          : undefined,
      },
      include: {
        tags: { include: { tag: true } },
        category: true,
      },
    });
  }

  async delete(slug: string) {
    return this.prisma.tool.delete({ where: { slug } });
  }
}
