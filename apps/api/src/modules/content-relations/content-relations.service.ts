import { EntityType, type ContentRelation, type RelatedContentItem, type RelationType } from '@devatlas/types';
import { Inject, Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';
import { GuidesService } from '../guides/guides.service';
import { ToolsService } from '../tools/tools.service';

import { ContentRelationsRepository } from './content-relations.repository';
import type { CreateContentRelationDto } from './dto/create-content-relation.dto';

@Injectable()
export class ContentRelationsService {
  constructor(
    @Inject(ContentRelationsRepository) private readonly repo: ContentRelationsRepository,
    @Inject(GuidesService) private readonly guidesService: GuidesService,
    @Inject(ToolsService) private readonly toolsService: ToolsService,
  ) {}

  async create(dto: CreateContentRelationDto): Promise<ContentRelation> {
    await Promise.all([
      this.ensureEntityExists(dto.sourceType, dto.sourceId),
      this.ensureEntityExists(dto.targetType, dto.targetId),
    ]);

    const relation = await this.repo.createRelation(dto);

    return {
      id: relation.id,
      sourceType: relation.sourceType as EntityType,
      sourceId: relation.sourceId,
      targetType: relation.targetType as EntityType,
      targetId: relation.targetId,
      relationType: relation.relationType as RelationType,
      weight: relation.weight,
      createdAt: relation.createdAt.toISOString(),
    };
  }

  async getRelatedGuides(guideId: string): Promise<RelatedContentItem[]> {
    await this.ensureEntityExists(EntityType.GUIDE, guideId);
    return this.repo.findRelatedBySource(EntityType.GUIDE, guideId);
  }

  async getRelatedTools(toolId: string): Promise<RelatedContentItem[]> {
    await this.ensureEntityExists(EntityType.TOOL, toolId);
    return this.repo.findRelatedBySource(EntityType.TOOL, toolId);
  }

  private async ensureEntityExists(type: EntityType, id: string): Promise<void> {
    if (type === EntityType.GUIDE) {
      if (!(await this.guidesService.existsById(id))) {
        throw ErrorFactory.GuideNotFound();
      }
      return;
    }

    if (!(await this.toolsService.existsById(id))) {
      throw ErrorFactory.ToolNotFound();
    }
  }
}
