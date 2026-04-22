import { Inject, Injectable } from '@nestjs/common';

import { aiAnswers } from '../../db/schema';
import { DrizzleService } from '../database/drizzle.service';

import type { AiAnswerSource } from './ai.service';

export type AiAnswerRecord = {
  id: string;
  question: string;
  answer: string;
  sources: AiAnswerSource[];
  createdAt: Date;
};

@Injectable()
export class AiAnswerRepository {
  constructor(@Inject(DrizzleService) private readonly drizzle: DrizzleService) {}

  async create(input: {
    question: string;
    answer: string;
    sources: AiAnswerSource[];
  }): Promise<AiAnswerRecord> {
    const [record] = await this.drizzle.db
      .insert(aiAnswers)
      .values(input)
      .returning()
      .execute();

    return record as AiAnswerRecord;
  }
}
