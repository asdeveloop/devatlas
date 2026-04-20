"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolQuerySchema = exports.updateToolSchema = exports.createToolSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../content/enums");
const common_1 = require("./common");
// ── Create ───────────────────────────────────────────
exports.createToolSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    slug: common_1.slugSchema,
    description: zod_1.z.string().min(10).max(1000),
    website: zod_1.z.string().url('Invalid URL').nullable().optional(),
    github: zod_1.z.string().url('Invalid URL').nullable().optional(),
    categoryId: common_1.uuidSchema,
    tagIds: common_1.uuidArraySchema.optional(),
    status: zod_1.z.nativeEnum(enums_1.ToolStatus).default(enums_1.ToolStatus.ACTIVE),
});
// ── Update ───────────────────────────────────────────
exports.updateToolSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    slug: common_1.slugSchema.optional(),
    description: zod_1.z.string().min(10).max(1000).optional(),
    website: zod_1.z.string().url().nullable().optional(),
    github: zod_1.z.string().url().nullable().optional(),
    categoryId: common_1.uuidSchema.optional(),
    tagIds: common_1.uuidArraySchema.optional(),
    status: zod_1.z.nativeEnum(enums_1.ToolStatus).optional(),
});
// ── Query ────────────────────────────────────────────
exports.toolQuerySchema = common_1.paginationSchema.extend({
    categorySlug: zod_1.z.string().optional(),
    tagSlug: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(enums_1.ToolStatus).optional(),
    search: zod_1.z.string().max(200).optional(),
    sortBy: zod_1.z.enum(['name', 'popularityScore', 'createdAt']).default('popularityScore'),
    sortOrder: common_1.sortOrderSchema,
});
//# sourceMappingURL=tool.schema.js.map