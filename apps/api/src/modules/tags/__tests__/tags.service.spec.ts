import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DomainError } from '../../../common/errors/domain-error';
import type { CreateTagDto } from '../dto/create-tag.dto';
import type { TagQueryDto } from '../dto/tag-query.dto';
import type { UpdateTagDto } from '../dto/update-tag.dto';
import type { TagsRepository } from '../tags.repository';
import { TagsService } from '../tags.service';

const mockRepo = (): Record<keyof TagsRepository, ReturnType<typeof vi.fn>> => ({
  findAll: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

const now = new Date('2026-01-01T00:00:00.000Z');
const tagRecord = (overrides: Record<string, unknown> = {}) => ({
  id: '550e8400-e29b-41d4-a716-446655440002',
  slug: 'react',
  name: 'React',
  createdAt: now,
  updatedAt: now,
  ...overrides,
});

describe('TagsService', () => {
  let service: TagsService;
  let repo: ReturnType<typeof mockRepo>;
  const emptyUpdateDto: UpdateTagDto = {};

  beforeEach(() => {
    repo = mockRepo();
    service = new TagsService(repo as unknown as TagsRepository);
  });

  describe('list', () => {
    it('should delegate to repo.findAll', async () => {
      const query: TagQueryDto = { page: 1, pageSize: 10 };
      repo.findAll.mockResolvedValue({
        data: [tagRecord()],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      });

      await expect(service.list(query)).resolves.toStrictEqual({
        data: [{
          id: '550e8400-e29b-41d4-a716-446655440002',
          slug: 'react',
          name: 'React',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      });
      expect(repo.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('get', () => {
    it('should return tag when found', async () => {
      repo.findBySlug.mockResolvedValue(tagRecord());

      await expect(service.get('react')).resolves.toMatchObject({
        slug: 'react',
        name: 'React',
      });
    });

    it('should throw TagNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.get('nope')).rejects.toThrow(DomainError);
      await expect(service.get('nope')).rejects.toMatchObject({
        code: 'TAG_NOT_FOUND',
        status: 404,
        message: 'Tag not found',
      });
    });
  });

  describe('create', () => {
    it('should create when slug is unique', async () => {
      repo.findBySlug.mockResolvedValue(null);
      const dto: CreateTagDto = { name: 'Vue', slug: 'vue' };
      repo.create.mockResolvedValue(tagRecord({ slug: 'vue', name: 'Vue' }));

      await expect(service.create(dto)).resolves.toMatchObject({ slug: 'vue', name: 'Vue' });
      expect(repo.create).toHaveBeenCalledWith(dto);
    });

    it('should throw SlugConflict when slug exists', async () => {
      repo.findBySlug.mockResolvedValue(tagRecord({ slug: 'vue', name: 'Vue' }));
      const dto: CreateTagDto = { name: 'Vue', slug: 'vue' };

      await expect(service.create(dto)).rejects.toMatchObject({
        code: 'SLUG_CONFLICT',
        status: 409,
        message: 'Slug already exists',
      });
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update when tag exists', async () => {
      repo.findBySlug.mockResolvedValue(tagRecord());
      const dto: UpdateTagDto = { name: 'React.js' };
      repo.update.mockResolvedValue(tagRecord({ name: 'React.js' }));

      await expect(service.update('react', dto)).resolves.toMatchObject({
        slug: 'react',
        name: 'React.js',
      });
      expect(repo.update).toHaveBeenCalledWith('react', dto);
    });

    it('should throw TagNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.update('nope', emptyUpdateDto)).rejects.toMatchObject({
        code: 'TAG_NOT_FOUND',
        status: 404,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete when tag exists', async () => {
      repo.findBySlug.mockResolvedValue(tagRecord());
      repo.delete.mockResolvedValue(tagRecord());

      await expect(service.delete('react')).resolves.toMatchObject({ slug: 'react' });
      expect(repo.delete).toHaveBeenCalledWith('react');
    });

    it('should throw TagNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.delete('nope')).rejects.toMatchObject({
        code: 'TAG_NOT_FOUND',
        status: 404,
      });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});
