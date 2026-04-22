import type { AiAnswer, AiSummary } from '@devatlas/types';
import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';

import { RateLimit } from '../../common/security/rate-limit.decorator';
import { RateLimitGuard } from '../../common/security/rate-limit.guard';

import { AiService } from './ai.service';
import type { AskAiDto } from './dto/ask-ai.dto';

@Controller('ai')
@UseGuards(RateLimitGuard)
@RateLimit({ bucket: 'ai' })
export class AiController {
  constructor(@Inject(AiService) private readonly service: AiService) {}

  @Get('summaries/:contentType/:slug')
  getSummary(@Param('contentType') contentType: string, @Param('slug') slug: string): Promise<AiSummary> {
    return this.service.getSummary(contentType, slug);
  }

  @Post('ask')
  ask(@Body() dto: AskAiDto): Promise<AiAnswer> {
    return this.service.ask(dto);
  }
}
