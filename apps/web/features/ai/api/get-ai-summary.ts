import type { AiContentType, AiSummary } from '@devatlas/types';

import { aiClient } from '../../../lib/api-client';

export async function getAiSummary(contentType: AiContentType, slug: string): Promise<AiSummary> {
  const response = await aiClient.getSummary({ contentType, slug });
  return response.data;
}
