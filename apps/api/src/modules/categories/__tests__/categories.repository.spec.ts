import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { categories } from '../../../db/schema';
import { createTestDatabase, hasTestDatabaseConfig } from '../../../testing/test-db';
import type { DrizzleService } from '../../database/drizzle.service';
import { CategoriesRepository } from '../categories.repository';

const describeIfDb = hasTestDatabaseConfig ? describe.sequential : describe.skip;

describeIfDb('CategoriesRepository', () => {
  let testDb: ReturnType<typeof createTestDatabase>;
  let repository: CategoriesRepository;

  beforeAll(async () => {
    testDb = createTestDatabase();
    repository = new CategoriesRepository({ db: testDb.db } as unknown as DrizzleService);
    await testDb.reset();
  });

  beforeEach(async () => {
    await testDb.reset();
  });

  afterAll(async () => {
    await testDb.close();
  });

  it('creates, lists, finds, updates, and deletes categories', async () => {
    const created = await repository.create({ name: 'Frontend', slug: 'frontend', icon: 'sparkles' });
    expect(created.slug).toBe('frontend');

    await repository.create({ name: 'Backend', slug: 'backend' });

    const list = await repository.findAll({ page: 1, pageSize: 10 });
    expect(list.data.map((item) => item.slug)).toEqual(['backend', 'frontend']);
    expect(list.meta.total).toBe(2);

    const found = await repository.findBySlug('frontend');
    expect(found?.name).toBe('Frontend');

    const updated = await repository.update('frontend', { name: 'Frontend Core', icon: null });
    expect(updated?.name).toBe('Frontend Core');
    expect(updated?.icon).toBeNull();

    const deleted = await repository.delete('frontend');
    expect(deleted?.slug).toBe('frontend');

    const remaining = await testDb.db.select().from(categories);
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.slug).toBe('backend');
  });
});
