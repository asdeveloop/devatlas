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
  description: string;
  content: string;
  categoryId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readingTime: number;
};

// === اصلاح‌شده ===
export type ToolRecord = DatabaseEntity & {
  slug: string;
  name: string;
  description: string;          // ← required
  summary: string;
  website?: string;              // ← نام Prisma
  github?: string;               // ← جدید
  popularityScore: number;       // ← جدید
  categoryId: string;
};

export type CategoryRecord = DatabaseEntity & {
  slug: string;
  name: string;
  description?: string;
};
