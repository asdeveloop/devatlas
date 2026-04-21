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
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

const now = new Date('2026-01-01T00:00:00.000Z');
const toolRecord = (overrides: Record<string, unknown> = {}) => ({
  id: '550e8400-e29b-41d4-a716-446655440003',
  slug: 'vscode',
  name: 'VS Code',
  description: 'Editor',
  website: 'https://example.com',
  github: 'https://github.com/example/repo',
  icon: null,
  active: true,
  tier: ToolTier.FREE,
  price: ToolPrice.FREE,
  popularity: 10,
  categoryId: '550e8400-e29b-41d4-a716-446655440010',
  category: {
    id: '550e8400-e29b-41d4-a716-446655440010',
    slug: 'developer-tools',
    name: 'Developer Tools',
    icon: 'code',
    createdAt: now,
    updatedAt: now,
  },
  tags: [{
    id: '550e8400-e29b-41d4-a716-446655440011',
    slug: 'editor',
    name: 'Editor',
    createdAt: now,
    updatedAt: now,
  }],
  createdAt: now,
  updatedAt: now,
  ...overrides,
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
      repo.findAll.mockResolvedValue({
        data: [toolRecord()],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      });
      repo.findBySlug.mockResolvedValue(toolRecord());

      await expect(service.list(query)).resolves.toMatchObject({
        data: [{
          slug: 'vscode',
          name: 'VS Code',
          category: { slug: 'developer-tools' },
          tags: [{ slug: 'editor' }],
        }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      });
      expect(repo.findAll).toHaveBeenCalledWith(query);
      expect(repo.findBySlug).toHaveBeenCalledWith('vscode');
    });
  });

  describe('get', () => {
    it('should return tool when found', async () => {
      repo.findBySlug.mockResolvedValue(toolRecord());

      await expect(service.get('vscode')).resolves.toMatchObject({
        slug: 'vscode',
        name: 'VS Code',
        category: { slug: 'developer-tools' },
      });
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
      repo.findBySlug.mockResolvedValueOnce(null);
      const dto: CreateToolDto = {
        name: 'Prettier',
        slug: 'prettier',
        categoryId: '550e8400-e29b-41d4-a716-446655440010',
        tier: ToolTier.FREE,
        price: ToolPrice.FREE,
      };
      repo.create.mockResolvedValue(toolRecord({ slug: 'prettier', name: 'Prettier' }));

      await expect(service.create(dto)).resolves.toMatchObject({ slug: 'prettier', name: 'Prettier' });
      expect(repo.findBySlug).toHaveBeenCalledWith('prettier');
      expect(repo.create).toHaveBeenCalledWith(dto);
    });

    it('should throw SlugConflict when slug exists', async () => {
      repo.findBySlug.mockResolvedValue(toolRecord({ slug: 'prettier', name: 'Prettier' }));

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
      repo.findBySlug.mockResolvedValue(toolRecord());
      const dto: UpdateToolDto = { name: 'Visual Studio Code' };
      repo.update.mockResolvedValue(toolRecord({ name: 'Visual Studio Code' }));

      await expect(service.update('vscode', dto)).resolves.toMatchObject({
        slug: 'vscode',
        name: 'Visual Studio Code',
      });
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
      repo.findBySlug.mockResolvedValue(toolRecord());
      repo.delete.mockResolvedValue(toolRecord());

      await expect(service.delete('vscode')).resolves.toMatchObject({ slug: 'vscode' });
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
