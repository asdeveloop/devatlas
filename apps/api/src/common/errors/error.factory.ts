import { DomainError } from './domain-error';
import { ErrorCodes } from './error-codes';

export class ErrorFactory {
  static GuideNotFound() {
    return new DomainError(
      ErrorCodes.GUIDE_NOT_FOUND,
      'Guide not found',
      404,
    );
  }

  static SlugConflict() {
    return new DomainError(
      ErrorCodes.SLUG_CONFLICT,
      'Slug already exists',
      409,
    );
  }

  static ToolNotFound() {
    return new DomainError(
      ErrorCodes.TOOL_NOT_FOUND,
      'Tool not found',
      404,
    );
  }

  static CategoryNotFound() {
    return new DomainError(
      ErrorCodes.CATEGORY_NOT_FOUND,
      'Category not found',
      404,
    );
  }

  static TagNotFound() {
    return new DomainError(
      ErrorCodes.TAG_NOT_FOUND,
      'Tag not found',
      404,
    );
  }

  static Unknown(error: { message?: string } | null | undefined) {
    return new DomainError(
      ErrorCodes.UNKNOWN,
      error?.message || 'Unknown error',
      500,
    );
  }
}
