import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { RequestMetricsService } from '../../../common/interceptors/request-metrics.service';
import { createTestDatabase, hasTestDatabaseConfig } from '../../../testing/test-db';
import type { DrizzleService } from '../../database/drizzle.service';
import { HealthService } from '../health.service';

const describeIfDb = hasTestDatabaseConfig ? describe.sequential : describe.skip;

describeIfDb('HealthService integration', () => {
  let testDb: ReturnType<typeof createTestDatabase>;
  let service: HealthService;

  beforeAll(async () => {
    testDb = createTestDatabase();
    const requestMetrics = new RequestMetricsService();
    requestMetrics.record({
      method: 'GET',
      route: '/api/v1/health',
      statusCode: 200,
      durationMs: 12,
    });
    requestMetrics.record({
      method: 'GET',
      route: '/api/v1/guides/:slug',
      statusCode: 404,
      durationMs: 320,
      errorCode: 'BAD_REQUEST',
    });
    requestMetrics.record({
      method: 'POST',
      route: '/api/v1/search',
      statusCode: 429,
      durationMs: 22,
      errorCode: 'RATE_LIMITED',
    });
    service = new HealthService(
      { db: testDb.db } as unknown as DrizzleService,
      requestMetrics,
    );
    await testDb.reset();
  });

  afterAll(async () => {
    await testDb.close();
  });

  it('reports a healthy database connection', async () => {
    const result = await service.getHealthReport();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('connected');
    expect(result.service).toBe('devatlas-api');
    expect(result.timestamp).toMatch(/T/);
    expect(result.metrics).toMatchObject({
      totalRequests: 3,
      totalErrors: 2,
      errorRate: 66.67,
      validationFailures: 1,
      rateLimitedRequests: 1,
    });
    expect(result.metrics.statusClasses).toContainEqual({ label: '2xx', count: 1 });
    expect(result.metrics.statusClasses).toContainEqual({ label: '4xx', count: 2 });
    expect(result.metrics.durationBuckets).toContainEqual({ label: '<100ms', count: 2 });
    expect(result.metrics.durationBuckets).toContainEqual({ label: '300ms+', count: 1 });
    expect(result.metrics.routes).toContainEqual(
      expect.objectContaining({
        key: 'GET /api/v1/health',
        count: 1,
      }),
    );
  });

  it('reports live and ready states', async () => {
    const live = service.getLiveness();
    const ready = await service.getReadiness();

    expect(live).toMatchObject({
      status: 'ok',
      service: 'devatlas-api',
    });
    expect(ready).toMatchObject({
      status: 'ready',
      database: 'connected',
      service: 'devatlas-api',
    });
  });
});
