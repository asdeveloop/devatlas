import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { RequestMetricsService } from '../../../common/interceptors/request-metrics.service';
import { createTestDatabase, hasTestDatabaseConfig } from '../../../testing/test-db';
import type { DrizzleService } from '../../database/drizzle.service';
import { HealthController } from '../health.controller';

const describeIfDb = hasTestDatabaseConfig ? describe.sequential : describe.skip;

describeIfDb('HealthController integration', () => {
  let testDb: ReturnType<typeof createTestDatabase>;
  let controller: HealthController;

  beforeAll(async () => {
    testDb = createTestDatabase();
    const requestMetrics = new RequestMetricsService();
    requestMetrics.record({
      method: 'GET',
      route: '/api/v1/health',
      statusCode: 200,
      durationMs: 12,
    });
    controller = new HealthController(
      { db: testDb.db } as unknown as DrizzleService,
      requestMetrics,
    );
    await testDb.reset();
  });

  afterAll(async () => {
    await testDb.close();
  });

  it('reports a healthy database connection', async () => {
    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('connected');
    expect(result.service).toBe('devatlas-api');
    expect(result.timestamp).toMatch(/T/);
    expect(result.metrics).toMatchObject({
      totalRequests: 1,
      totalErrors: 0,
    });
    expect(result.metrics.routes).toContainEqual(
      expect.objectContaining({
        key: 'GET /api/v1/health',
        count: 1,
      }),
    );
  });
});
