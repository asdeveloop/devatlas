import { z } from 'zod';
import { ToolStatus } from '../content/enums';
export declare const createToolSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    github: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    categoryId: z.ZodString;
    tagIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof ToolStatus>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    slug?: string;
    description?: string;
    website?: string;
    github?: string;
    categoryId?: string;
    status?: ToolStatus;
    tagIds?: string[];
}, {
    name?: string;
    slug?: string;
    description?: string;
    website?: string;
    github?: string;
    categoryId?: string;
    status?: ToolStatus;
    tagIds?: string[];
}>;
export type CreateToolInput = z.infer<typeof createToolSchema>;
export declare const updateToolSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    github: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    categoryId: z.ZodOptional<z.ZodString>;
    tagIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof ToolStatus>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    slug?: string;
    description?: string;
    website?: string;
    github?: string;
    categoryId?: string;
    status?: ToolStatus;
    tagIds?: string[];
}, {
    name?: string;
    slug?: string;
    description?: string;
    website?: string;
    github?: string;
    categoryId?: string;
    status?: ToolStatus;
    tagIds?: string[];
}>;
export type UpdateToolInput = z.infer<typeof updateToolSchema>;
export declare const toolQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    categorySlug: z.ZodOptional<z.ZodString>;
    tagSlug: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof ToolStatus>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<["name", "popularityScore", "createdAt"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    search?: string;
    status?: ToolStatus;
    limit?: number;
    page?: number;
    categorySlug?: string;
    tagSlug?: string;
    sortBy?: "name" | "createdAt" | "popularityScore";
    sortOrder?: "asc" | "desc";
}, {
    search?: string;
    status?: ToolStatus;
    limit?: number;
    page?: number;
    categorySlug?: string;
    tagSlug?: string;
    sortBy?: "name" | "createdAt" | "popularityScore";
    sortOrder?: "asc" | "desc";
}>;
export type ToolQueryInput = z.infer<typeof toolQuerySchema>;
//# sourceMappingURL=tool.schema.d.ts.map