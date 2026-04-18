import { guides as guidesSchema, categories as categoriesSchema, tags as tagsSchema } from '../../../db/schema';

type GuideRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  readingTime: number;
  difficulty: string | null;
  status: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

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

type GuideWithRelations = Awaited<ReturnType<typeof guidesSchema.$inferSelect>> & {
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

function toIsoString(value: Date | string): string {
  return new Date(value).toISOString();
}

export class GuideMapper {
  static toDomain(entity: GuideWithRelations): GuideRecord {
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
    return {
      ...GuideMapper.toDomain(entity),
      category: {
        id: entity.category.id,
        slug: entity.category.slug,
        name: entity.category.name,
      },
      tags: entity.tags.map((t) => t.tag),
    };
  }

  static toDetail(entity: GuideWithRelations): GuideDetailRecord {
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
      tags: entity.tags.map((t) => t.tag),
    };
  }
}
