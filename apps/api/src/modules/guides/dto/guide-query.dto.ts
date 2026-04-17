import { ContentStatus, Difficulty } from '@devatlas/types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../../common/dto/base-query.dto';

export class GuideQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
