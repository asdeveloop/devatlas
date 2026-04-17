import type { ContentId } from "./content.js";

export interface ToolFrontmatter {
  name: string;
  slug: string;
  website?: string;
  description: string;
  category: string;
  tags: string[];
  relatedGuides?: string[];
  relatedTools?: string[];
}

export interface Tool extends ToolFrontmatter {
  id: ContentId;
  body: string;
}
