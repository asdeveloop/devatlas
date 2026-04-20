import { ToolPrice, ToolTier } from '@devatlas/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DomainError } from '../../../common/errors/domain-error';
import type { CreateToolDto } from '../dto/create-tool.dto';
import type { ToolQueryDto } from '../dto/tool-query.dto';
import type { UpdateToolDto } from '../dto/update-tool.dto';
import type { ToolsRepository } from '../tools.repository';
import { ToolsService } from '../tools.service';

const mockRepo = (): Record<keyof ToolsRepository, ReturnType<typeof vi.fn>> => ({
  findAll: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

describe('ToolsService', () => {
  let service: ToolsService;
  let repo: ReturnType<typeof mockRepo>;
  const emptyUpdateDto: UpdateToolDto = {};

  beforeEach(() => {
    repo = mockRepo();
    service = new ToolsService(repo as unknown as ToolsRepository);
  });

  describe('list', () => {
    it('should delegate to repo.findAll', async () => {
      const query: ToolQueryDto = { page: 1, pageSize: 10 };
      const result = { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false } };
      repo.findAll.mockResolvedValue(result);

      expect(await service.list(query)).toBe(result);
      expect(repo.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('get', () => {
    it('should return tool when found', async () => {
      const tool = { id: '1', slug: 'vscode', name: 'VS Code' };
      repo.findBySlug.mockResolvedValue(tool);

      expect(await service.get('vscode')).toBe(tool);
    });

    it('should throw ToolNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.get('nope')).rejects.toThrow(DomainError);
      await expect(service.get('nope')).rejects.toMatchObject({
        code: 'TOOL_NOT_FOUND',
        status: 404,
        message: 'Tool not found',
      });
    });
  });

  describe('create', () => {
    it('should create when slug is unique', async () => {
      repo.findBySlug.mockResolvedValue(null);
      const dto: CreateToolDto = {
        name: 'Prettier',
        slug: 'prettier',
        categoryId: '550e8400-e29b-41d4-a716-446655440010',
        tier: ToolTier.FREE,
        price: ToolPrice.FREE,
      };
      const created = { id: '2', ...dto };
      repo.create.mockResolvedValue(created);

      expect(await service.create(dto)).toBe(created);
      expect(repo.findBySlug).toHaveBeenCalledWith('prettier');
      expect(repo.create).toHaveBeenCalledWith(dto);
    });

    it('should throw SlugConflict when slug exists', async () => {
      repo.findBySlug.mockResolvedValue({ id: '1', slug: 'prettier' });

      await expect(
        service.create({ name: 'Prettier', slug: 'prettier' } as CreateToolDto),
      ).rejects.toMatchObject({
        code: 'SLUG_CONFLICT',
        status: 409,
        message: 'Slug already exists',
      });
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update when tool exists', async () => {
      const existing = { id: '1', slug: 'vscode', name: 'VS Code' };
      repo.findBySlug.mockResolvedValue(existing);
      const dto: UpdateToolDto = { name: 'Visual Studio Code' };
      const updated = { ...existing, ...dto };
      repo.update.mockResolvedValue(updated);

      expect(await service.update('vscode', dto)).toBe(updated);
      expect(repo.update).toHaveBeenCalledWith('vscode', dto);
    });

    it('should throw ToolNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.update('nope', emptyUpdateDto)).rejects.toMatchObject({
        code: 'TOOL_NOT_FOUND',
        status: 404,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete when tool exists', async () => {
      repo.findBySlug.mockResolvedValue({ id: '1', slug: 'vscode' });
      repo.delete.mockResolvedValue(undefined);

      await service.delete('vscode');
      expect(repo.delete).toHaveBeenCalledWith('vscode');
    });

    it('should throw ToolNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.delete('nope')).rejects.toMatchObject({
        code: 'TOOL_NOT_FOUND',
        status: 404,
      });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});
