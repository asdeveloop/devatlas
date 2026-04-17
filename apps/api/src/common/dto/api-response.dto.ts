// PATH: apps/api/src/common/dto/api-response.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({ example: 'GUIDE_NOT_FOUND', description: 'کد یکتای خطا.' })
  code: string;

  @ApiProperty({ example: 'Guide not found', description: 'پیام خطا.' })
  message: string;

  @ApiProperty({ example: 404, description: 'کد وضعیت HTTP.' })
  status: number;
}

export class ApiResponseDto<T> {
  @ApiProperty({ example: true, description: 'وضعیت موفقیت عملیات.' })
  success: boolean;

  @ApiPropertyOptional({ type: ApiErrorDto, description: 'اطلاعات خطا در صورت شکست.' })
  error?: ApiErrorDto | null;

  @ApiPropertyOptional({ description: 'اطلاعات کمکی یا وضعیت (مثل pagination).' })
  meta?: Record<string, unknown>;

  @ApiProperty({ example: '9b3c8cb6-47a0-4c42-9b18-9837cdbd0eb7', description: 'شناسه رهگیری درخواست.' })
  traceId: string;

  @ApiProperty({ example: '2026-04-15T12:00:00.000Z', description: 'زمان تولید پاسخ.' })
  timestamp: string;

  @ApiPropertyOptional({ description: 'داده اصلی پاسخ.' })
  data?: T;
}
