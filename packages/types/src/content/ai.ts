export type AiContentType = 'guide' | 'tool';

export interface AiSummary {
  id: string;
  contentType: AiContentType;
  contentId: string;
  slug: string;
  title: string;
  summary: string;
  model: string;
  createdAt: string;
}

export interface AiAnswerSource {
  contentType: AiContentType;
  title: string;
  slug: string;
  url: string;
  summary: string;
}

export interface AiAnswer {
  id: string;
  question: string;
  answer: string;
  sources: AiAnswerSource[];
  createdAt: string;
}
