import type { ContentPipelineDb } from '../pipeline/content-pipeline.js';
import type { RelationType } from '../types/index.js';

export interface RelationIndexInput {
  sourceType: string;
  sourceSlug: string;
  targetType: string;
  targetSlugs: string[];
  relationType: RelationType;
}

export async function indexRelations(
  db: ContentPipelineDb,
  input: RelationIndexInput,
): Promise<void> {
  const { sourceType, sourceSlug, targetType, targetSlugs, relationType } = input;

  const source = sourceType === 'guide'
    ? await db.guides.findBySlug(sourceSlug)
    : await db.tools.findBySlug(sourceSlug);

  if (!source) return;

  for (const targetSlug of targetSlugs) {
    const target = targetType === 'guide'
      ? await db.guides.findBySlug(targetSlug)
      : await db.tools.findBySlug(targetSlug);

    if (!target) continue;

    const relation = {
      sourceType,
      sourceId: source.id,
      targetType,
      targetId: target.id,
      relationType,
    };

    const exists = await db.relations.exists(relation);
    if (!exists) {
      await db.relations.create(relation);
    }
  }
}
