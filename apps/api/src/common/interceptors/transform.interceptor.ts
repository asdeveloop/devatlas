import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { ensureTraceId } from '../http/trace-id';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const traceId = ensureTraceId(request);

    return next.handle().pipe(
      map((payload: unknown) => {
        const timestamp = new Date().toISOString();

        if (payload && typeof payload === 'object' && 'data' in payload) {
          const response = payload as { data: unknown; meta?: Record<string, unknown> };
          return {
            success: true,
            data: response.data,
            ...(response.meta ? { meta: response.meta } : {}),
            traceId,
            timestamp,
          };
        }

        if (payload && typeof payload === 'object' && 'items' in payload) {
          const response = payload as { items: unknown; meta?: Record<string, unknown> };
          return {
            success: true,
            data: response.items,
            ...(response.meta ? { meta: response.meta } : {}),
            traceId,
            timestamp,
          };
        }

        return {
          success: true,
          data: payload,
          traceId,
          timestamp,
        };
      }),
    );
  }
}
