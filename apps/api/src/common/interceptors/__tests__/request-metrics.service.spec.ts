import { describe, expect, it } from 'vitest';

import { RequestMetricsService } from '../request-metrics.service';

describe('RequestMetricsService', () => {
  it('tracks error rate and public failure counters', () => {
    const service = new RequestMetricsService();

    service.record({
      method: 'GET',
      route: '/health',
      statusCode: 200,
      durationMs: 10,
    });
    service.record({
      method: 'POST',
      route: '/search',
      statusCode: 400,
      durationMs: 12,
      errorCode: 'BAD_REQUEST',
    });
    service.record({
      method: 'POST',
      route: '/ai/ask',
      statusCode: 429,
      durationMs: 15,
      errorCode: 'RATE_LIMITED',
    });

    expect(service.snapshot()).toMatchObject({
      totalRequests: 3,
      totalErrors: 2,
      errorRate: 66.67,
      validationFailures: 1,
      rateLimitedRequests: 1,
    });
  });
});
