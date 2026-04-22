import type { ToolDetail, ToolStatus } from '@devatlas/types';

import { toolsClient } from '../../../lib/api-client';

export async function getToolBySlug(slug: string): Promise<ToolDetail> {
  const response = await toolsClient.getBySlug(slug);
  return {
    ...response.data,
    status: response.data.status as ToolStatus,
    category: {
      ...response.data.category,
      description: response.data.category.description ?? null,
      createdAt: response.data.category.createdAt ?? response.data.createdAt,
      updatedAt: response.data.category.updatedAt ?? response.data.updatedAt,
    },
    tags: response.data.tags.map((tag) => ({
      ...tag,
      createdAt: tag.createdAt ?? response.data.createdAt,
      updatedAt: tag.updatedAt ?? response.data.updatedAt,
    })),
  };
}
