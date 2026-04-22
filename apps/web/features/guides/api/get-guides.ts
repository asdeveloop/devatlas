import type { GuideListParams, GuideListItem, PaginationMeta } from '@devatlas/types';

import { guidesClient } from '../../../lib/api-client';

export interface GuideListResponse {
  data: GuideListItem[];
  meta: PaginationMeta;
}

export async function getGuides(params?: GuideListParams): Promise<GuideListResponse> {
  const response = await guidesClient.list(params);
  return {
    data: response.data as GuideListItem[],
    meta: response.meta,
  };
}
