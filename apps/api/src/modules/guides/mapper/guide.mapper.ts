import { ContentStatus, Difficulty, Prisma } from '@prisma/client';

type GuideRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  readingTime: number;
  difficulty: Difficulty;
  status: ContentStatus;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

type GuideSummaryRecord = GuideRecord & {
  category: {
    id: string;
    slug: string;
    name: string;
  };
  tags: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
};

type GuideDetailRecord = GuideRecord & {
  category: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
  tags: Array<{
    id: string;
    slug: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

type GuideWithRelations = Prisma.GuideGetPayload<{
  include: {
    category: true;
    tags: { include: { tag: true } };
  };
}>;

function toIsoString(value: Date): string {
  return value.toISOString();
}

export class GuideMapper {
  static toDomain(entity: GuideWithRelations | Prisma.GuideGetPayload<Record<string, never>>): GuideRecord {
    return {
      id: entity.id,
      slug: entity.slug,
      title: entity.title,
      description: entity.description ?? '',
      content: entity.content ?? '',
      readingTime: entity.readingTime ?? 1,
      difficulty: entity.difficulty ?? Difficulty.beginner,
      status: entity.status ?? ContentStatus.DRAFT,
      categoryId: entity.categoryId,
      createdAt: toIsoString(entity.createdAt),
      updatedAt: toIsoString(entity.updatedAt),
    };
  }

  static toSummary(entity: GuideWithRelations): GuideSummaryRecord {
    return {
      ...GuideMapper.toDomain(entity),
      category: {
        id: entity.category.id,
        slug: entity.category.slug,
        name: entity.category.name,
      },
      tags: entity.tags.map(({ tag }) => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
      })),
    };
  }

  static toDetail(entity: GuideWithRelations): GuideDetailRecord {
    return {
      ...GuideMapper.toDomain(entity),
      category: {
        id: entity.category.id,
        slug: entity.category.slug,
        name: entity.category.name,
        description: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      tags: entity.tags.map(({ tag }) => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    };
  }
}
