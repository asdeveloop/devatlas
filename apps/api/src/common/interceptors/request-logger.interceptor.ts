import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DomainError } from '../errors/domain-error';
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
        error: (error: unknown) => {
          const resolvedError = this.resolveError(error, response.statusCode);
          this.recordRequest(
            method,
            routePath,
            resolvedError.statusCode,
            Date.now() - start,
            traceId,
            originalUrl,
            resolvedError.code,
          );
        },
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
    errorCode?: string,
  ): void {
    this.requestMetrics.record({
      method,
      route,
      statusCode,
      durationMs,
      errorCode,
    });

    const errorSuffix = errorCode ? ` errorCode=${errorCode}` : '';
    this.logger.log(`${method} ${originalUrl} ${statusCode} +${durationMs}ms traceId=${traceId}${errorSuffix}`);
  }

  private resolveError(error: unknown, fallbackStatusCode: number): { statusCode: number; code?: string } {
    if (error instanceof DomainError) {
      return {
        statusCode: error.status,
        code: error.code,
      };
    }

    if (error instanceof HttpException) {
      const response = error.getResponse();
      const code =
        typeof response === 'object' && response !== null && 'error' in response && typeof response.error === 'string'
          ? response.error.toUpperCase().replace(/\s+/g, '_')
          : 'BAD_REQUEST';

      return {
        statusCode: error.getStatus(),
        code,
      };
    }

    return {
      statusCode: fallbackStatusCode >= 400 ? fallbackStatusCode : 500,
      code: 'UNKNOWN_ERROR',
    };
  }
}
