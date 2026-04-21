import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { tags } from '../../../db/schema';
import { createTestDatabase, hasTestDatabaseConfig } from '../../../testing/test-db';
import type { DrizzleService } from '../../database/drizzle.service';
import { TagsRepository } from '../tags.repository';

const describeIfDb = hasTestDatabaseConfig ? describe.sequential : describe.skip;

describeIfDb('TagsRepository', () => {
  let testDb: ReturnType<typeof createTestDatabase>;
  let repository: TagsRepository;

  beforeAll(async () => {
    testDb = createTestDatabase();
    repository = new TagsRepository({ db: testDb.db } as unknown as DrizzleService);
    await testDb.reset();
  });

  beforeEach(async () => {
    await testDb.reset();
  });

  afterAll(async () => {
    await testDb.close();
  });

  it('creates, lists, finds, updates, and deletes tags', async () => {
    const created = await repository.create({ name: 'TypeScript', slug: 'typescript' });
    expect(created.slug).toBe('typescript');

    await repository.create({ name: 'AI', slug: 'ai' });

    const list = await repository.findAll({ page: 1, pageSize: 10 });
    expect(list.data.map((item) => item.slug)).toEqual(['ai', 'typescript']);
    expect(list.meta.total).toBe(2);

    const found = await repository.findBySlug('typescript');
    expect(found?.name).toBe('TypeScript');

    const updated = await repository.update('typescript', { name: 'TS' });
    expect(updated?.name).toBe('TS');

    const deleted = await repository.delete('typescript');
    expect(deleted?.slug).toBe('typescript');

    const remaining = await testDb.db.select().from(tags);
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.slug).toBe('ai');
  });
});
