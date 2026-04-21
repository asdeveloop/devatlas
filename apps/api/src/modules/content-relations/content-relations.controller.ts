import type { ContentRelation, RelatedContentItem } from '@devatlas/types';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';

import { ContentRelationsService } from './content-relations.service';
import type { CreateContentRelationDto } from './dto/create-content-relation.dto';

@Controller()
export class ContentRelationsController {
  constructor(@Inject(ContentRelationsService) private readonly service: ContentRelationsService) {}

  @Post('content-relations')
  async create(@Body() dto: CreateContentRelationDto): Promise<ContentRelation> {
    return this.service.create(dto);
  }

  @Get('guides/:id/related')
  async getGuideRelations(@Param('id') id: string): Promise<RelatedContentItem[]> {
    return this.service.getRelatedGuides(id);
  }

  @Get('tools/:id/related')
  async getToolRelations(@Param('id') id: string): Promise<RelatedContentItem[]> {
    return this.service.getRelatedTools(id);
  }
}
