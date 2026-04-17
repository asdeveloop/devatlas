// filepath: apps/api/src/modules/categories/__tests__/categories.service.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainError } from '../../../common/errors/domain-error';
import { CategoriesRepository } from '../categories.repository';
import { CategoriesService } from '../categories.service';

const mockRepo = (): Record<keyof CategoriesRepository, ReturnType<typeof vi.fn>> => ({
  findAll: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo: ReturnType<typeof mockRepo>;

  beforeEach(() => {
    repo = mockRepo();
    service = new CategoriesService(repo as unknown as CategoriesRepository);
  });

  describe('list', () => {
    it('should delegate to repo.findAll', async () => {
      const query = { page: 1, pageSize: 10 };
      const result = { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false } };
      repo.findAll.mockResolvedValue(result);

      expect(await service.list(query as any)).toBe(result);
      expect(repo.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('get', () => {
    it('should return category when found', async () => {
      const cat = { id: '1', slug: 'frontend', name: 'Frontend' };
      repo.findBySlug.mockResolvedValue(cat);

      expect(await service.get('frontend')).toBe(cat);
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
      const dto = { name: 'Backend', slug: 'backend' };
      const created = { id: '2', ...dto };
      repo.create.mockResolvedValue(created);

      expect(await service.create(dto as any)).toBe(created);
      expect(repo.findBySlug).toHaveBeenCalledWith('backend');
      expect(repo.create).toHaveBeenCalledWith(dto);
    });

    it('should throw SlugConflict when slug exists', async () => {
      repo.findBySlug.mockResolvedValue({ id: '2', slug: 'backend' });

      await expect(service.create({ name: 'Backend', slug: 'backend' } as any)).rejects.toMatchObject({
        code: 'SLUG_CONFLICT',
        status: 409,
        message: 'Slug already exists',
      });
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update when category exists', async () => {
      const existing = { id: '1', slug: 'frontend', name: 'Frontend' };
      repo.findBySlug.mockResolvedValue(existing);
      const dto = { name: 'Frontend Updated' };
      const updated = { ...existing, ...dto };
      repo.update.mockResolvedValue(updated);

      expect(await service.update('frontend', dto as any)).toBe(updated);
      expect(repo.update).toHaveBeenCalledWith('frontend', dto);
    });

    it('should throw CategoryNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.update('nope', {} as any)).rejects.toMatchObject({
        code: 'CATEGORY_NOT_FOUND',
        status: 404,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete when category exists', async () => {
      repo.findBySlug.mockResolvedValue({ id: '1', slug: 'frontend' });
      repo.delete.mockResolvedValue(undefined);

      await service.delete('frontend');
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
