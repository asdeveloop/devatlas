import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { GuidesModule } from '../guides/guides.module';
import { ToolsModule } from '../tools/tools.module';

import { ContentRelationsController } from './content-relations.controller';
import { ContentRelationsRepository } from './content-relations.repository';
import { ContentRelationsService } from './content-relations.service';

@Module({
  imports: [DatabaseModule, GuidesModule, ToolsModule],
  controllers: [ContentRelationsController],
  providers: [ContentRelationsRepository, ContentRelationsService],
})
export class ContentRelationsModule {}
