import { HttpClient, ToolsClient } from '@devatlas/api-client';
import type { ToolDetail } from '@devatlas/types';

import { webEnv } from '../../../lib/env';

const toolsClient = new ToolsClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getToolBySlug(slug: string): Promise<ToolDetail> {
  const response = await toolsClient.getBySlug(slug);
  return response.data;
}
