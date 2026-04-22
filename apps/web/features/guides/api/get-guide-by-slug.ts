import type { GuideDetail } from '@devatlas/types';

import { guidesClient } from '../../../lib/api-client';

export async function getGuideBySlug(slug: string): Promise<GuideDetail> {
  const response = await guidesClient.getBySlug(slug);
  return response.data as GuideDetail;
}
