import type { Tag } from '@devatlas/types';

import type { TagRecord } from '../tags.repository';

export class TagMapper {
  static toDomain(entity: TagRecord): Tag {
    return {
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
