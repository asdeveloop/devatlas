import { Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';

import type { CreateGuideDto } from './dto/create-guide.dto';
import type { GuideQueryDto } from './dto/guide-query.dto';
import type { UpdateGuideDto } from './dto/update-guide.dto';
import type { GuidesRepository } from './guides.repository';
import { type GuideRecord, type GuidesListResult } from './guides.repository';
import { GuideMapper } from './mapper/guide.mapper';

@Injectable()
export class GuidesService {
  constructor(private readonly repo: GuidesRepository) {}

  async findAll(query: GuideQueryDto): Promise<GuidesListResult> {
    return this.repo.findAll(query);
  }

  async findBySlug(slug: string) {
    const entity = await this.repo.findBySlug(slug);
    if (!entity) {
      throw ErrorFactory.GuideNotFound();
    }

    return GuideMapper.toDetail(entity);
  }

  async create(dto: CreateGuideDto) {
    const exists = await this.repo.findBySlug(dto.slug);
    if (exists) {
      throw ErrorFactory.SlugConflict();
    }

    const entity = await this.repo.create(dto);
    if (!entity) {
      throw ErrorFactory.GuideNotFound();
    }
    return GuideMapper.toDetail(entity);
  }

  async update(id: string, dto: UpdateGuideDto) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw ErrorFactory.GuideNotFound();
    }

    const entity = await this.repo.update(id, dto);
    if (!entity) {
      throw ErrorFactory.GuideNotFound();
    }
    return GuideMapper.toDetail(entity);
  }

  async delete(id: string): Promise<GuideRecord> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw ErrorFactory.GuideNotFound();
    }

    const entity = await this.repo.delete(id);
    if (!entity) {
      throw ErrorFactory.GuideNotFound();
    }
    return GuideMapper.toDomain(entity);
  }
}
