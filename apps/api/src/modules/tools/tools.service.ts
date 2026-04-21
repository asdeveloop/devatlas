import type { Tool, ToolDetail, ToolListItem } from '@devatlas/types';
import { Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';

import type { CreateToolDto } from './dto/create-tool.dto';
import type { ToolQueryDto } from './dto/tool-query.dto';
import type { UpdateToolDto } from './dto/update-tool.dto';
import { ToolMapper } from './mapper/tool.mapper';
import type { ToolsRepository } from './tools.repository';

@Injectable()
export class ToolsService {
  constructor(private readonly repo: ToolsRepository) {}

  async list(query: ToolQueryDto): Promise<{
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
    const result = await this.repo.findAll(query);
    const items = await Promise.all(result.data.map(async (tool) => this.repo.findBySlug(tool.slug)));

    return {
      data: items.filter((tool): tool is NonNullable<typeof tool> => Boolean(tool)).map((tool) => ToolMapper.toSummary(tool)),
      meta: result.meta,
    };
  }

  async get(slug: string): Promise<ToolDetail> {
    const tool = await this.repo.findBySlug(slug);
    if (!tool) throw ErrorFactory.ToolNotFound();
    return ToolMapper.toDetail(tool);
  }

  async create(dto: CreateToolDto): Promise<ToolDetail> {
    if (await this.repo.findBySlug(dto.slug)) {
      throw ErrorFactory.SlugConflict();
    }

    const tool = await this.repo.create(dto);
    if (!tool) throw ErrorFactory.ToolNotFound();
    return ToolMapper.toDetail(tool);
  }

  async update(slug: string, dto: UpdateToolDto): Promise<ToolDetail> {
    const tool = await this.repo.findBySlug(slug);
    if (!tool) throw ErrorFactory.ToolNotFound();

    const updatedTool = await this.repo.update(slug, dto);
    if (!updatedTool) throw ErrorFactory.ToolNotFound();
    return ToolMapper.toDetail(updatedTool);
  }

  async delete(slug: string): Promise<Tool> {
    const tool = await this.repo.findBySlug(slug);
    if (!tool) throw ErrorFactory.ToolNotFound();

    const deletedTool = await this.repo.delete(slug);
    if (!deletedTool) throw ErrorFactory.ToolNotFound();
    return ToolMapper.toDomain(deletedTool);
  }
}
