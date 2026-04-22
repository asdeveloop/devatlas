import { HttpStatus, Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { DomainError } from '../errors/domain-error';

import { RATE_LIMIT_META_KEY, type RateLimitOptions } from './rate-limit.decorator';

type BucketName = NonNullable<RateLimitOptions['bucket']>;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly buckets = new Map<string, RateLimitEntry>();

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    this.pruneExpiredBuckets(Date.now());

    const options = this.reflector.getAllAndOverride<RateLimitOptions | undefined>(RATE_LIMIT_META_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const now = Date.now();
    const windowMs = this.configService.get<number>('app.rateLimit.windowMs', 60_000);
    const max = this.getBucketLimit(options.bucket);
    const key = `${options.bucket}:${this.resolveClientKey(request)}`;
    const current = this.buckets.get(key);

    if (!current || current.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (current.count >= max) {
      throw new DomainError('RATE_LIMITED', 'Too many requests. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    current.count += 1;
    return true;
  }

  private pruneExpiredBuckets(now: number) {
    for (const [key, entry] of this.buckets.entries()) {
      if (entry.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }

  private getBucketLimit(bucket: BucketName): number {
    if (bucket === 'ai') {
      return this.configService.get<number>('app.rateLimit.aiMax', 10);
    }

    return this.configService.get<number>('app.rateLimit.searchMax', 30);
  }

  private resolveClientKey(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
      return forwardedFor.split(',')[0]?.trim() || request.ip || 'anonymous';
    }

    return request.ip || 'anonymous';
  }
}
