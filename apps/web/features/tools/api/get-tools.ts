import type { PaginationMeta, ToolListItem, ToolListParams, ToolStatus } from '@devatlas/types';

import { toolsClient } from '../../../lib/api-client';

export interface ToolListResponse {
  data: ToolListItem[];
  meta: PaginationMeta;
}

export async function getTools(params?: ToolListParams): Promise<ToolListResponse> {
  const response = await toolsClient.list(params);
  return {
    data: response.data.map((item) => ({
      ...item,
      status: item.status as ToolStatus,
    })),
    meta: response.meta,
  };
}
