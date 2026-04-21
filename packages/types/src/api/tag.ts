import type { Tag } from '../content/tag';

import type { PaginationParams } from './pagination';

export type TagListParams = PaginationParams;

export interface CreateTagBody {
  slug: string;
  name: string;
}

export interface UpdateTagBody {
  name?: string;
}

export type TagListItem = Tag;
export type TagDetail = Tag;
