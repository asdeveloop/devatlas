import { z } from 'zod';
import { ContentStatus, Difficulty } from '../content/enums';
export declare const createGuideSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    content: z.ZodString;
    difficulty: z.ZodNativeEnum<typeof Difficulty>;
    readingTime: z.ZodNumber;
    categoryId: z.ZodString;
    tagIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof ContentStatus>>;
}, "strip", z.ZodTypeAny, {
    slug?: string;
    description?: string;
    categoryId?: string;
    title?: string;
    content?: string;
    readingTime?: number;
    difficulty?: Difficulty;
    status?: ContentStatus;
    tagIds?: string[];
}, {
    slug?: string;
    description?: string;
    categoryId?: string;
    title?: string;
    content?: string;
    readingTime?: number;
    difficulty?: Difficulty;
    status?: ContentStatus;
    tagIds?: string[];
}>;
export type CreateGuideInput = z.infer<typeof createGuideSchema>;
export declare const updateGuideSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodNativeEnum<typeof Difficulty>>;
    readingTime: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodOptional<z.ZodString>;
    tagIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof ContentStatus>>;
}, "strip", z.ZodTypeAny, {
    slug?: string;
    description?: string;
    categoryId?: string;
    title?: string;
    content?: string;
    readingTime?: number;
    difficulty?: Difficulty;
    status?: ContentStatus;
    tagIds?: string[];
}, {
    slug?: string;
    description?: string;
    categoryId?: string;
    title?: string;
    content?: string;
    readingTime?: number;
    difficulty?: Difficulty;
    status?: ContentStatus;
    tagIds?: string[];
}>;
export type UpdateGuideInput = z.infer<typeof updateGuideSchema>;
export declare const guideQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    categorySlug: z.ZodOptional<z.ZodString>;
    tagSlug: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodNativeEnum<typeof Difficulty>>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof ContentStatus>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<["createdAt", "readingTime", "title"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    search?: string;
    difficulty?: Difficulty;
    status?: ContentStatus;
    limit?: number;
    page?: number;
    categorySlug?: string;
    tagSlug?: string;
    sortBy?: "createdAt" | "title" | "readingTime";
    sortOrder?: "asc" | "desc";
}, {
    search?: string;
    difficulty?: Difficulty;
    status?: ContentStatus;
    limit?: number;
    page?: number;
    categorySlug?: string;
    tagSlug?: string;
    sortBy?: "createdAt" | "title" | "readingTime";
    sortOrder?: "asc" | "desc";
}>;
export type GuideQueryInput = z.infer<typeof guideQuerySchema>;
//# sourceMappingURL=guide.schema.d.ts.map