import { Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';

import type { CreateTagDto } from './dto/create-tag.dto';
import type { TagQueryDto } from './dto/tag-query.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';
import type { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(private readonly repo: TagsRepository) {}

  async list(query: TagQueryDto) {
    return this.repo.findAll(query);
  }

  async get(slug: string) {
    const tag = await this.repo.findBySlug(slug);
    if (!tag) throw ErrorFactory.TagNotFound();
    return tag;
  }

  async create(dto: CreateTagDto) {
    const exists = await this.repo.findBySlug(dto.slug);
    if (exists) throw ErrorFactory.SlugConflict();
    return this.repo.create(dto);
  }

  async update(slug: string, dto: UpdateTagDto) {
    const exists = await this.repo.findBySlug(slug);
    if (!exists) throw ErrorFactory.TagNotFound();
    return this.repo.update(slug, dto);
  }

  async delete(slug: string) {
    const exists = await this.repo.findBySlug(slug);
    if (!exists) throw ErrorFactory.TagNotFound();
    return this.repo.delete(slug);
  }
}
