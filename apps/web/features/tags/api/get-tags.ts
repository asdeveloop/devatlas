import type { PaginationMeta, TagListItem, TagListParams } from '@devatlas/types';

import { tagsClient } from '../../../lib/api-client';

export interface TagListResponse {
  data: TagListItem[];
  meta: PaginationMeta;
}

export async function getTags(params?: TagListParams): Promise<TagListResponse> {
  const response = await tagsClient.list(params);
  return {
    data: response.data as TagListItem[],
    meta: response.meta,
  };
}
