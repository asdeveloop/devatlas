import { ApiProperty } from '@nestjs/swagger';

import { GuideResponseDto } from './guide-response.dto';

export class GuideListResponseDto {
  @ApiProperty({ type: [GuideResponseDto] })
  items: GuideResponseDto[];
}
