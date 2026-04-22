import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_META_KEY = 'rate_limit';

export interface RateLimitOptions {
  bucket: 'search' | 'ai';
}

export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_META_KEY, options);
