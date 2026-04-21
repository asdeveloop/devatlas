import type { Tool, ToolDetail, ToolListItem } from '@devatlas/types';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import type { CreateToolDto } from './dto/create-tool.dto';
import type { ToolQueryDto } from './dto/tool-query.dto';
import type { UpdateToolDto } from './dto/update-tool.dto';
import type { ToolsService } from './tools.service';

@Controller('tools')
export class ToolsController {
  constructor(private readonly service: ToolsService) {}

  @Get()
  async list(@Query() query: ToolQueryDto): Promise<{
    data: ToolListItem[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    return this.service.list(query);
  }

  @Get(':slug')
  async get(@Param('slug') slug: string): Promise<ToolDetail> {
    return this.service.get(slug);
  }

  @Post()
  async create(@Body() dto: CreateToolDto): Promise<ToolDetail> {
    return this.service.create(dto);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() dto: UpdateToolDto): Promise<ToolDetail> {
    return this.service.update(slug, dto);
  }

  @Delete(':slug')
  async remove(@Param('slug') slug: string): Promise<Tool> {
    return this.service.delete(slug);
  }
}
