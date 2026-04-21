import { ToolPrice, ToolTier } from '@devatlas/types';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { categories, tags } from '../../../db/schema';
import { createTestDatabase, hasTestDatabaseConfig } from '../../../testing/test-db';
import type { DrizzleService } from '../../database/drizzle.service';
import { ToolsRepository } from '../tools.repository';

const describeIfDb = hasTestDatabaseConfig ? describe.sequential : describe.skip;

describeIfDb('ToolsRepository', () => {
  let testDb: ReturnType<typeof createTestDatabase>;
  let repository: ToolsRepository;

  beforeAll(async () => {
    testDb = createTestDatabase();
    repository = new ToolsRepository({ db: testDb.db } as unknown as DrizzleService);
    await testDb.reset();
  });

  beforeEach(async () => {
    await testDb.reset();
  });

  afterAll(async () => {
    await testDb.close();
  });

  it('creates and loads tool relations', async () => {
    const [category] = await testDb.db.insert(categories).values({ name: 'AI', slug: 'ai' }).returning();
    const [tagA] = await testDb.db.insert(tags).values({ name: 'LLM', slug: 'llm' }).returning();
    const [tagB] = await testDb.db.insert(tags).values({ name: 'Assistant', slug: 'assistant' }).returning();

    const created = await repository.create({
      name: 'DevAtlas AI',
      slug: 'devatlas-ai',
      description: 'Internal assistant',
      website: 'https://example.com',
      github: 'https://github.com/example/devatlas-ai',
      tier: ToolTier.PRO,
      price: ToolPrice.PAID,
      categoryId: category.id,
      tagIds: [tagA.id, tagB.id],
    });

    expect(created?.category?.slug).toBe('ai');
    expect(created?.tags.map((tag) => tag.slug).sort()).toEqual(['assistant', 'llm']);

    const list = await repository.findAll({ page: 1, pageSize: 10, categorySlug: 'ai', tagSlug: 'llm' });
    expect(list.data).toHaveLength(1);
    expect(list.data[0]?.slug).toBe('devatlas-ai');

    const bySlug = await repository.findBySlug('devatlas-ai');
    expect(bySlug?.tags).toHaveLength(2);

    const updated = await repository.update('devatlas-ai', {
      slug: 'devatlas-assistant',
      name: 'DevAtlas Assistant',
      active: false,
      tagIds: [tagB.id],
    });

    expect(updated?.slug).toBe('devatlas-assistant');
    expect(updated?.active).toBe(false);
    expect(updated?.tags.map((tag) => tag.slug)).toEqual(['assistant']);

    const deleted = await repository.delete('devatlas-assistant');
    expect(deleted?.slug).toBe('devatlas-assistant');
    expect(await repository.findBySlug('devatlas-assistant')).toBeNull();
  });
});
