import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DomainError } from '../../../common/errors/domain-error';
import type { CategoriesRepository } from '../categories.repository';
import { CategoriesService } from '../categories.service';
import type { CategoryQueryDto } from '../dto/category-query.dto';
import type { CreateCategoryDto } from '../dto/create-category.dto';
import type { UpdateCategoryDto } from '../dto/update-category.dto';

const mockRepo = (): Record<keyof CategoriesRepository, ReturnType<typeof vi.fn>> => ({
  findAll: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

const now = new Date('2026-01-01T00:00:00.000Z');
const categoryRecord = (overrides: Record<string, unknown> = {}) => ({
  id: '550e8400-e29b-41d4-a716-446655440001',
  slug: 'frontend',
  name: 'Frontend',
  icon: 'sparkles',
  createdAt: now,
  updatedAt: now,
  ...overrides,
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo: ReturnType<typeof mockRepo>;
  const emptyUpdateDto: UpdateCategoryDto = {};

  beforeEach(() => {
    repo = mockRepo();
    service = new CategoriesService(repo as unknown as CategoriesRepository);
  });

  describe('list', () => {
    it('should delegate to repo.findAll', async () => {
      const query: CategoryQueryDto = { page: 1, pageSize: 10 };
      repo.findAll.mockResolvedValue({
        data: [categoryRecord()],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      });

      await expect(service.list(query)).resolves.toStrictEqual({
        data: [{
          id: '550e8400-e29b-41d4-a716-446655440001',
          slug: 'frontend',
          name: 'Frontend',
          description: 'sparkles',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      });
      expect(repo.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('get', () => {
    it('should return category when found', async () => {
      repo.findBySlug.mockResolvedValue(categoryRecord());

      await expect(service.get('frontend')).resolves.toMatchObject({
        slug: 'frontend',
        name: 'Frontend',
        description: 'sparkles',
      });
      expect(repo.findBySlug).toHaveBeenCalledWith('frontend');
    });

    it('should throw CategoryNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.get('nope')).rejects.toThrow(DomainError);
      await expect(service.get('nope')).rejects.toMatchObject({
        code: 'CATEGORY_NOT_FOUND',
        status: 404,
        message: 'Category not found',
      });
    });
  });

  describe('create', () => {
    it('should create when slug is unique', async () => {
      repo.findBySlug.mockResolvedValue(null);
      const dto: CreateCategoryDto = { name: 'Backend', slug: 'backend' };
      repo.create.mockResolvedValue(categoryRecord({ slug: 'backend', name: 'Backend', icon: null }));

      await expect(service.create(dto)).resolves.toMatchObject({
        slug: 'backend',
        name: 'Backend',
        description: null,
      });
      expect(repo.findBySlug).toHaveBeenCalledWith('backend');
      expect(repo.create).toHaveBeenCalledWith(dto);
    });

    it('should throw SlugConflict when slug exists', async () => {
      repo.findBySlug.mockResolvedValue(categoryRecord({ slug: 'backend', name: 'Backend' }));
      const dto: CreateCategoryDto = { name: 'Backend', slug: 'backend' };

      await expect(service.create(dto)).rejects.toMatchObject({
        code: 'SLUG_CONFLICT',
        status: 409,
        message: 'Slug already exists',
      });
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update when category exists', async () => {
      repo.findBySlug.mockResolvedValue(categoryRecord());
      const dto: UpdateCategoryDto = { name: 'Frontend Updated' };
      repo.update.mockResolvedValue(categoryRecord({ name: 'Frontend Updated' }));

      await expect(service.update('frontend', dto)).resolves.toMatchObject({
        slug: 'frontend',
        name: 'Frontend Updated',
      });
      expect(repo.update).toHaveBeenCalledWith('frontend', dto);
    });

    it('should throw CategoryNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.update('nope', emptyUpdateDto)).rejects.toMatchObject({
        code: 'CATEGORY_NOT_FOUND',
        status: 404,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete when category exists', async () => {
      repo.findBySlug.mockResolvedValue(categoryRecord());
      repo.delete.mockResolvedValue(categoryRecord());

      await expect(service.delete('frontend')).resolves.toMatchObject({ slug: 'frontend' });
      expect(repo.delete).toHaveBeenCalledWith('frontend');
    });

    it('should throw CategoryNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.delete('nope')).rejects.toMatchObject({
        code: 'CATEGORY_NOT_FOUND',
        status: 404,
      });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});
