import type { Category } from './category';
import type { ToolStatus } from './enums';
import type { Tag } from './tag';

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  website: string | null;
  github: string | null;
  categoryId: string;
  popularityScore: number;
  status: ToolStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ToolWithRelations extends Tool {
  category: Category;
  tags: Tag[];
}

export interface ToolSummary extends Tool {
  category: Pick<Category, 'id' | 'slug' | 'name'>;
  tags: Pick<Tag, 'id' | 'slug' | 'name'>[];
}
