import {
  ToolStatus,
  type Category,
  type Tool,
  type ToolSummary,
  type ToolWithRelations,
} from '@devatlas/types';

import type { ToolRecord, ToolWithRelations as ToolRowWithRelations } from '../tools.repository';

export class ToolMapper {
  static toDomain(entity: ToolRecord | ToolRowWithRelations): Tool {
    return {
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      description: entity.description ?? '',
      website: entity.website ?? null,
      github: entity.github ?? null,
      categoryId: entity.categoryId,
      popularityScore: entity.popularity,
      status: entity.active ? ToolStatus.ACTIVE : ToolStatus.ARCHIVED,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toSummary(entity: ToolRowWithRelations): ToolSummary {
    return {
      ...ToolMapper.toDomain(entity),
      category: ToolMapper.toCategoryPreview(entity.category, entity.categoryId),
      tags: entity.tags.map((tag) => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
      })),
    };
  }

  static toDetail(entity: ToolRowWithRelations): ToolWithRelations {
    return {
      ...ToolMapper.toDomain(entity),
      category: ToolMapper.toCategory(entity.category, entity.categoryId),
      tags: entity.tags.map((tag) => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString(),
      })),
    };
  }

  private static toCategory(category: ToolRowWithRelations['category'], fallbackId: string): Category {
    return {
      id: category?.id ?? fallbackId,
      slug: category?.slug ?? '',
      name: category?.name ?? '',
      description: category?.icon ?? null,
      createdAt: category?.createdAt.toISOString() ?? '',
      updatedAt: category?.updatedAt.toISOString() ?? '',
    };
  }

  private static toCategoryPreview(category: ToolRowWithRelations['category'], fallbackId: string) {
    return {
      id: category?.id ?? fallbackId,
      slug: category?.slug ?? '',
      name: category?.name ?? '',
    };
  }
}
