/** متادیتای صفحه‌بندی */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** پاسخ صفحه‌بندی شده — generic */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** پارامترهای صفحه‌بندی در query string */
export interface PaginationParams {
  page?: number;
  limit?: number;
}
