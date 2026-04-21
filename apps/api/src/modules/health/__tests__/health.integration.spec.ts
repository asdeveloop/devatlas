import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestDatabase, hasTestDatabaseConfig } from '../../../testing/test-db';
import type { DrizzleService } from '../../database/drizzle.service';
import { HealthController } from '../health.controller';

const describeIfDb = hasTestDatabaseConfig ? describe.sequential : describe.skip;

describeIfDb('HealthController integration', () => {
  let testDb: ReturnType<typeof createTestDatabase>;
  let controller: HealthController;

  beforeAll(async () => {
    testDb = createTestDatabase();
    controller = new HealthController({ db: testDb.db } as unknown as DrizzleService);
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
  });
});
