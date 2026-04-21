import { ContentStatus, Difficulty, EntityType, RelationType, ToolPrice, ToolTier } from '@devatlas/types';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { categories, contentRelations, guides, searchQueries, tags, tools } from '../../db/schema';
import { createTestApp } from '../../testing/test-app';
import { createTestDatabase } from '../../testing/test-db';

const testDb = createTestDatabase();

describe('API contract', () => {
  let baseUrl: string;
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];
  let swaggerDocument: Awaited<ReturnType<typeof createTestApp>>['swaggerDocument'];

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    baseUrl = testApp.baseUrl;
    swaggerDocument = testApp.swaggerDocument;
  });

  beforeEach(async () => {
    await testDb.reset();
  });

  afterAll(async () => {
    await app.close();
    await testDb.close();
  });

  it('verifies GET /guides and GET /guides/:slug', async () => {
    const [category] = await testDb.db.insert(categories).values({ name: 'Frontend', slug: 'frontend' }).returning();
    const [tag] = await testDb.db.insert(tags).values({ name: 'React', slug: 'react' }).returning();
    await testDb.db.insert(guides).values({
      title: 'Archived Vue Notes',
      slug: 'archived-vue-notes',
      description: 'Ignore me',
      content: 'Draft content',
      readingTime: 5,
      difficulty: Difficulty.BEGINNER,
      status: ContentStatus.ARCHIVED,
      categoryId: category.id,
    });
    const [guide] = await testDb.db.insert(guides).values({
      title: 'React Patterns',
      slug: 'react-patterns',
      description: 'Useful patterns',
      content: 'Content body',
      readingTime: 8,
      difficulty: Difficulty.INTERMEDIATE,
      status: ContentStatus.PUBLISHED,
      categoryId: category.id,
    }).returning();
    await testDb.db.execute(sql`insert into guide_tags (guide_id, tag_id) values (${guide.id}, ${tag.id})`);

    const listRes = await fetch(`${baseUrl}/api/v1/guides?status=PUBLISHED&take=10&skip=0&sortBy=title&order=asc`);
    const listJson = await listRes.json();
    expect(listRes.status).toBe(200);
    expect(listJson.success).toBe(true);
    expect(listJson.data[0]).toMatchObject({
      slug: 'react-patterns',
      category: { slug: 'frontend' },
      tags: [{ slug: 'react' }],
    });
    expect(listJson.meta).toMatchObject({ total: 1, page: 1, limit: 10 });
    expect(listJson.data).toHaveLength(1);

    const detailRes = await fetch(`${baseUrl}/api/v1/guides/react-patterns`);
    const detailJson = await detailRes.json();
    expect(detailRes.status).toBe(200);
    expect(detailJson.data).toMatchObject({
      slug: 'react-patterns',
      title: 'React Patterns',
      category: { slug: 'frontend' },
      tags: [{ slug: 'react' }],
    });
  });

  it('verifies POST and PATCH guide flows', async () => {
    const [category] = await testDb.db.insert(categories).values({ name: 'Backend', slug: 'backend' }).returning();
    const [tagA] = await testDb.db.insert(tags).values({ name: 'NestJS', slug: 'nestjs' }).returning();
    const [tagB] = await testDb.db.insert(tags).values({ name: 'API', slug: 'api' }).returning();

    const createRes = await fetch(`${baseUrl}/api/v1/guides`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'NestJS Basics',
        slug: 'nestjs-basics',
        description: 'Intro guide',
        content: 'Guide content',
        readingTime: 12,
        difficulty: Difficulty.BEGINNER,
        status: ContentStatus.PUBLISHED,
        categoryId: category.id,
        tagIds: [tagA.id, tagB.id],
      }),
    });
    const createJson = await createRes.json();
    expect(createRes.status).toBe(201);
    expect(createJson.data).toMatchObject({
      slug: 'nestjs-basics',
      tags: [{ slug: 'nestjs' }, { slug: 'api' }],
    });

    const patchRes = await fetch(`${baseUrl}/api/v1/guides/${createJson.data.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'NestJS Advanced',
        slug: 'nestjs-advanced',
        tagIds: [tagB.id],
      }),
    });
    const patchJson = await patchRes.json();
    expect(patchRes.status).toBe(200);
    expect(patchJson.data).toMatchObject({
      slug: 'nestjs-advanced',
      title: 'NestJS Advanced',
      tags: [{ slug: 'api' }],
    });
  });

  it('verifies GET /tools and GET /tools/:slug', async () => {
    const [category] = await testDb.db.insert(categories).values({ name: 'AI', slug: 'ai' }).returning();
    const [tag] = await testDb.db.insert(tags).values({ name: 'LLM', slug: 'llm' }).returning();
    await testDb.db.insert(tools).values({
      name: 'Starter Tool',
      slug: 'starter-tool',
      description: 'Lower popularity',
      website: 'https://example.com/starter-tool',
      tier: ToolTier.FREE,
      price: ToolPrice.FREE,
      categoryId: category.id,
      popularity: 7,
    });
    const [tool] = await testDb.db.insert(tools).values({
      name: 'DevAtlas AI',
      slug: 'devatlas-ai',
      description: 'Assistant',
      website: 'https://example.com',
      github: 'https://github.com/example/devatlas-ai',
      tier: ToolTier.PRO,
      price: ToolPrice.PAID,
      categoryId: category.id,
      popularity: 42,
    }).returning();
    await testDb.db.execute(sql`insert into tool_tags (tool_id, tag_id) values (${tool.id}, ${tag.id})`);

    const listRes = await fetch(`${baseUrl}/api/v1/tools?page=1&pageSize=10&categorySlug=ai&tagSlug=llm`);
    const listJson = await listRes.json();
    expect(listRes.status).toBe(200);
    expect(listJson.data[0]).toMatchObject({
      slug: 'devatlas-ai',
      category: { slug: 'ai' },
      tags: [{ slug: 'llm' }],
    });
    expect(listJson.meta).toMatchObject({ total: 1, page: 1, limit: 10 });
    expect(listJson.data).toHaveLength(1);

    const detailRes = await fetch(`${baseUrl}/api/v1/tools/devatlas-ai`);
    const detailJson = await detailRes.json();
    expect(detailRes.status).toBe(200);
    expect(detailJson.data).toMatchObject({
      slug: 'devatlas-ai',
      name: 'DevAtlas AI',
      category: { slug: 'ai' },
      tags: [{ slug: 'llm' }],
    });
  });

  it('verifies POST and PUT tool flows', async () => {
    const [category] = await testDb.db.insert(categories).values({ name: 'Productivity', slug: 'productivity' }).returning();
    const [tagA] = await testDb.db.insert(tags).values({ name: 'CLI', slug: 'cli' }).returning();
    const [tagB] = await testDb.db.insert(tags).values({ name: 'Automation', slug: 'automation' }).returning();

    const createRes = await fetch(`${baseUrl}/api/v1/tools`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Task Runner',
        slug: 'task-runner',
        description: 'Automates chores',
        website: 'https://example.com/task-runner',
        github: 'https://github.com/example/task-runner',
        tier: ToolTier.FREE,
        price: ToolPrice.FREE,
        categoryId: category.id,
        tagIds: [tagA.id, tagB.id],
      }),
    });
    const createJson = await createRes.json();
    expect(createRes.status).toBe(201);
    expect(createJson.data).toMatchObject({ slug: 'task-runner' });

    const putRes = await fetch(`${baseUrl}/api/v1/tools/task-runner`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Task Runner Pro',
        slug: 'task-runner-pro',
        active: false,
        tagIds: [tagB.id],
      }),
    });
    const putJson = await putRes.json();
    expect(putRes.status).toBe(200);
    expect(putJson.data).toMatchObject({
      slug: 'task-runner-pro',
      name: 'Task Runner Pro',
      status: 'ARCHIVED',
      tags: [{ slug: 'automation' }],
    });
  });

  it('verifies POST /search and query logging', async () => {
    const [category] = await testDb.db.insert(categories).values({ name: 'Frontend', slug: 'frontend' }).returning();
    const [tag] = await testDb.db.insert(tags).values({ name: 'React', slug: 'react' }).returning();
    const [guide] = await testDb.db.insert(guides).values({
      title: 'React Search Patterns',
      slug: 'react-search-patterns',
      description: 'Search UX guide',
      content: 'Build a fast search experience with React components.',
      readingTime: 6,
      difficulty: Difficulty.BEGINNER,
      status: ContentStatus.PUBLISHED,
      categoryId: category.id,
    }).returning();
    await testDb.db.execute(sql`insert into guide_tags (guide_id, tag_id) values (${guide.id}, ${tag.id})`);

    const [tool] = await testDb.db.insert(tools).values({
      name: 'React Search Kit',
      slug: 'react-search-kit',
      description: 'Tooling for search indexing',
      website: 'https://example.com/react-search-kit',
      tier: ToolTier.FREE,
      price: ToolPrice.FREE,
      active: true,
      categoryId: category.id,
    }).returning();
    await testDb.db.execute(sql`insert into tool_tags (tool_id, tag_id) values (${tool.id}, ${tag.id})`);

    const searchRes = await fetch(`${baseUrl}/api/v1/search`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'React search', limit: 5 }),
    });
    const searchJson = await searchRes.json();

    expect(searchRes.status).toBe(201);
    expect(searchJson.data).toMatchObject({
      query: 'React search',
      total: 2,
      results: [
        expect.objectContaining({
          contentType: 'guide',
          title: 'React Search Patterns',
          category: 'frontend',
          tags: ['react'],
        }),
        expect.objectContaining({
          contentType: 'tool',
          title: 'React Search Kit',
          category: 'frontend',
          tags: ['react'],
        }),
      ],
    });

    const loggedQueries = await testDb.db.select().from(searchQueries);
    expect(loggedQueries).toHaveLength(1);
    expect(loggedQueries[0]).toMatchObject({
      query: 'React search',
      resultsCount: 2,
    });
  });

  it('verifies content relation creation and related lookups', async () => {
    const [category] = await testDb.db.insert(categories).values({ name: 'Frontend', slug: 'frontend' }).returning();
    const [tag] = await testDb.db.insert(tags).values({ name: 'React', slug: 'react' }).returning();
    const [sourceGuide] = await testDb.db.insert(guides).values({
      title: 'React Foundations',
      slug: 'react-foundations',
      description: 'Core guide',
      content: 'Start here',
      readingTime: 5,
      difficulty: Difficulty.BEGINNER,
      status: ContentStatus.PUBLISHED,
      categoryId: category.id,
    }).returning();
    const [relatedGuide] = await testDb.db.insert(guides).values({
      title: 'Advanced Hooks',
      slug: 'advanced-hooks',
      description: 'Deep dive',
      content: 'Hooks content',
      readingTime: 9,
      difficulty: Difficulty.ADVANCED,
      status: ContentStatus.PUBLISHED,
      categoryId: category.id,
    }).returning();
    await testDb.db.execute(sql`insert into guide_tags (guide_id, tag_id) values (${relatedGuide.id}, ${tag.id})`);

    const [tool] = await testDb.db.insert(tools).values({
      name: 'Hook Inspector',
      slug: 'hook-inspector',
      description: 'Inspect React hooks',
      website: 'https://example.com/hook-inspector',
      tier: ToolTier.FREE,
      price: ToolPrice.FREE,
      active: true,
      categoryId: category.id,
      popularity: 15,
    }).returning();

    const createRes = await fetch(`${baseUrl}/api/v1/content-relations`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        sourceType: EntityType.GUIDE,
        sourceId: sourceGuide.id,
        targetType: EntityType.GUIDE,
        targetId: relatedGuide.id,
        relationType: RelationType.PREREQUISITE,
        weight: 0.9,
      }),
    });
    const createJson = await createRes.json();
    expect(createRes.status).toBe(201);
    expect(createJson.data).toMatchObject({
      sourceType: EntityType.GUIDE,
      sourceId: sourceGuide.id,
      targetType: EntityType.GUIDE,
      targetId: relatedGuide.id,
      relationType: RelationType.PREREQUISITE,
      weight: 0.9,
    });

    await testDb.db.insert(contentRelations).values({
      sourceType: EntityType.GUIDE,
      sourceId: sourceGuide.id,
      targetType: EntityType.TOOL,
      targetId: tool.id,
      relationType: RelationType.ALTERNATIVE,
      weight: 0.7,
    });

    const guideRelationsRes = await fetch(`${baseUrl}/api/v1/guides/${sourceGuide.id}/related`);
    const guideRelationsJson = await guideRelationsRes.json();
    expect(guideRelationsRes.status).toBe(200);
    expect(guideRelationsJson.data).toEqual([
      expect.objectContaining({
        id: relatedGuide.id,
        slug: 'advanced-hooks',
        contentType: 'guide',
        relationType: RelationType.PREREQUISITE,
        category: { slug: 'frontend', name: 'Frontend', id: category.id },
        tags: [{ slug: 'react', name: 'React', id: tag.id }],
      }),
      expect.objectContaining({
        id: tool.id,
        slug: 'hook-inspector',
        contentType: 'tool',
        relationType: RelationType.ALTERNATIVE,
      }),
    ]);

    const [sourceTool] = await testDb.db.insert(tools).values({
      name: 'React Starter',
      slug: 'react-starter',
      description: 'Starter tool',
      website: 'https://example.com/react-starter',
      tier: ToolTier.FREE,
      price: ToolPrice.FREE,
      active: true,
      categoryId: category.id,
      popularity: 3,
    }).returning();
    await testDb.db.insert(contentRelations).values({
      sourceType: EntityType.TOOL,
      sourceId: sourceTool.id,
      targetType: EntityType.GUIDE,
      targetId: relatedGuide.id,
      relationType: RelationType.MENTIONS,
      weight: 0.4,
    });

    const toolRelationsRes = await fetch(`${baseUrl}/api/v1/tools/${sourceTool.id}/related`);
    const toolRelationsJson = await toolRelationsRes.json();
    expect(toolRelationsRes.status).toBe(200);
    expect(toolRelationsJson.data).toEqual([
      expect.objectContaining({
        id: relatedGuide.id,
        slug: 'advanced-hooks',
        contentType: 'guide',
        relationType: RelationType.MENTIONS,
      }),
    ]);
  });

  it('verifies category and tag list/create endpoints', async () => {
    const categoryRes = await fetch(`${baseUrl}/api/v1/categories`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Data', slug: 'data', icon: 'database' }),
    });
    const categoryJson = await categoryRes.json();
    expect(categoryRes.status).toBe(201);
    expect(categoryJson.data).toMatchObject({ slug: 'data', description: 'database' });

    const categoryListRes = await fetch(`${baseUrl}/api/v1/categories?page=1&pageSize=10`);
    const categoryListJson = await categoryListRes.json();
    expect(categoryListRes.status).toBe(200);
    expect(categoryListJson.data[0]).toMatchObject({ slug: 'data' });
    expect(categoryListJson.meta).toMatchObject({ page: 1, limit: 10, total: 1 });

    const tagRes = await fetch(`${baseUrl}/api/v1/tags`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'GraphQL', slug: 'graphql' }),
    });
    const tagJson = await tagRes.json();
    expect(tagRes.status).toBe(201);
    expect(tagJson.data).toMatchObject({ slug: 'graphql' });

    const tagListRes = await fetch(`${baseUrl}/api/v1/tags?page=1&pageSize=10`);
    const tagListJson = await tagListRes.json();
    expect(tagListRes.status).toBe(200);
    expect(tagListJson.data[0]).toMatchObject({ slug: 'graphql' });
    expect(tagListJson.meta).toMatchObject({ page: 1, limit: 10, total: 1 });
  });

  it('verifies swagger paths include the active endpoints', () => {
    expect(swaggerDocument.paths['/api/v1/guides']).toMatchObject({
      get: expect.any(Object),
      post: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/guides/{slug}']).toMatchObject({
      get: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/guides/{id}/related']).toMatchObject({
      get: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/guides/{id}']).toMatchObject({
      patch: expect.any(Object),
      delete: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/tools']).toMatchObject({
      get: expect.any(Object),
      post: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/tools/{slug}']).toMatchObject({
      get: expect.any(Object),
      put: expect.any(Object),
      delete: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/tools/{id}/related']).toMatchObject({
      get: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/content-relations']).toMatchObject({
      post: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/categories']).toMatchObject({
      get: expect.any(Object),
      post: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/tags']).toMatchObject({
      get: expect.any(Object),
      post: expect.any(Object),
    });
    expect(swaggerDocument.paths['/api/v1/health']).toMatchObject({
      get: expect.any(Object),
    });
  });
});
