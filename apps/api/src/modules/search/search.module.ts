import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RateLimitGuard } from '../../common/security/rate-limit.guard';
import { DatabaseModule } from '../database/database.module';

import { SearchIndexingService } from './search-indexing.service';
import { SearchController } from './search.controller';
import { SearchRepository } from './search.repository';
import { SearchService } from './search.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository, SearchIndexingService, RateLimitGuard],
  exports: [SearchService, SearchIndexingService],
})
export class SearchModule {}
