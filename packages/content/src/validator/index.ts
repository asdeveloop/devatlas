import type { ContentError } from '../types/common';
import type { GuideFrontmatter } from '../types/guide';
import type { ToolFrontmatter } from '../types/tool';
import { guideFrontmatterSchema, toolFrontmatterSchema } from './schemas';

export interface ValidationSuccess<T> {
  ok: true;
  data: T;
}

export interface ValidationFailure {
  ok: false;
  errors: ContentError[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export function validateGuideFrontmatter(
  raw: Record<string, unknown>,
  filePath: string,
): ValidationResult<GuideFrontmatter> {
  const result = guideFrontmatterSchema.safeParse(raw);

  if (result.success) {
    return { ok: true, data: result.data as GuideFrontmatter };
  }

  return {
    ok: false,
    errors: result.error.issues.map((issue) => ({
      filePath,
      message: `${issue.path.join('.')}: ${issue.message}`,
      field: issue.path.join('.'),
    })),
  };
}

export function validateToolFrontmatter(
  raw: Record<string, unknown>,
  filePath: string,
): ValidationResult<ToolFrontmatter> {
  const result = toolFrontmatterSchema.safeParse(raw);

  if (result.success) {
    return { ok: true, data: result.data as ToolFrontmatter };
  }

  return {
    ok: false,
    errors: result.error.issues.map((issue) => ({
      filePath,
      message: `${issue.path.join('.')}: ${issue.message}`,
      field: issue.path.join('.'),
    })),
  };
}

export { guideFrontmatterSchema, toolFrontmatterSchema } from './schemas';
