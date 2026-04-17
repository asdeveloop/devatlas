export type ContentId = string;

export type ContentType = "guide" | "tool";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type RelationType = "related" | "prerequisite" | "next" | "uses";

export interface ContentNode {
  id: ContentId;
  title: string;
  slug: string;
  body: string;
  contentType: ContentType;
  createdAt: Date;
  updatedAt: Date;
}
