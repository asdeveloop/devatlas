"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagQuerySchema = exports.updateTagSchema = exports.createTagSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.createTagSchema = zod_1.z.object({
    slug: common_1.slugSchema,
    name: zod_1.z.string().min(2).max(100),
});
exports.updateTagSchema = zod_1.z.object({
    slug: common_1.slugSchema.optional(),
    name: zod_1.z.string().min(2).max(100).optional(),
});
exports.tagQuerySchema = zod_1.z.object({
    search: zod_1.z.string().max(200).optional(),
});
//# sourceMappingURL=tag.schema.js.map