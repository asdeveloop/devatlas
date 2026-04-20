"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortOrderSchema = exports.paginationSchema = exports.uuidArraySchema = exports.uuidSchema = exports.slugSchema = void 0;
const zod_1 = require("zod");
/** Slug pattern — فقط حروف کوچک، اعداد، و خط‌تیره */
exports.slugSchema = zod_1.z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens');
/** UUID validation */
exports.uuidSchema = zod_1.z.string().uuid('Invalid UUID format');
/** آرایه‌ای از UUID ها */
exports.uuidArraySchema = zod_1.z
    .array(exports.uuidSchema)
    .max(50, 'Maximum 50 items allowed');
/** پارامترهای pagination — با default های منطقی */
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
/** Sort order */
exports.sortOrderSchema = zod_1.z.enum(['asc', 'desc']).default('desc');
//# sourceMappingURL=common.js.map