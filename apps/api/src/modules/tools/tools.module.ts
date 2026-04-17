import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ToolsController } from './tools.controller';
import { ToolsRepository } from './tools.repository';
import { ToolsService } from './tools.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ToolsController],
  providers: [ToolsService, ToolsRepository],
})
export class ToolsModule {}
