import type { GuideListParams, GuideListItem, PaginationMeta } from '@devatlas/types';
import { GuidesClient, HttpClient } from '@devatlas/api-client';
import { webEnv } from '../../../lib/env';

export interface GuideListResponse {
  data: GuideListItem[];
  meta: PaginationMeta;
}

const guidesClient = new GuidesClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getGuides(params?: GuideListParams): Promise<GuideListResponse> {
  const response = await guidesClient.list(params);
  return {
    data: response.data,
    meta: response.meta,
  };
}
