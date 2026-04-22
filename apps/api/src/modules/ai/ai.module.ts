import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RateLimitGuard } from '../../common/security/rate-limit.guard';
import { DatabaseModule } from '../database/database.module';
import { SearchModule } from '../search/search.module';

import { AiAnswerRepository } from './ai-answer.repository';
import { AiSummaryRepository } from './ai-summary.repository';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule, DatabaseModule, SearchModule],
  controllers: [AiController],
  providers: [AiService, AiSummaryRepository, AiAnswerRepository, RateLimitGuard],
  exports: [AiService],
})
export class AiModule {}
