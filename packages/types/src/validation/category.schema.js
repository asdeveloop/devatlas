"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryQuerySchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.createCategorySchema = zod_1.z.object({
    slug: common_1.slugSchema,
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().max(500).nullable().optional(),
});
exports.updateCategorySchema = zod_1.z.object({
    slug: common_1.slugSchema.optional(),
    name: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().max(500).nullable().optional(),
});
exports.categoryQuerySchema = zod_1.z.object({
    search: zod_1.z.string().max(200).optional(),
});
//# sourceMappingURL=category.schema.js.map