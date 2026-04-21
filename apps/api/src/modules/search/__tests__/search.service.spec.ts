import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SearchIndexingService } from '../search-indexing.service';
import type { SearchRepository } from '../search.repository';
import { SearchService } from '../search.service';

const mockRepository = (): Record<keyof SearchRepository, ReturnType<typeof vi.fn>> => ({
  search: vi.fn(),
  logQuery: vi.fn(),
  replaceIndexWithGuides: vi.fn(),
  replaceIndexWithTools: vi.fn(),
});

const mockIndexingService = (): Record<keyof SearchIndexingService, ReturnType<typeof vi.fn>> => ({
  syncSearchDocuments: vi.fn(),
});

describe('SearchService', () => {
  let service: SearchService;
  let repository: ReturnType<typeof mockRepository>;
  let indexingService: ReturnType<typeof mockIndexingService>;

  beforeEach(() => {
    repository = mockRepository();
    indexingService = mockIndexingService();
    service = new SearchService(
      repository as unknown as SearchRepository,
      indexingService as unknown as SearchIndexingService,
    );
  });

  it('syncs the index, returns mapped results, and logs the query', async () => {
    indexingService.syncSearchDocuments.mockResolvedValue(undefined);
    repository.search.mockResolvedValue([
      {
        id: 'guide-1',
        contentType: 'guide',
        title: 'React Search Patterns',
        description: 'Search UX guide',
        category: 'frontend',
        url: '/guides/react-search-patterns',
        tags: ['react'],
        score: 0.82,
      },
    ]);
    repository.logQuery.mockResolvedValue(undefined);

    await expect(service.search({ query: '  React search  ', limit: 5 })).resolves.toStrictEqual({
      query: 'React search',
      total: 1,
      results: [
        {
          id: 'guide-1',
          contentType: 'guide',
          title: 'React Search Patterns',
          description: 'Search UX guide',
          category: 'frontend',
          url: '/guides/react-search-patterns',
          tags: ['react'],
          score: 0.82,
        },
      ],
    });

    expect(indexingService.syncSearchDocuments).toHaveBeenCalledTimes(1);
    expect(repository.search).toHaveBeenCalledWith('React search', 5);
    expect(repository.logQuery).toHaveBeenCalledWith('React search', 1);
  });
});
