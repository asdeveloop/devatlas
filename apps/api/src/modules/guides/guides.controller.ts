import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';

import type { CreateGuideDto } from './dto/create-guide.dto';
import type { GuideQueryDto } from './dto/guide-query.dto';
import type { UpdateGuideDto } from './dto/update-guide.dto';
import { GuidesService } from './guides.service';

@Controller('guides')
export class GuidesController {
  constructor(@Inject(GuidesService) private readonly service: GuidesService) {}

  @Get()
  findAll(@Query() query: GuideQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Post()
  create(@Body() dto: CreateGuideDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGuideDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
