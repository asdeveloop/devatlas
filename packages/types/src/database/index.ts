export type EntityTimestamps = {
  createdAt: string;
  updatedAt: string;
};

export type DatabaseEntity<TId extends string = string> = EntityTimestamps & {
  id: TId;
};

export type GuideRecord = DatabaseEntity & {
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  categoryId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  readingTime: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

export type ToolRecord = DatabaseEntity & {
  slug: string;
  name: string;
  description: string | null;
  website: string | null;
  github: string | null;
  icon: string | null;
  active: boolean;
  tier: 'FREE' | 'FREEMIUM' | 'PRO' | 'ENTERPRISE';
  price: 'FREE' | 'PAID' | 'MIXED';
  popularity: number;
  categoryId: string;
};

export type CategoryRecord = DatabaseEntity & {
  slug: string;
  name: string;
  icon: string | null;
};

export type TagRecord = DatabaseEntity & {
  slug: string;
  name: string;
};
