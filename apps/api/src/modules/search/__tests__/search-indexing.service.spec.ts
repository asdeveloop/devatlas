import { describe, expect, it, vi } from 'vitest';

import { SearchIndexingService } from '../search-indexing.service';
import type { SearchRepository } from '../search.repository';

const mockRepository = (): Record<'replaceIndexWithGuides' | 'replaceIndexWithTools', ReturnType<typeof vi.fn>> => ({
  replaceIndexWithGuides: vi.fn(),
  replaceIndexWithTools: vi.fn(),
});

describe('SearchIndexingService', () => {
  it('returns an aggregated rebuild summary', async () => {
    const repository = mockRepository();
    repository.replaceIndexWithGuides.mockResolvedValue(12);
    repository.replaceIndexWithTools.mockResolvedValue(8);

    const service = new SearchIndexingService(repository as unknown as SearchRepository);
    const result = await service.rebuildSearchDocuments();

    expect(repository.replaceIndexWithGuides).toHaveBeenCalledTimes(1);
    expect(repository.replaceIndexWithTools).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      guides: 12,
      tools: 8,
      total: 20,
    });
  });
});
