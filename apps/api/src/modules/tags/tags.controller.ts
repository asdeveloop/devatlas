import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagQueryDto } from './dto/tag-query.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly service: TagsService) {}

  @Get()
  async list(@Query() query: TagQueryDto) {
    return this.service.list(query);
  }

  @Get(':slug')
  async get(@Param('slug') slug: string) {
    return this.service.get(slug);
  }

  @Post()
  async create(@Body() dto: CreateTagDto) {
    return this.service.create(dto);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() dto: UpdateTagDto) {
    return this.service.update(slug, dto);
  }

  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    return this.service.delete(slug);
  }
}
