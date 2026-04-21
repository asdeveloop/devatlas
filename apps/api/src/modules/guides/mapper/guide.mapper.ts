import { Difficulty, type ContentStatus, type Guide, type GuideSummary, type GuideWithRelations as GuideDetail } from '@devatlas/types';

import type { GuideRecord, GuideWithRelations } from '../guides.repository';

export class GuideMapper {
  static toDomain(entity: GuideRecord | GuideWithRelations): Guide {
    return {
      id: entity.id,
      slug: entity.slug,
      title: entity.title,
      description: entity.description ?? '',
      content: entity.content ?? '',
      readingTime: entity.readingTime ?? 0,
      difficulty: (entity.difficulty ?? Difficulty.BEGINNER) as Difficulty,
      status: entity.status as ContentStatus,
      categoryId: entity.categoryId,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toSummary(entity: GuideWithRelations): GuideSummary {
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
      tags: entity.tags.map((tag) => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
      })),
    };
  }

  static toDetail(entity: GuideWithRelations): GuideDetail {
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
        createdAt: entity.category.createdAt.toISOString(),
        updatedAt: entity.category.updatedAt.toISOString(),
      },
      tags: entity.tags.map((tag) => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString(),
      })),
    };
  }
}
