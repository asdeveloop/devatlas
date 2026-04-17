import type { ContentId, Difficulty } from "./content.js";

export interface GuideFrontmatter {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty: Difficulty;
  relatedGuides?: string[];
  relatedTools?: string[];
  relatedAiResources?: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
}

export interface Guide extends GuideFrontmatter {
  id: ContentId;
  body: string;
  readingTime: number;
}
