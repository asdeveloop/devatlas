"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideQuerySchema = exports.updateGuideSchema = exports.createGuideSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../content/enums");
const common_1 = require("./common");
// ── Create ───────────────────────────────────────────
exports.createGuideSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    slug: common_1.slugSchema,
    description: zod_1.z.string().min(10).max(500),
    content: zod_1.z.string().min(1, 'Content cannot be empty'),
    difficulty: zod_1.z.nativeEnum(enums_1.Difficulty),
    readingTime: zod_1.z.number().int().min(1).max(120),
    categoryId: common_1.uuidSchema,
    tagIds: common_1.uuidArraySchema.optional(),
    status: zod_1.z.nativeEnum(enums_1.ContentStatus).default(enums_1.ContentStatus.DRAFT),
});
// ── Update ───────────────────────────────────────────
exports.updateGuideSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200).optional(),
    slug: common_1.slugSchema.optional(),
    description: zod_1.z.string().min(10).max(500).optional(),
    content: zod_1.z.string().min(1).optional(),
    difficulty: zod_1.z.nativeEnum(enums_1.Difficulty).optional(),
    readingTime: zod_1.z.number().int().min(1).max(120).optional(),
    categoryId: common_1.uuidSchema.optional(),
    tagIds: common_1.uuidArraySchema.optional(),
    status: zod_1.z.nativeEnum(enums_1.ContentStatus).optional(),
});
// ── Query (List + Filter) ────────────────────────────
exports.guideQuerySchema = common_1.paginationSchema.extend({
    categorySlug: zod_1.z.string().optional(),
    tagSlug: zod_1.z.string().optional(),
    difficulty: zod_1.z.nativeEnum(enums_1.Difficulty).optional(),
    status: zod_1.z.nativeEnum(enums_1.ContentStatus).optional(),
    search: zod_1.z.string().max(200).optional(),
    sortBy: zod_1.z.enum(['createdAt', 'readingTime', 'title']).default('createdAt'),
    sortOrder: common_1.sortOrderSchema,
});
//# sourceMappingURL=guide.schema.js.map