import { HttpClient, ToolsClient } from '@devatlas/api-client';
import type { RelatedContentItem } from '@devatlas/types';

import { webEnv } from '../../../lib/env';

const toolsClient = new ToolsClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getRelatedTools(id: string): Promise<RelatedContentItem[]> {
  const response = await toolsClient.getRelated(id);
  return response.data;
}
