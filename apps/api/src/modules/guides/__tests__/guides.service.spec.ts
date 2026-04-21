import { ContentStatus, Difficulty } from '@devatlas/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DomainError } from '../../../common/errors/domain-error';
import type { CreateGuideDto } from '../dto/create-guide.dto';
import type { GuideQueryDto } from '../dto/guide-query.dto';
import type { UpdateGuideDto } from '../dto/update-guide.dto';
import type { GuidesRepository } from '../guides.repository';
import { GuidesService } from '../guides.service';

type GuideMapperInput = {
  id: string;
  title: string;
  content?: string;
  slug?: string;
};

const { toSummaryMock, toDetailMock, toDomainMock } = vi.hoisted(() => ({
  toSummaryMock: vi.fn((item: GuideMapperInput) => ({ id: item.id, title: item.title, slug: item.slug ?? 'guide' })),
  toDetailMock: vi.fn((item: GuideMapperInput) => ({ id: item.id, title: item.title, content: item.content })),
  toDomainMock: vi.fn((item: GuideMapperInput) => item),
}));

vi.mock('../mapper/guide.mapper', () => ({
  GuideMapper: {
    toSummary: toSummaryMock,
    toDetail: toDetailMock,
    toDomain: toDomainMock,
  },
}));

const mockRepo = (): Record<keyof GuidesRepository, ReturnType<typeof vi.fn>> => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
});

describe('GuidesService', () => {
  let service: GuidesService;
  let repo: ReturnType<typeof mockRepo>;
  const emptyUpdateDto: UpdateGuideDto = {};

  beforeEach(() => {
    repo = mockRepo();
    service = new GuidesService(repo as unknown as GuidesRepository);
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should map repo items to guide summaries', async () => {
      const query: GuideQueryDto = { skip: 0, take: 10, status: ContentStatus.PUBLISHED };
      const result = {
        data: [{ id: '1', title: 'Guide 1', slug: 'guide-1' }],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
      repo.findAll.mockResolvedValue(result);

      await expect(service.findAll(query)).resolves.toEqual({
        data: [{ id: '1', title: 'Guide 1', slug: 'guide-1' }],
        meta: result.meta,
      });
      expect(repo.findAll).toHaveBeenCalledWith(query);
      expect(toSummaryMock).toHaveBeenCalledWith(result.data[0]);
    });
  });

  describe('findBySlug', () => {
    it('should return mapped detail when found', async () => {
      const entity = { id: '1', title: 'Guide', content: 'body' };
      repo.findBySlug.mockResolvedValue(entity);

      const result = await service.findBySlug('my-guide');
      expect(toDetailMock.mock.calls[0]).toEqual([entity]);
      expect(result).toEqual({ id: '1', title: 'Guide', content: 'body' });
    });

    it('should throw GuideNotFound when not found', async () => {
      repo.findBySlug.mockResolvedValue(null);

      await expect(service.findBySlug('nope')).rejects.toThrow(DomainError);
      await expect(service.findBySlug('nope')).rejects.toMatchObject({
        code: 'GUIDE_NOT_FOUND',
        status: 404,
        message: 'Guide not found',
      });
    });
  });

  describe('create', () => {
    it('should create guide with tags', async () => {
      repo.findBySlug.mockResolvedValue(null);
      const created = { id: '1', title: 'New', content: 'c' };
      repo.create.mockResolvedValue(created);

      const dto: CreateGuideDto = {
        title: 'New',
        slug: 'new-guide',
        description: 'desc',
        content: 'c',
        difficulty: Difficulty.BEGINNER,
        readingTime: 5,
        status: ContentStatus.DRAFT,
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        tagIds: [
          '550e8400-e29b-41d4-a716-446655440001',
          '550e8400-e29b-41d4-a716-446655440002',
        ],
      };

      await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(toDetailMock.mock.calls[0]).toEqual([created]);
    });

    it('should create guide without tags when tagIds is empty', async () => {
      repo.findBySlug.mockResolvedValue(null);
      repo.create.mockResolvedValue({ id: '1' });

      const dto: CreateGuideDto = {
        title: 'No Tags',
        slug: 'no-tags',
        description: 'd',
        content: 'c',
        difficulty: Difficulty.BEGINNER,
        readingTime: 3,
        status: ContentStatus.DRAFT,
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        tagIds: [],
      };

      await service.create(dto);

      const createArg = repo.create.mock.calls[0]?.[0] as CreateGuideDto | undefined;
      expect(createArg?.tagIds).toEqual([]);
    });

    it('should throw SlugConflict when slug exists', async () => {
      repo.findBySlug.mockResolvedValue({ id: '1' });

      await expect(service.create({ slug: 'existing' } as CreateGuideDto)).rejects.toMatchObject({
        code: 'SLUG_CONFLICT',
        status: 409,
      });
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update guide with new tags', async () => {
      repo.findById.mockResolvedValue({ id: 'g1' });
      repo.update.mockResolvedValue({ id: 'g1', title: 'Updated' });

      const dto: UpdateGuideDto = {
        title: 'Updated',
        tagIds: ['550e8400-e29b-41d4-a716-446655440003'],
        categoryId: '550e8400-e29b-41d4-a716-446655440004',
      };

      await service.update('g1', dto);

      expect(repo.update).toHaveBeenCalledWith('g1', dto);
    });

    it('should not touch tags when tagIds is undefined', async () => {
      repo.findById.mockResolvedValue({ id: 'g1' });
      repo.update.mockResolvedValue({ id: 'g1' });

      const dto: UpdateGuideDto = { title: 'X' };
      await service.update('g1', dto);

      expect(repo.update).toHaveBeenCalledWith('g1', dto);
    });

    it('should throw GuideNotFound when not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.update('nope', emptyUpdateDto)).rejects.toMatchObject({
        code: 'GUIDE_NOT_FOUND',
        status: 404,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete when guide exists', async () => {
      repo.findById.mockResolvedValue({ id: 'g1' });
      repo.delete.mockResolvedValue({ id: 'g1' });

      await service.delete('g1');
      expect(repo.delete).toHaveBeenCalledWith('g1');
      expect(toDomainMock.mock.calls[0]).toEqual([{ id: 'g1' }]);
    });

    it('should throw GuideNotFound when not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.delete('nope')).rejects.toMatchObject({
        code: 'GUIDE_NOT_FOUND',
        status: 404,
      });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});
