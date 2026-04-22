import type { ExecutionContext } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { RateLimitGuard } from '../rate-limit.guard';

function createContext(ip = '127.0.0.1'): ExecutionContext {
  return {
    getClass: vi.fn(),
    getHandler: vi.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        ip,
        headers: {},
      }),
    }),
  } as unknown as ExecutionContext;
}

describe('RateLimitGuard', () => {
  it('allows requests under the configured limit', () => {
    const reflector = {
      getAllAndOverride: vi.fn().mockReturnValue({ bucket: 'search' }),
    };
    const configService = {
      get: vi.fn((key: string, defaultValue?: number) => {
        if (key === 'app.rateLimit.windowMs') return 60_000;
        if (key === 'app.rateLimit.searchMax') return 2;
        return defaultValue;
      }),
    };
    const guard = new RateLimitGuard(reflector as never, configService as never);

    expect(guard.canActivate(createContext())).toBe(true);
    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('blocks requests once the bucket limit is exceeded', () => {
    const reflector = {
      getAllAndOverride: vi.fn().mockReturnValue({ bucket: 'ai' }),
    };
    const configService = {
      get: vi.fn((key: string, defaultValue?: number) => {
        if (key === 'app.rateLimit.windowMs') return 60_000;
        if (key === 'app.rateLimit.aiMax') return 1;
        return defaultValue;
      }),
    };
    const guard = new RateLimitGuard(reflector as never, configService as never);

    expect(guard.canActivate(createContext())).toBe(true);
    expect(() => guard.canActivate(createContext())).toThrowError(/Too many requests/);
  });
});
