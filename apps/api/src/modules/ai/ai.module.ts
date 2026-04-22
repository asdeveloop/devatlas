import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { SearchModule } from '../search/search.module';

import { AiAnswerRepository } from './ai-answer.repository';
import { AiSummaryRepository } from './ai-summary.repository';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [DatabaseModule, SearchModule],
  controllers: [AiController],
  providers: [AiService, AiSummaryRepository, AiAnswerRepository],
  exports: [AiService],
})
export class AiModule {}
