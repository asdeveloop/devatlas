import type { Guide, GuideDetail, GuideListItem } from '@devatlas/types';
import { Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';

import type { CreateGuideDto } from './dto/create-guide.dto';
import type { GuideQueryDto } from './dto/guide-query.dto';
import type { UpdateGuideDto } from './dto/update-guide.dto';
import type { GuidesListResult, GuidesRepository } from './guides.repository';
import { GuideMapper } from './mapper/guide.mapper';

@Injectable()
export class GuidesService {
  constructor(private readonly repo: GuidesRepository) {}

  async findAll(query: GuideQueryDto): Promise<GuidesListResult<GuideListItem>> {
    const result = await this.repo.findAll(query);

    return {
      data: result.data.map((guide) => GuideMapper.toSummary(guide)),
      meta: result.meta,
    };
  }

  async findBySlug(slug: string): Promise<GuideDetail> {
    const entity = await this.repo.findBySlug(slug);
    if (!entity) {
      throw ErrorFactory.GuideNotFound();
    }

    return GuideMapper.toDetail(entity);
  }

  async create(dto: CreateGuideDto): Promise<GuideDetail> {
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

  async update(id: string, dto: UpdateGuideDto): Promise<GuideDetail> {
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

  async delete(id: string): Promise<Guide> {
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
