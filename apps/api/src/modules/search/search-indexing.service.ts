import { Inject, Injectable } from '@nestjs/common';

import { SearchRepository } from './search.repository';

@Injectable()
export class SearchIndexingService {
  constructor(@Inject(SearchRepository) private readonly repo: SearchRepository) {}

  async rebuildSearchDocuments(): Promise<void> {
    await this.repo.replaceIndexWithGuides();
    await this.repo.replaceIndexWithTools();
  }
}
