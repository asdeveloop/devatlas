import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DomainError } from '../errors/domain-error';
import { ensureTraceId } from '../http/trace-id';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    const traceId = ensureTraceId(request, response);

    if (exception instanceof DomainError) {
      return response.status(exception.status).json({
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
          status: exception.status,
        },
        meta: {
          path: request.url,
          method: request.method,
        },
        traceId,
        timestamp,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      const message =
        typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
          ? errorResponse.message
          : exception.message;

      return response.status(status).json({
        success: false,
        error: {
          code: HttpStatus[status] ?? 'HTTP_EXCEPTION',
          message,
          status,
        },
        meta: {
          path: request.url,
          method: request.method,
        },
        traceId,
        timestamp,
      });
    }

    console.error(exception);

    return response.status(500).json({
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Internal server error',
        status: 500,
      },
      meta: {
        path: request.url,
        method: request.method,
      },
      traceId,
      timestamp,
    });
  }
}
