import { EntityType, RelationType } from '@devatlas/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CreateContentRelationDto {
  @ApiProperty({ enum: EntityType })
  @IsEnum(EntityType)
  sourceType!: EntityType;

  @ApiProperty()
  @IsUUID()
  sourceId!: string;

  @ApiProperty({ enum: EntityType })
  @IsEnum(EntityType)
  targetType!: EntityType;

  @ApiProperty()
  @IsUUID()
  targetId!: string;

  @ApiProperty({ enum: RelationType })
  @IsEnum(RelationType)
  relationType!: RelationType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  weight?: number;
}
