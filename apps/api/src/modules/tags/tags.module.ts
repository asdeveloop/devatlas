import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { TagsController } from './tags.controller';
import { TagsRepository } from './tags.repository';
import { TagsService } from './tags.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
})
export class TagsModule {}
