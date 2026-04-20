import { Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';

import { CreateToolDto } from './dto/create-tool.dto';
import { ToolQueryDto } from './dto/tool-query.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import {
  type ToolListResult,
  type ToolRecord,
  type ToolWithRelations,
  ToolsRepository,
} from './tools.repository';

@Injectable()
export class ToolsService {
  constructor(private readonly repo: ToolsRepository) {}

  async list(query: ToolQueryDto): Promise<ToolListResult> {
    return this.repo.findAll(query);
  }

  async get(slug: string): Promise<ToolWithRelations> {
    const tool = await this.repo.findBySlug(slug);
    if (!tool) throw ErrorFactory.ToolNotFound();
    return tool;
  }

  async create(dto: CreateToolDto): Promise<ToolWithRelations> {
    if (await this.repo.findBySlug(dto.slug)) {
      throw ErrorFactory.SlugConflict();
    }

    const tool = await this.repo.create(dto);
    if (!tool) throw ErrorFactory.ToolNotFound();
    return tool;
  }

  async update(slug: string, dto: UpdateToolDto): Promise<ToolWithRelations> {
    const tool = await this.repo.findBySlug(slug);
    if (!tool) throw ErrorFactory.ToolNotFound();

    const updatedTool = await this.repo.update(slug, dto);
    if (!updatedTool) throw ErrorFactory.ToolNotFound();
    return updatedTool;
  }

  async delete(slug: string): Promise<ToolRecord | null> {
    const tool = await this.repo.findBySlug(slug);
    if (!tool) throw ErrorFactory.ToolNotFound();

    return this.repo.delete(slug);
  }
}
