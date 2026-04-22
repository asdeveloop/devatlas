import type { RelatedContentItem } from '@devatlas/types';

import { guidesClient } from '../../../lib/api-client';

export async function getRelatedGuides(id: string): Promise<RelatedContentItem[]> {
  const response = await guidesClient.getRelated(id);
  return response.data as RelatedContentItem[];
}
