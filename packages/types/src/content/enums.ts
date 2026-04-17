/** سطح دشواری محتوا */
export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

/** وضعیت انتشار محتوا */
export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

/** وضعیت ابزار */
export enum ToolStatus {
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

/** نوع رابطه بین محتواها */
export enum RelationType {
  RELATES_TO = 'RELATES_TO',
  MENTIONS = 'MENTIONS',
  PREREQUISITE = 'PREREQUISITE',
  ALTERNATIVE = 'ALTERNATIVE',
}

/** نوع entity در سیستم */
export enum EntityType {
  GUIDE = 'GUIDE',
  TOOL = 'TOOL',
}
