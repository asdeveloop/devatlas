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
      const result = { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false } };
      repo.findAll.mockResolvedValue(result);

      expect(await service.list(query)).toBe(result);
      expect(repo.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('get', () => {
    it('should return tag when found', async () => {
      const tag = { id: '1', slug: 'react', name: 'React' };
      repo.findBySlug.mockResolvedValue(tag);

      expect(await service.get('react')).toBe(tag);
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
      const created = { id: '2', ...dto };
      repo.create.mockResolvedValue(created);

      expect(await service.create(dto)).toBe(created);
      expect(repo.create).toHaveBeenCalledWith(dto);
    });

    it('should throw SlugConflict when slug exists', async () => {
      repo.findBySlug.mockResolvedValue({ id: '1', slug: 'vue' });
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
      repo.findBySlug.mockResolvedValue({ id: '1', slug: 'react' });
      const dto: UpdateTagDto = { name: 'React.js' };
      const updated = { id: '1', slug: 'react', name: 'React.js' };
      repo.update.mockResolvedValue(updated);

      expect(await service.update('react', dto)).toBe(updated);
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
      repo.findBySlug.mockResolvedValue({ id: '1', slug: 'react' });
      repo.delete.mockResolvedValue(undefined);

      await service.delete('react');
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
