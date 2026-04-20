import { describe, it, expect } from 'vitest';

import { guideFrontmatterSchema, toolFrontmatterSchema } from '../schemas';

describe('guideFrontmatterSchema', () => {
  const validGuide = {
    title: 'Test Guide',
    slug: 'test-guide',
    summary: 'A test guide.',
    category: 'testing',
    tags: ['test'],
    difficulty: 'beginner' as const,
    reading_time: 5,
  };

  it('should validate a correct guide frontmatter', () => {
    const result = guideFrontmatterSchema.safeParse(validGuide);
    expect(result.success).toBe(true);
  });

  it('should accept optional fields', () => {
    const result = guideFrontmatterSchema.safeParse({
      ...validGuide,
      author: 'John',
      published_at: '2026-01-01T00:00:00+00:00',
      related_guides: ['other-guide'],
      related_tools: ['some-tool'],
      related_ai_resources: ['ai-thing'],
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const result = guideFrontmatterSchema.safeParse({ ...validGuide, title: '' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid slug format', () => {
    const result = guideFrontmatterSchema.safeParse({ ...validGuide, slug: 'INVALID SLUG!' });
    expect(result.success).toBe(false);
  });

  it('should reject empty tags array', () => {
    const result = guideFrontmatterSchema.safeParse({ ...validGuide, tags: [] });
    expect(result.success).toBe(false);
  });

  it('should reject invalid difficulty', () => {
    const result = guideFrontmatterSchema.safeParse({ ...validGuide, difficulty: 'expert' });
    expect(result.success).toBe(false);
  });

  it('should reject negative reading_time', () => {
    const result = guideFrontmatterSchema.safeParse({ ...validGuide, reading_time: -1 });
    expect(result.success).toBe(false);
  });

  it('should reject non-integer reading_time', () => {
    const result = guideFrontmatterSchema.safeParse({ ...validGuide, reading_time: 3.5 });
    expect(result.success).toBe(false);
  });
});

describe('toolFrontmatterSchema', () => {
  const validTool = {
    name: 'Test Tool',
    slug: 'test-tool',
    description: 'A test tool.',
    category: 'testing',
    tags: ['test'],
  };

  it('should validate a correct tool frontmatter', () => {
    const result = toolFrontmatterSchema.safeParse(validTool);
    expect(result.success).toBe(true);
  });

  it('should accept optional website', () => {
    const result = toolFrontmatterSchema.safeParse({
      ...validTool,
      website: 'https://example.com',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid website URL', () => {
    const result = toolFrontmatterSchema.safeParse({
      ...validTool,
      website: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const result = toolFrontmatterSchema.safeParse({ ...validTool, name: '' });
    expect(result.success).toBe(false);
  });

  it('should reject empty tags', () => {
    const result = toolFrontmatterSchema.safeParse({ ...validTool, tags: [] });
    expect(result.success).toBe(false);
  });
});
