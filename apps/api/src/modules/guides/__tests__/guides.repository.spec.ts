import { ContentStatus, Difficulty } from '@devatlas/types';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { categories, tags } from '../../../db/schema';
import { createTestDatabase, hasTestDatabaseConfig } from '../../../testing/test-db';
import type { DrizzleService } from '../../database/drizzle.service';
import { GuidesRepository } from '../guides.repository';

const describeIfDb = hasTestDatabaseConfig ? describe.sequential : describe.skip;

describeIfDb('GuidesRepository', () => {
  let testDb: ReturnType<typeof createTestDatabase>;
  let repository: GuidesRepository;

  beforeAll(async () => {
    testDb = createTestDatabase();
    repository = new GuidesRepository({ db: testDb.db } as unknown as DrizzleService);
    await testDb.reset();
  });

  beforeEach(async () => {
    await testDb.reset();
  });

  afterAll(async () => {
    await testDb.close();
  });

  it('creates and loads guide relations', async () => {
    const [category] = await testDb.db.insert(categories).values({ name: 'Frontend', slug: 'frontend' }).returning();
    const [tagA] = await testDb.db.insert(tags).values({ name: 'React', slug: 'react' }).returning();
    const [tagB] = await testDb.db.insert(tags).values({ name: 'Next.js', slug: 'nextjs' }).returning();

    const created = await repository.create({
      title: 'React Patterns',
      slug: 'react-patterns',
      description: 'Useful patterns',
      content: 'content',
      readingTime: 8,
      difficulty: Difficulty.INTERMEDIATE,
      status: ContentStatus.PUBLISHED,
      categoryId: category.id,
      tagIds: [tagA.id, tagB.id],
    });

    expect(created?.category?.slug).toBe('frontend');
    expect(created?.tags.map((tag) => tag.slug).sort()).toEqual(['nextjs', 'react']);

    const list = await repository.findAll({ take: 10, skip: 0, status: ContentStatus.PUBLISHED });
    expect(list.data).toHaveLength(1);
    expect(list.data[0]?.slug).toBe('react-patterns');
    expect(list.meta.total).toBe(1);

    const bySlug = await repository.findBySlug('react-patterns');
    expect(bySlug?.tags).toHaveLength(2);

    const updated = await repository.update(created!.id, {
      title: 'Advanced React Patterns',
      slug: 'advanced-react-patterns',
      readingTime: 10,
      difficulty: Difficulty.ADVANCED,
      tagIds: [tagB.id],
    });

    expect(updated?.slug).toBe('advanced-react-patterns');
    expect(updated?.readingTime).toBe(10);
    expect(updated?.tags.map((tag) => tag.slug)).toEqual(['nextjs']);

    const deleted = await repository.delete(created!.id);
    expect(deleted?.id).toBe(created?.id);
    expect(await repository.count()).toBe(0);
  });
});
