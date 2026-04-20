import { ContentStatus, Difficulty } from '@devatlas/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
