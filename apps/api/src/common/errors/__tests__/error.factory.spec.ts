// filepath: apps/api/src/common/errors/__tests__/error.factory.spec.ts
import { describe, expect, it } from 'vitest';

import { DomainError } from '../domain-error';
import { ErrorCodes } from '../error-codes';
import { ErrorFactory } from '../error.factory';

describe('ErrorCodes', () => {
  it('should have all expected keys', () => {
    expect(ErrorCodes).toEqual({
      GUIDE_NOT_FOUND: 'GUIDE_NOT_FOUND',
      SLUG_CONFLICT: 'SLUG_CONFLICT',
      CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
      TAG_NOT_FOUND: 'TAG_NOT_FOUND',
      TOOL_NOT_FOUND: 'TOOL_NOT_FOUND',
      INVALID_AI_CONTENT_TYPE: 'INVALID_AI_CONTENT_TYPE',
      INVALID_CATEGORY: 'INVALID_CATEGORY',
      INVALID_RELATION: 'INVALID_RELATION',
      UNKNOWN: 'UNKNOWN_ERROR',
    });
  });
});

describe('DomainError', () => {
  it('should set code, message, status and name', () => {
    const err = new DomainError('TEST_CODE', 'test message', 400);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('TEST_CODE');
    expect(err.message).toBe('test message');
    expect(err.status).toBe(400);
    expect(err.name).toBe('TEST_CODE');
  });
});

describe('ErrorFactory', () => {
  it('GuideNotFound → 404, GUIDE_NOT_FOUND', () => {
    const err = ErrorFactory.GuideNotFound();
    expect(err).toBeInstanceOf(DomainError);
    expect(err.code).toBe('GUIDE_NOT_FOUND');
    expect(err.message).toBe('Guide not found');
    expect(err.status).toBe(404);
  });

  it('SlugConflict → 409, SLUG_CONFLICT', () => {
    const err = ErrorFactory.SlugConflict();
    expect(err).toBeInstanceOf(DomainError);
    expect(err.code).toBe('SLUG_CONFLICT');
    expect(err.message).toBe('Slug already exists');
    expect(err.status).toBe(409);
  });

  it('ToolNotFound → 404, TOOL_NOT_FOUND', () => {
    const err = ErrorFactory.ToolNotFound();
    expect(err).toBeInstanceOf(DomainError);
    expect(err.code).toBe('TOOL_NOT_FOUND');
    expect(err.message).toBe('Tool not found');
    expect(err.status).toBe(404);
  });

  it('CategoryNotFound → 404, CATEGORY_NOT_FOUND', () => {
    const err = ErrorFactory.CategoryNotFound();
    expect(err).toBeInstanceOf(DomainError);
    expect(err.code).toBe('CATEGORY_NOT_FOUND');
    expect(err.message).toBe('Category not found');
    expect(err.status).toBe(404);
  });

  it('TagNotFound → 404, TAG_NOT_FOUND', () => {
    const err = ErrorFactory.TagNotFound();
    expect(err).toBeInstanceOf(DomainError);
    expect(err.code).toBe('TAG_NOT_FOUND');
    expect(err.message).toBe('Tag not found');
    expect(err.status).toBe(404);
  });

  it('Unknown → 500, UNKNOWN_ERROR with custom message', () => {
    const err = ErrorFactory.Unknown(new Error('something broke'));
    expect(err).toBeInstanceOf(DomainError);
    expect(err.code).toBe('UNKNOWN_ERROR');
    expect(err.message).toBe('something broke');
    expect(err.status).toBe(500);
  });

  it('Unknown → 500, fallback message when error has no message', () => {
    const err = ErrorFactory.Unknown({});
    expect(err.message).toBe('Unknown error');
    expect(err.status).toBe(500);
  });

  it('InvalidAiContentType → 400, INVALID_AI_CONTENT_TYPE', () => {
    const err = ErrorFactory.InvalidAiContentType();
    expect(err).toBeInstanceOf(DomainError);
    expect(err.code).toBe('INVALID_AI_CONTENT_TYPE');
    expect(err.message).toBe('AI content type must be guide or tool');
    expect(err.status).toBe(400);
  });
});
