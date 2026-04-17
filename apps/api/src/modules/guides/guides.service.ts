import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorFactory } from '../../common/errors/error.factory';
import { CreateGuideDto } from './dto/create-guide.dto';
import { GuideQueryDto } from './dto/guide-query.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { GuideMapper } from './mapper/guide.mapper';
import { GuidesRepository } from './guides.repository';

@Injectable()
export class GuidesService {
  constructor(private readonly repo: GuidesRepository) {}

  async findAll(query: GuideQueryDto) {
    const where: Prisma.GuideWhereInput = {
      status: query.status,
      difficulty: query.difficulty,
      categoryId: query.categoryId,
    };

    const [items, total] = await Promise.all([
      this.repo.findAll({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: { [query.sortBy ?? 'createdAt']: query.order ?? 'desc' },
      }),
      this.repo.count(where),
    ]);

    const take = query.take ?? 20;
    const page = Math.floor((query.skip ?? 0) / take) + 1;
    const totalPages = Math.max(1, Math.ceil(total / take));

    return {
      data: items.map(GuideMapper.toSummary),
      meta: {
        page,
        limit: take,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findBySlug(slug: string) {
    const entity = await this.repo.findBySlug(slug);
    if (!entity) {
      throw ErrorFactory.GuideNotFound();
    }

    return GuideMapper.toDetail(entity);
  }

  async create(dto: CreateGuideDto) {
    const exists = await this.repo.findBySlug(dto.slug);
    if (exists) {
      throw ErrorFactory.SlugConflict();
    }

    const entity = await this.repo.create({
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      content: dto.content,
      difficulty: dto.difficulty,
      readingTime: dto.readingTime,
      status: dto.status,
      category: {
        connect: { id: dto.categoryId },
      },
      tags: dto.tagIds?.length
        ? {
            create: dto.tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
    });

    return GuideMapper.toDetail(entity);
  }

  async update(id: string, dto: UpdateGuideDto) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw ErrorFactory.GuideNotFound();
    }

    const entity = await this.repo.update(id, {
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      content: dto.content,
      difficulty: dto.difficulty,
      readingTime: dto.readingTime,
      status: dto.status,
      category: dto.categoryId
        ? {
            connect: { id: dto.categoryId },
          }
        : undefined,
      tags: dto.tagIds
        ? {
            deleteMany: {},
            create: dto.tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
    });

    return GuideMapper.toDetail(entity);
  }

  async delete(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw ErrorFactory.GuideNotFound();
    }

    const entity = await this.repo.delete(id);
    return GuideMapper.toDomain(entity);
  }
}
