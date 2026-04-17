import type { Tag } from '../content/tag';

export interface CreateTagBody {
  slug: string;
  name: string;
}

export interface UpdateTagBody {
  slug?: string;
  name?: string;
}

export type TagListItem = Tag;
export type TagDetail = Tag;
