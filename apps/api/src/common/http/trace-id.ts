import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

const TRACE_HEADER = 'x-trace-id';

type TraceableRequest = Request & {
  traceId?: string;
};

export function ensureTraceId(request: Request, response?: Response): string {
  const traceableRequest = request as TraceableRequest;
  const headerValue = request.headers[TRACE_HEADER];
  const incomingTraceId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  const traceId = traceableRequest.traceId ?? incomingTraceId ?? randomUUID();

  traceableRequest.traceId = traceId;

  if (response) {
    response.setHeader(TRACE_HEADER, traceId);
    response.locals.traceId = traceId;
  }

  return traceId;
}
