import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { GuidesController } from './guides.controller';
import { GuidesRepository } from './guides.repository';
import { GuidesService } from './guides.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GuidesController],
  providers: [GuidesService, GuidesRepository],
  exports: [GuidesService],
})
export class GuidesModule {}
