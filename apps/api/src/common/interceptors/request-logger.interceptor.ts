import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ensureTraceId } from '../http/trace-id';

import { RequestMetricsService } from './request-metrics.service';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(@Inject(RequestMetricsService) private readonly requestMetrics: RequestMetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const traceId = ensureTraceId(request, response);

    const { method, originalUrl, route } = request;
    const routePath = route?.path ?? originalUrl;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => this.recordRequest(method, routePath, response.statusCode, Date.now() - start, traceId, originalUrl),
        error: () => this.recordRequest(method, routePath, response.statusCode, Date.now() - start, traceId, originalUrl),
      }),
    );
  }

  private recordRequest(
    method: string,
    route: string,
    statusCode: number,
    durationMs: number,
    traceId: string,
    originalUrl: string,
  ): void {
    this.requestMetrics.record({
      method,
      route,
      statusCode,
      durationMs,
    });

    this.logger.log(`${method} ${originalUrl} ${statusCode} +${durationMs}ms traceId=${traceId}`);
  }
}
