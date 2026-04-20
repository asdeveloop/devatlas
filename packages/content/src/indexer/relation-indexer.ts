import type { PrismaClient } from "@prisma/client";

import type { RelationType } from "../types/index.js";

export interface RelationIndexInput {
  sourceType: string;
  sourceSlug: string;
  targetType: string;
  targetSlugs: string[];
  relationType: RelationType;
}

export async function indexRelations(
  prisma: PrismaClient,
  input: RelationIndexInput,
): Promise<void> {
  const { sourceType, sourceSlug, targetType, targetSlugs, relationType } = input;

  // Resolve source ID
  const source = sourceType === "guide"
    ? await prisma.guide.findUnique({ where: { slug: sourceSlug } })
    : await prisma.tool.findUnique({ where: { slug: sourceSlug } });

  if (!source) return;

  for (const targetSlug of targetSlugs) {
    const target = targetType === "guide"
      ? await prisma.guide.findUnique({ where: { slug: targetSlug } })
      : await prisma.tool.findUnique({ where: { slug: targetSlug } });

    if (!target) continue;

    // Avoid duplicates
    const exists = await prisma.contentRelation.findFirst({
      where: {
        sourceType,
        sourceId: source.id,
        targetType,
        targetId: target.id,
        relationType,
      },
    });

    if (!exists) {
      await prisma.contentRelation.create({
        data: {
          sourceType,
          sourceId: source.id,
          targetType,
          targetId: target.id,
          relationType,
        },
      });
    }
  }
}
