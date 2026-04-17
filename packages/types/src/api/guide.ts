import type { ContentStatus, Difficulty } from '../content/enums';
import type { GuideSummary, GuideWithRelations } from '../content/guide';
import type { PaginationParams } from './pagination';

// ── Query Params ─────────────────────────────────────

export interface GuideListParams extends PaginationParams {
  categorySlug?: string;
  tagSlug?: string;
  difficulty?: Difficulty;
  status?: ContentStatus;
  search?: string;
  sortBy?: 'createdAt' | 'readingTime' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// ── Request Bodies ───────────────────────────────────

export interface CreateGuideBody {
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: Difficulty;
  readingTime: number;
  categoryId: string;
  tagIds?: string[];
  status?: ContentStatus;
}

export interface UpdateGuideBody {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  difficulty?: Difficulty;
  readingTime?: number;
  categoryId?: string;
  tagIds?: string[];
  status?: ContentStatus;
}

// ── Response Payloads ────────────────────────────────

/** پاسخ لیست راهنماها — خلاصه‌شده */
export type GuideListItem = GuideSummary;

/** پاسخ جزئیات یک راهنما — کامل با relations */
export type GuideDetail = GuideWithRelations;
