import { z } from 'zod';
export declare const createCategorySchema: z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    slug?: string;
    description?: string;
}, {
    name?: string;
    slug?: string;
    description?: string;
}>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export declare const updateCategorySchema: z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    slug?: string;
    description?: string;
}, {
    name?: string;
    slug?: string;
    description?: string;
}>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export declare const categoryQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string;
}, {
    search?: string;
}>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
//# sourceMappingURL=category.schema.d.ts.map