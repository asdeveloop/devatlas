"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityType = exports.RelationType = exports.ToolPrice = exports.ToolTier = exports.ToolStatus = exports.ContentStatus = exports.Difficulty = void 0;
/** سطح دشواری محتوا */
var Difficulty;
(function (Difficulty) {
    Difficulty["BEGINNER"] = "beginner";
    Difficulty["INTERMEDIATE"] = "intermediate";
    Difficulty["ADVANCED"] = "advanced";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
/** وضعیت انتشار محتوا */
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["DRAFT"] = "DRAFT";
    ContentStatus["PUBLISHED"] = "PUBLISHED";
    ContentStatus["ARCHIVED"] = "ARCHIVED";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
/** وضعیت ابزار */
var ToolStatus;
(function (ToolStatus) {
    ToolStatus["ACTIVE"] = "ACTIVE";
    ToolStatus["DEPRECATED"] = "DEPRECATED";
    ToolStatus["ARCHIVED"] = "ARCHIVED";
})(ToolStatus || (exports.ToolStatus = ToolStatus = {}));
/** سطح دسترسی ابزار */
var ToolTier;
(function (ToolTier) {
    ToolTier["FREE"] = "FREE";
    ToolTier["FREEMIUM"] = "FREEMIUM";
    ToolTier["PRO"] = "PRO";
    ToolTier["ENTERPRISE"] = "ENTERPRISE";
})(ToolTier || (exports.ToolTier = ToolTier = {}));
/** مدل قیمت‌گذاری ابزار */
var ToolPrice;
(function (ToolPrice) {
    ToolPrice["FREE"] = "FREE";
    ToolPrice["PAID"] = "PAID";
    ToolPrice["MIXED"] = "MIXED";
})(ToolPrice || (exports.ToolPrice = ToolPrice = {}));
/** نوع رابطه بین محتواها */
var RelationType;
(function (RelationType) {
    RelationType["RELATES_TO"] = "RELATES_TO";
    RelationType["MENTIONS"] = "MENTIONS";
    RelationType["PREREQUISITE"] = "PREREQUISITE";
    RelationType["ALTERNATIVE"] = "ALTERNATIVE";
})(RelationType || (exports.RelationType = RelationType = {}));
/** نوع entity در سیستم */
var EntityType;
(function (EntityType) {
    EntityType["GUIDE"] = "GUIDE";
    EntityType["TOOL"] = "TOOL";
})(EntityType || (exports.EntityType = EntityType = {}));
//# sourceMappingURL=enums.js.map