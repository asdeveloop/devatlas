import type { Category } from './category';
import type { ToolStatus } from './enums';
import type { Tag } from './tag';
/** مدل پایه Tool */
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
/** Tool به همراه relations */
export interface ToolWithRelations extends Tool {
    category: Category;
    tags: Tag[];
}
/** Tool خلاصه — برای لیست و کارت */
export interface ToolSummary {
    id: string;
    slug: string;
    name: string;
    description: string;
    website: string | null;
    popularityScore: number;
    status: ToolStatus;
    category: Pick<Category, 'id' | 'slug' | 'name'>;
    tags: Pick<Tag, 'id' | 'slug' | 'name'>[];
}
//# sourceMappingURL=tool.d.ts.map