import { GuidesClient, HttpClient } from '@devatlas/api-client';
import type { RelatedContentItem } from '@devatlas/types';

import { webEnv } from '../../../lib/env';

const guidesClient = new GuidesClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getRelatedGuides(id: string): Promise<RelatedContentItem[]> {
  const response = await guidesClient.getRelated(id);
  return response.data;
}
