import { Inject, Injectable } from '@nestjs/common';

import { SearchRepository } from './search.repository';

@Injectable()
export class SearchIndexingService {
  constructor(@Inject(SearchRepository) private readonly repo: SearchRepository) {}

  async rebuildSearchDocuments(): Promise<{ guides: number; tools: number; total: number }> {
    const guideCount = await this.repo.replaceIndexWithGuides();
    const toolCount = await this.repo.replaceIndexWithTools();

    return {
      guides: guideCount,
      tools: toolCount,
      total: guideCount + toolCount,
    };
  }
}
