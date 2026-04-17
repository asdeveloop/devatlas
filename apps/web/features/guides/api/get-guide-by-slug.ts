import type { GuideDetail } from '@devatlas/types';
import { GuidesClient, HttpClient } from '@devatlas/api-client';
import { webEnv } from '../../../lib/env';

const guidesClient = new GuidesClient(
  new HttpClient({
    baseUrl: webEnv.apiBaseUrl,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  }),
);

export async function getGuideBySlug(slug: string): Promise<GuideDetail> {
  const response = await guidesClient.getBySlug(slug);
  return response.data;
}
