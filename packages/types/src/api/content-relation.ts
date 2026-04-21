import type { EntityType, RelationType } from '../content/enums';

export interface CreateContentRelationBody {
  sourceType: EntityType;
  sourceId: string;
  targetType: EntityType;
  targetId: string;
  relationType: RelationType;
  weight?: number;
}

export interface RelatedContentItem {
  id: string;
  slug: string;
  contentType: 'guide' | 'tool';
  title: string;
  description: string;
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
  relationType: RelationType;
  weight: number | null;
  url: string;
}
