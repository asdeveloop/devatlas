import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { ToolQueryDto } from './dto/tool-query.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ToolsService } from './tools.service';

@Controller('tools')
export class ToolsController {
  constructor(private readonly service: ToolsService) {}

  @Get()
  async list(@Query() query: ToolQueryDto) {
    return this.service.list(query);
  }

  @Get(':slug')
  async get(@Param('slug') slug: string) {
    return this.service.get(slug);
  }

  @Post()
  async create(@Body() dto: CreateToolDto) {
    return this.service.create(dto);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() dto: UpdateToolDto) {
    return this.service.update(slug, dto);
  }

  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    return this.service.delete(slug);
  }
}
