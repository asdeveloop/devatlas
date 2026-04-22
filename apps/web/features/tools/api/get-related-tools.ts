import type { RelatedContentItem, RelationType } from '@devatlas/types';

import { toolsClient } from '../../../lib/api-client';

export async function getRelatedTools(id: string): Promise<RelatedContentItem[]> {
  const response = await toolsClient.getRelated(id);
  return response.data.map((item) => ({
    ...item,
    relationType: item.relationType as RelationType,
  }));
}
