import { ContentStatus, Difficulty } from '@devatlas/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

import { BaseQueryDto } from '../../../common/dto/base-query.dto';

export const guideSortFields = ['createdAt', 'readingTime', 'title'] as const;
export type GuideSortField = (typeof guideSortFields)[number];

export class GuideQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: Difficulty })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tagSlug?: string;

  @ApiPropertyOptional({ enum: guideSortFields, default: 'createdAt' })
  @IsOptional()
  @IsIn(guideSortFields)
  declare sortBy?: GuideSortField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  declare order?: 'asc' | 'desc';

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  override skip?: number = 0;

  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  override take?: number = 20;
}
