import { z } from 'zod';
/** Slug pattern — فقط حروف کوچک، اعداد، و خط‌تیره */
export declare const slugSchema: z.ZodString;
/** UUID validation */
export declare const uuidSchema: z.ZodString;
/** آرایه‌ای از UUID ها */
export declare const uuidArraySchema: z.ZodArray<z.ZodString, "many">;
/** پارامترهای pagination — با default های منطقی */
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit?: number;
    page?: number;
}, {
    limit?: number;
    page?: number;
}>;
/** Sort order */
export declare const sortOrderSchema: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
//# sourceMappingURL=common.d.ts.map