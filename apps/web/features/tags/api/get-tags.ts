import { HttpClient, TagsClient } from '@devatlas/api-client';
import type { PaginationMeta, TagListItem, TagListParams } from '@devatlas/types';

import { webEnv } from '../../../lib/env';

export interface TagListResponse {
  data: TagListItem[];
  meta: PaginationMeta;
}

const tagsClient = new TagsClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getTags(params?: TagListParams): Promise<TagListResponse> {
  const response = await tagsClient.list(params);
  return {
    data: response.data,
    meta: response.meta,
  };
}
