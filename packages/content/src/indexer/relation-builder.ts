import { randomUUID } from 'node:crypto';

import type { ContentRelation, ContentType, RelationType, GuideFrontmatter, ToolFrontmatter } from '../types';

interface RelationInput {
  sourceType: ContentType;
  sourceSlug: string;
  frontmatter: GuideFrontmatter | ToolFrontmatter;
  slugToIdMap: Map<string, { id: string; type: ContentType }>;
}

export function buildRelations(input: RelationInput): ContentRelation[] {
  const { sourceType, sourceSlug, frontmatter, slugToIdMap } = input;
  const relations: ContentRelation[] = [];
  const sourceEntry = slugToIdMap.get(sourceSlug);
  if (!sourceEntry) return relations;

  const relatedFields: Array<{ field: string[]; targetType: ContentType }> = [
    { field: (frontmatter as GuideFrontmatter).related_guides ?? [], targetType: 'guide' },
    { field: (frontmatter as GuideFrontmatter).related_tools ?? [], targetType: 'tool' },
  ];

  for (const { field: slugs, targetType } of relatedFields) {
    for (const targetSlug of slugs) {
      const targetEntry = slugToIdMap.get(targetSlug);
      if (!targetEntry) continue;

      relations.push({
        id: randomUUID(),
        source_type: sourceType,
        source_id: sourceEntry.id,
        target_type: targetType,
        target_id: targetEntry.id,
        relation_type: 'related' as RelationType,
      });
    }
  }

  return relations;
}
