import { z } from 'zod';
export declare const createTagSchema: z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name?: string;
    slug?: string;
}, {
    name?: string;
    slug?: string;
}>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export declare const updateTagSchema: z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    slug?: string;
}, {
    name?: string;
    slug?: string;
}>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export declare const tagQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string;
}, {
    search?: string;
}>;
export type TagQueryInput = z.infer<typeof tagQuerySchema>;
//# sourceMappingURL=tag.schema.d.ts.map