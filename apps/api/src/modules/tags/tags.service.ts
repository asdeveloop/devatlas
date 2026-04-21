import type { Tag, TagListItem } from '@devatlas/types';
import { Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';

import type { CreateTagDto } from './dto/create-tag.dto';
import type { TagQueryDto } from './dto/tag-query.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';
import { TagMapper } from './mapper/tag.mapper';
import type { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(private readonly repo: TagsRepository) {}

  async list(query: TagQueryDto): Promise<{
    data: TagListItem[];
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
    return {
      data: result.data.map((tag) => TagMapper.toDomain(tag)),
      meta: result.meta,
    };
  }

  async get(slug: string): Promise<Tag> {
    const tag = await this.repo.findBySlug(slug);
    if (!tag) throw ErrorFactory.TagNotFound();
    return TagMapper.toDomain(tag);
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    const exists = await this.repo.findBySlug(dto.slug);
    if (exists) throw ErrorFactory.SlugConflict();
    return TagMapper.toDomain(await this.repo.create(dto));
  }

  async update(slug: string, dto: UpdateTagDto): Promise<Tag> {
    const exists = await this.repo.findBySlug(slug);
    if (!exists) throw ErrorFactory.TagNotFound();
    return TagMapper.toDomain(await this.repo.update(slug, dto));
  }

  async delete(slug: string): Promise<Tag> {
    const exists = await this.repo.findBySlug(slug);
    if (!exists) throw ErrorFactory.TagNotFound();
    return TagMapper.toDomain(await this.repo.delete(slug));
  }
}
