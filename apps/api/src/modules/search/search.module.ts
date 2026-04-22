import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { SearchIndexingService } from './search-indexing.service';
import { SearchController } from './search.controller';
import { SearchRepository } from './search.repository';
import { SearchService } from './search.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository, SearchIndexingService],
  exports: [SearchService, SearchIndexingService],
})
export class SearchModule {}
