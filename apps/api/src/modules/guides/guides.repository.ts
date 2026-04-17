import { Injectable } from '@nestjs/common';
import { Prisma, type Guide as PrismaGuide } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

const guideInclude = {
  category: true,
  tags: { include: { tag: true } },
} satisfies Prisma.GuideInclude;

@Injectable()
export class GuidesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: Prisma.GuideFindManyArgs) {
    return this.prisma.guide.findMany({
      ...params,
      include: guideInclude,
    });
  }

  async findById(id: string): Promise<PrismaGuide | null> {
    return this.prisma.guide.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.prisma.guide.findUnique({
      where: { slug },
      include: guideInclude,
    });
  }

  async create(data: Prisma.GuideCreateInput) {
    return this.prisma.guide.create({
      data,
      include: guideInclude,
    });
  }

  async update(id: string, data: Prisma.GuideUpdateInput) {
    return this.prisma.guide.update({
      where: { id },
      data,
      include: guideInclude,
    });
  }

  async delete(id: string): Promise<PrismaGuide> {
    return this.prisma.guide.delete({ where: { id } });
  }

  async count(filter: Prisma.GuideWhereInput = {}): Promise<number> {
    return this.prisma.guide.count({ where: filter });
  }
}
