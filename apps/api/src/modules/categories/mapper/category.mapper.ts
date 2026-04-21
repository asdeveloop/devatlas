import type { Category } from '@devatlas/types';

import type { CategoryRecord } from '../categories.repository';

export class CategoryMapper {
  static toDomain(entity: CategoryRecord): Category {
    return {
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      description: entity.icon ?? null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
