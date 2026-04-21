import type { ToolPrice, ToolTier } from '../content/enums';
import type { ToolSummary, ToolWithRelations } from '../content/tool';

import type { PaginationParams } from './pagination';

export interface ToolListParams extends PaginationParams {
  categorySlug?: string;
  tagSlug?: string;
  tier?: ToolTier;
  price?: ToolPrice;
}

export interface CreateToolBody {
  name: string;
  slug: string;
  description?: string;
  website?: string;
  github?: string;
  icon?: string;
  active?: boolean;
  tier: ToolTier;
  price: ToolPrice;
  categoryId: string;
  tagIds?: string[];
}

export interface UpdateToolBody {
  name?: string;
  slug?: string;
  description?: string | null;
  website?: string | null;
  github?: string | null;
  icon?: string | null;
  active?: boolean;
  tier?: ToolTier;
  price?: ToolPrice;
  categoryId?: string;
  tagIds?: string[];
}

export type ToolListItem = ToolSummary;
export type ToolDetail = ToolWithRelations;
