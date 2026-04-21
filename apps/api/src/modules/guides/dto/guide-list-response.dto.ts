import { ApiProperty } from '@nestjs/swagger';

import { GuideListItemDto } from './guide-response.dto';

class GuideListMetaDto {
  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  hasNextPage!: boolean;

  @ApiProperty()
  hasPrevPage!: boolean;
}

export class GuideListResponseDto {
  @ApiProperty({ type: [GuideListItemDto] })
  data!: GuideListItemDto[];

  @ApiProperty({ type: GuideListMetaDto })
  meta!: GuideListMetaDto;
}
