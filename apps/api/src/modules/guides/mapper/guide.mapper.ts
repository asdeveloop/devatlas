import type { GuideRecord, GuideWithRelations } from '../guides.repository';

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
    createdAt: Date;
    updatedAt: Date;
  };
  tags: Array<{
    id: string;
    slug: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export class GuideMapper {
  static toDomain(entity: GuideRecord | GuideWithRelations): GuideRecord {
    return {
      id: entity.id,
      slug: entity.slug,
      title: entity.title,
      description: entity.description ?? '',
      content: entity.content ?? '',
      readingTime: entity.readingTime ?? 1,
      difficulty: entity.difficulty ?? null,
      status: entity.status ?? 'DRAFT',
      categoryId: entity.categoryId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toSummary(entity: GuideWithRelations): GuideSummaryRecord {
    if (!entity.category) {
      throw new Error('Guide category is required');
    }

    return {
      ...GuideMapper.toDomain(entity),
      category: {
        id: entity.category.id,
        slug: entity.category.slug,
        name: entity.category.name,
      },
      tags: entity.tags,
    };
  }

  static toDetail(entity: GuideWithRelations): GuideDetailRecord {
    if (!entity.category) {
      throw new Error('Guide category is required');
    }

    return {
      ...GuideMapper.toDomain(entity),
      category: {
        id: entity.category.id,
        slug: entity.category.slug,
        name: entity.category.name,
        description: entity.category.icon,
        createdAt: entity.category.createdAt,
        updatedAt: entity.category.updatedAt,
      },
      tags: entity.tags,
    };
  }
}
