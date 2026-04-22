import type { SearchResponse } from '@devatlas/types';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';

import { RateLimit } from '../../common/security/rate-limit.decorator';
import { RateLimitGuard } from '../../common/security/rate-limit.guard';

import type { SearchRequestDto } from './dto/search-request.dto';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(RateLimitGuard)
@RateLimit({ bucket: 'search' })
export class SearchController {
  constructor(@Inject(SearchService) private readonly service: SearchService) {}

  @Post()
  async search(@Body() dto: SearchRequestDto): Promise<SearchResponse> {
    return this.service.search(dto);
  }
}
