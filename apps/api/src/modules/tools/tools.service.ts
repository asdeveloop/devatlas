import { Injectable } from '@nestjs/common';
import { ErrorFactory } from '../../common/errors/error.factory';
import { CreateToolDto } from './dto/create-tool.dto';
import { ToolQueryDto } from './dto/tool-query.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ToolsRepository } from './tools.repository';

@Injectable()
export class ToolsService {
  constructor(private readonly repo: ToolsRepository) {}

  async list(query: ToolQueryDto) {
    return this.repo.findAll(query);
  }

  async get(slug: string) {
    const tool = await this.repo.findBySlug(slug);
    if (!tool) throw ErrorFactory.ToolNotFound();
    return tool;
  }

  async create(dto: CreateToolDto) {
    if (await this.repo.findBySlug(dto.slug)) {
      throw ErrorFactory.SlugConflict();
    }

    return this.repo.create(dto);
  }

  async update(slug: string, dto: UpdateToolDto) {
    const tool = await this.repo.findBySlug(slug);
    if (!tool) throw ErrorFactory.ToolNotFound();

    return this.repo.update(slug, dto);
  }

  async delete(slug: string) {
    const tool = await this.repo.findBySlug(slug);
    if (!tool) throw ErrorFactory.ToolNotFound();

    return this.repo.delete(slug);
  }
}
