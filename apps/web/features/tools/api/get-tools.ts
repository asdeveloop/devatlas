import { HttpClient, ToolsClient } from '@devatlas/api-client';
import { webEnv } from '../../../lib/env';

const toolsClient = new ToolsClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getTools(params?: Record<string, string | number | undefined>) {
  const response = await toolsClient.list(params);
  return {
    data: response.data,
    meta: response.meta,
  };
}
