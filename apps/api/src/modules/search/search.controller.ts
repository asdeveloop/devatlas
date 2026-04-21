import type { SearchResponse } from '@devatlas/types';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import type { SearchRequestDto } from './dto/search-request.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(@Inject(SearchService) private readonly service: SearchService) {}

  @Post()
  async search(@Body() dto: SearchRequestDto): Promise<SearchResponse> {
    return this.service.search(dto);
  }
}
