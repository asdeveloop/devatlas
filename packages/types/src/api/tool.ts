import type { ToolStatus } from '../content/enums';
import type { ToolSummary, ToolWithRelations } from '../content/tool';
import type { PaginationParams } from './pagination';

// ── Query Params ─────────────────────────────────────

export interface ToolListParams extends PaginationParams {
  categorySlug?: string;
  tagSlug?: string;
  status?: ToolStatus;
  search?: string;
  sortBy?: 'name' | 'popularityScore' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ── Request Bodies ───────────────────────────────────

export interface CreateToolBody {
  name: string;
  slug: string;
  description: string;
  website?: string;
  github?: string;
  categoryId: string;
  tagIds?: string[];
  status?: ToolStatus;
}

export interface UpdateToolBody {
  name?: string;
  slug?: string;
  description?: string;
  website?: string | null;
  github?: string | null;
  categoryId?: string;
  tagIds?: string[];
  status?: ToolStatus;
}

// ── Response Payloads ────────────────────────────────

export type ToolListItem = ToolSummary;
export type ToolDetail = ToolWithRelations;
