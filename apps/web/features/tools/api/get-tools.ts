import { HttpClient, ToolsClient } from '@devatlas/api-client';
import type { PaginationMeta, ToolListItem, ToolListParams } from '@devatlas/types';

import { webEnv } from '../../../lib/env';

export interface ToolListResponse {
  data: ToolListItem[];
  meta: PaginationMeta;
}

const toolsClient = new ToolsClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getTools(params?: ToolListParams): Promise<ToolListResponse> {
  const response = await toolsClient.list(params);
  return {
    data: response.data,
    meta: response.meta,
  };
}
