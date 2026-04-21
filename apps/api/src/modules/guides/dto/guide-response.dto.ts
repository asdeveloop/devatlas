import { ContentStatus, Difficulty } from '@devatlas/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GuideCategorySummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;
}

class GuideCategoryDto extends GuideCategorySummaryDto {
  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

class GuideTagDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class GuideResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional()
  description!: string;

  @ApiPropertyOptional()
  content!: string;

  @ApiPropertyOptional({ enum: Difficulty })
  difficulty!: Difficulty;

  @ApiPropertyOptional()
  readingTime!: number;

  @ApiProperty({ enum: ContentStatus })
  status!: ContentStatus;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty({ type: GuideCategoryDto })
  category!: GuideCategoryDto;

  @ApiProperty({ type: [GuideTagDto] })
  tags!: GuideTagDto[];

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class GuideListItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional()
  description!: string;

  @ApiPropertyOptional({ enum: Difficulty })
  difficulty!: Difficulty;

  @ApiPropertyOptional()
  readingTime!: number;

  @ApiProperty({ enum: ContentStatus })
  status!: ContentStatus;

  @ApiProperty({ type: GuideCategorySummaryDto })
  category!: GuideCategorySummaryDto;

  @ApiProperty({ type: [GuideCategorySummaryDto] })
  tags!: Array<Pick<GuideTagDto, 'id' | 'slug' | 'name'>>;

  @ApiProperty()
  createdAt!: string;
}
