import type { AiAnswer, AiContentType, AiSummary } from '../content/ai';

export interface AskAiBody {
  question: string;
  limit?: number;
}

export interface GetAiSummaryParams {
  contentType: AiContentType;
  slug: string;
}

export type AskAiResponse = AiAnswer;
export type AiSummaryDetail = AiSummary;
