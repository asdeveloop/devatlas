import { ApiResponse } from './response';

/** پاسخ خطای استاندارد — مطابق HttpExceptionFilter */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]> | string[];
  path: string;
  timestamp: string;
}

/** Union type برای هر پاسخ API */
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;
