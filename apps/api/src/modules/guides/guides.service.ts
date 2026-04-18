import { Injectable } from '@nestjs/common';
import { ErrorFactory } from '../../common/errors/error.factory';
import { CreateGuideDto } from './dto/create-guide.dto';
import { GuideQueryDto } from './dto/guide-query.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { GuideMapper } from './mapper/guide.mapper';
import { GuidesRepository } from './guides.repository';

@Injectable()
export class GuidesService {
  constructor(private readonly repo: GuidesRepository) {}

  async findAll(query: GuideQueryDto) {
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
    return GuideMapper.toDetail(entity);
  }

  async update(id: string, dto: UpdateGuideDto) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw ErrorFactory.GuideNotFound();
    }

    const entity = await this.repo.update(id, dto);
    return GuideMapper.toDetail(entity);
  }

  async delete(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw ErrorFactory.GuideNotFound();
    }

    const entity = await this.repo.delete(id);
    return GuideMapper.toDomain(entity);
  }
}
