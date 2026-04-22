export type { ApiErrorResponse, ApiResult } from './api/error';
export * from './api/category';
export * from './api/guide';
export * from './api/pagination';
export * from './api/response';
export * from './api/search';
export * from './api/tag';
export * from './api/tool';
export { ContentStatus, Difficulty, EntityType, RelationType, ToolPrice, ToolStatus, ToolTier, } from './content/enums';
export type { Category } from './content/category';
export type { Guide, GuideSummary, GuideWithRelations } from './content/guide';
export type { ContentRelation } from './content/relation';
export type { SearchResultItem } from './content/search';
export type { Tag } from './content/tag';
export type { Tool, ToolSummary, ToolWithRelations } from './content/tool';
export * from './database';
export * from './validation';
export type AiContentType = 'guide' | 'tool';
export interface AiSummary {
    id: string;
    contentType: AiContentType;
    contentId: string;
    slug: string;
    title: string;
    summary: string;
    model: string;
    createdAt: string;
}
export interface AiAnswerSource {
    contentType: AiContentType;
    title: string;
    slug: string;
    url: string;
    summary: string;
}
export interface AiAnswer {
    id: string;
    question: string;
    answer: string;
    sources: AiAnswerSource[];
    createdAt: string;
}
export interface AskAiBody {
    question: string;
    limit?: number;
}
export interface GetAiSummaryParams {
    contentType: AiContentType;
    slug: string;
}
export type AskAiResponse = AiAnswer;
export type AiSummaryDetail = AiSummary;
export interface CreateContentRelationBody {
    sourceType: import('./content/enums').EntityType;
    sourceId: string;
    targetType: import('./content/enums').EntityType;
    targetId: string;
    relationType: import('./content/enums').RelationType;
    weight?: number;
}
export interface RelatedContentItem {
    id: string;
    slug: string;
    contentType: 'guide' | 'tool';
    title: string;
    description: string;
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
    relationType: import('./content/enums').RelationType;
    weight: number | null;
    url: string;
}
//# sourceMappingURL=index.d.ts.map
