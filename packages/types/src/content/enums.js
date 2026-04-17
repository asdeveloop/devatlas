/** سطح دشواری محتوا */
export var Difficulty;
(function (Difficulty) {
    Difficulty["BEGINNER"] = "beginner";
    Difficulty["INTERMEDIATE"] = "intermediate";
    Difficulty["ADVANCED"] = "advanced";
})(Difficulty || (Difficulty = {}));
/** وضعیت انتشار محتوا */
export var ContentStatus;
(function (ContentStatus) {
    ContentStatus["DRAFT"] = "DRAFT";
    ContentStatus["PUBLISHED"] = "PUBLISHED";
    ContentStatus["ARCHIVED"] = "ARCHIVED";
})(ContentStatus || (ContentStatus = {}));
/** وضعیت ابزار */
export var ToolStatus;
(function (ToolStatus) {
    ToolStatus["ACTIVE"] = "ACTIVE";
    ToolStatus["DEPRECATED"] = "DEPRECATED";
    ToolStatus["ARCHIVED"] = "ARCHIVED";
})(ToolStatus || (ToolStatus = {}));
/** نوع رابطه بین محتواها */
export var RelationType;
(function (RelationType) {
    RelationType["RELATES_TO"] = "RELATES_TO";
    RelationType["MENTIONS"] = "MENTIONS";
    RelationType["PREREQUISITE"] = "PREREQUISITE";
    RelationType["ALTERNATIVE"] = "ALTERNATIVE";
})(RelationType || (RelationType = {}));
/** نوع entity در سیستم */
export var EntityType;
(function (EntityType) {
    EntityType["GUIDE"] = "GUIDE";
    EntityType["TOOL"] = "TOOL";
})(EntityType || (EntityType = {}));
