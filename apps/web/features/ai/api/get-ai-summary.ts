import { AiClient, HttpClient } from '@devatlas/api-client';
import type { AiContentType, AiSummary } from '@devatlas/types';

import { webEnv } from '../../../lib/env';

const aiClient = new AiClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getAiSummary(contentType: AiContentType, slug: string): Promise<AiSummary> {
  const response = await aiClient.getSummary({ contentType, slug });
  return response.data;
}
