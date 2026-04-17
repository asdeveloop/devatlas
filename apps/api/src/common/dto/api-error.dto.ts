import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({ example: 'GUIDE_NOT_FOUND' })
  code: string;

  @ApiProperty({ example: 'Guide not found' })
  message: string;

  @ApiProperty({ example: 404 })
  status: number;
}
