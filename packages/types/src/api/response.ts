/** پاسخ موفق استاندارد — همیشه همین فرمت */
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

/** پاسخ صفحه‌بندی‌شده — data آرایه‌ای و meta شامل pagination */
export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}
