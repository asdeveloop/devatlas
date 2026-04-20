import { ToolPrice, ToolTier } from '@devatlas/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ToolQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tagSlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional({ enum: ToolTier })
  @IsOptional()
  @IsEnum(ToolTier)
  tier?: ToolTier;

  @ApiPropertyOptional({ enum: ToolPrice })
  @IsOptional()
  @IsEnum(ToolPrice)
  price?: ToolPrice;
}
