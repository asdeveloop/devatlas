import { describe, expect, it, vi } from 'vitest';

import { applySecurityHeaders } from '../security-headers';

describe('applySecurityHeaders', () => {
  it('sets baseline hardening headers', () => {
    const response = {
      setHeader: vi.fn(),
    };
    const next = vi.fn();

    applySecurityHeaders({} as never, response as never, next);

    expect(response.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'no-referrer');
    expect(response.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(response.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(response.setHeader).toHaveBeenCalledWith('Cross-Origin-Opener-Policy', 'same-origin');
    expect(response.setHeader).toHaveBeenCalledWith('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    expect(next).toHaveBeenCalledOnce();
  });
});
