import type { Category } from './category';
import type { ContentStatus, Difficulty } from './enums';
import type { Tag } from './tag';
/** مدل پایه Guide — بدون relations */
export interface Guide {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    difficulty: Difficulty;
    readingTime: number;
    categoryId: string;
    status: ContentStatus;
    createdAt: string;
    updatedAt: string;
}
/** Guide به همراه relations — برای صفحه جزئیات */
export interface GuideWithRelations extends Guide {
    category: Category;
    tags: Tag[];
}
/** Guide خلاصه — برای لیست‌ها و کارت‌ها */
export interface GuideSummary {
    id: string;
    slug: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    readingTime: number;
    status: ContentStatus;
    category: Pick<Category, 'id' | 'slug' | 'name'>;
    tags: Pick<Tag, 'id' | 'slug' | 'name'>[];
    createdAt: string;
}
//# sourceMappingURL=guide.d.ts.map