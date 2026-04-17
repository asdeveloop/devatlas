import type { EntityType, RelationType } from './enums';

/** رابطه بین دو entity — برای فاز 4 (Knowledge Graph) */
export interface ContentRelation {
  id: string;
  sourceType: EntityType;
  sourceId: string;
  targetType: EntityType;
  targetId: string;
  relationType: RelationType;
  weight: number | null;
  createdAt: string;
}
