export type ContentType = 'guide' | 'tool' | 'topic';
export type RelationType = 'related' | 'prerequisite' | 'next' | 'uses';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Guide {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  difficulty: Difficulty | null;
  reading_time: number | null;
  category_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  website: string | null;
  github: string | null;
  category_id: string | null;
  popularity_score: number;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface GuideTag {
  guide_id: string;
  tag_id: string;
}

export interface ToolTag {
  tool_id: string;
  tag_id: string;
}

export interface ContentRelation {
  id: string;
  source_type: ContentType;
  source_id: string;
  target_type: ContentType;
  target_id: string;
  relation_type: RelationType;
}

export interface SearchDocument {
  id: string;
  content_type: ContentType;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  url: string;
}
