import type { AiAnswer, AiSummary } from '@devatlas/types';
import { Inject, Injectable } from '@nestjs/common';

import { ErrorFactory } from '../../common/errors/error.factory';
import { SearchService } from '../search/search.service';

import { AiAnswerRepository } from './ai-answer.repository';
import { AiSummaryRepository, type AiContentType, type AiSummarySource } from './ai-summary.repository';
import type { AskAiDto } from './dto/ask-ai.dto';

export type AiAnswerSource = {
  contentType: AiContentType;
  title: string;
  slug: string;
  url: string;
  summary: string;
};

@Injectable()
export class AiService {
  private readonly model = 'deterministic-local-v1';

  constructor(
    @Inject(AiSummaryRepository) private readonly summaries: AiSummaryRepository,
    @Inject(AiAnswerRepository) private readonly answers: AiAnswerRepository,
    @Inject(SearchService) private readonly searchService: SearchService,
  ) {}

  async getSummary(contentType: string, slug: string): Promise<AiSummary> {
    const normalizedType = this.normalizeContentType(contentType);
    const source = await this.summaries.findSourceBySlug(normalizedType, slug);

    if (!source) {
      throw this.buildNotFoundError(normalizedType);
    }

    const existing = await this.summaries.findLatestByContent(normalizedType, source.contentId);
    const record = existing ?? await this.summaries.saveSummary({
      contentType: normalizedType,
      contentId: source.contentId,
      summary: this.composeSummary(source),
      model: this.model,
    });

    return {
      id: record.id,
      contentType: normalizedType,
      contentId: source.contentId,
      slug: source.slug,
      title: source.title,
      summary: record.summary,
      model: record.model,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async syncSummaries(): Promise<{ created: number }> {
    const sources = await this.summaries.listSourcesMissingSummaries();

    await Promise.all(
      sources.map((source) => this.summaries.saveSummary({
        contentType: source.contentType,
        contentId: source.contentId,
        summary: this.composeSummary(source),
        model: this.model,
      })),
    );

    return { created: sources.length };
  }

  async ask(dto: AskAiDto): Promise<AiAnswer> {
    await this.syncSummaries();

    const searchResult = await this.searchService.search({
      query: dto.question,
      limit: dto.limit,
    });

    const sources: AiAnswerSource[] = [];
    for (const item of searchResult.results.slice(0, dto.limit)) {
      const slug = this.extractSlug(item.url);
      if (!slug) {
        continue;
      }

      const summary = await this.getSummary(item.contentType, slug);
      sources.push({
        contentType: summary.contentType,
        title: summary.title,
        slug: summary.slug,
        url: item.url,
        summary: summary.summary,
      });
    }

    const answerText = this.composeAnswer(dto.question, sources);
    const answer = await this.answers.create({
      question: dto.question,
      answer: answerText,
      sources,
    });

    return {
      id: answer.id,
      question: answer.question,
      answer: answer.answer,
      sources: answer.sources,
      createdAt: answer.createdAt.toISOString(),
    };
  }

  private composeSummary(source: AiSummarySource): string {
    const intro = source.description || source.body || `${source.title} is part of the DevAtlas catalog.`;
    const snippet = this.cleanText(intro);
    const tagText = source.tags.length ? ` Key topics: ${source.tags.slice(0, 4).join(', ')}.` : '';

    if (source.contentType === 'guide') {
      const difficulty = source.metadata['difficulty'];
      return this.limitText(
        `${source.title} is a ${difficulty ?? 'practical'} guide in ${source.category}. ${snippet}.${tagText}`,
      );
    }

    const tier = source.metadata['tier'];
    const price = source.metadata['price'];
    return this.limitText(
      `${source.title} is a ${String(tier ?? 'general').toLowerCase()} ${String(price ?? 'mixed').toLowerCase()} tool in ${source.category}. ${snippet}.${tagText}`,
    );
  }

  private composeAnswer(question: string, sources: AiAnswerSource[]): string {
    if (!sources.length) {
      return `I could not find indexed DevAtlas content that answers: ${question}`;
    }

    const lead = `Based on ${sources.length} relevant DevAtlas source${sources.length > 1 ? 's' : ''}, here is the best answer to "${question}":`;
    const details = sources.map((source) => `${source.title}: ${source.summary}`).join(' ');
    return this.limitText(`${lead} ${details}`, 900);
  }

  private extractSlug(url: string): string | null {
    const parts = url.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] ?? null : null;
  }

  private normalizeContentType(contentType: string): AiContentType {
    if (contentType === 'guide' || contentType === 'tool') {
      return contentType;
    }

    throw ErrorFactory.InvalidAiContentType();
  }

  private buildNotFoundError(contentType: AiContentType) {
    return contentType === 'guide' ? ErrorFactory.GuideNotFound() : ErrorFactory.ToolNotFound();
  }

  private cleanText(value: string): string {
    return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private limitText(value: string, maxLength = 320): string {
    const compact = value.replace(/\s+/g, ' ').trim();
    if (compact.length <= maxLength) {
      return compact;
    }

    return `${compact.slice(0, maxLength - 1).trimEnd()}...`;
  }
}
