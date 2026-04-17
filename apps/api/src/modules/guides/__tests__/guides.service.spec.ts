// filepath: apps/api/src/modules/guides/__tests__/guides.service.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainError } from '../../../common/errors/domain-error';
import { GuidesRepository } from '../guides.repository';
import { GuidesService } from '../guides.service';
import { GuideMapper } from '../mapper/guide.mapper';

vi.mock('../mapper/guide.mapper', () => ({
  GuideMapper: {
    toSummary: vi.fn((item: any) => ({ id: item.id, title: item.title })),
    toDetail: vi.fn((item: any) => ({ id: item.id, title: item.title, content: item.content })),
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

  beforeEach(() => {
    repo = mockRepo();
    service = new GuidesService(repo as unknown as GuidesRepository);
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated data with meta', async () => {
      const items = [
        { id: '1', title: 'Guide 1' },
        { id: '2', title: 'Guide 2' },
      ];
      repo.findAll.mockResolvedValue(items);
      repo.count.mockResolvedValue(25);

      const query = { skip: 0, take: 10, status: 'published', difficulty: undefined, categoryId: undefined, sortBy: 'createdAt', order: 'desc' };
      const result = await service.findAll(query as any);

      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: false,
      });
      expect(result.data).toHaveLength(2);
      expect(GuideMapper.toSummary).toHaveBeenCalledTimes(2);
    });

    it('should calculate page from skip', async () => {
      repo.findAll.mockResolvedValue([]);
      repo.count.mockResolvedValue(50);

      const query = { skip: 20, take: 10 };
      const result = await service.findAll(query as any);

      expect(result.meta.page).toBe(3);
      expect(result.meta.totalPages).toBe(5);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPrevPage).toBe(true);
    });

    it('should default take to 20 when undefined', async () => {
      repo.findAll.mockResolvedValue([]);
      repo.count.mockResolvedValue(0);

      const query = { skip: undefined, take: undefined };
      const result = await service.findAll(query as any);

      expect(result.meta.limit).toBe(20);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findBySlug', () => {
    it('should return mapped detail when found', async () => {
      const entity = { id: '1', title: 'Guide', content: 'body' };
      repo.findBySlug.mockResolvedValue(entity);

      const result = await service.findBySlug('my-guide');
      expect(GuideMapper.toDetail).toHaveBeenCalledWith(entity);
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

      const dto = {
        title: 'New',
        slug: 'new-guide',
        description: 'desc',
        content: 'c',
        difficulty: 'beginner',
        readingTime: 5,
        status: 'draft',
        categoryId: 'cat1',
        tagIds: ['t1', 't2'],
      };

      await service.create(dto as any);

      expect(repo.create).toHaveBeenCalledWith({
        title: 'New',
        slug: 'new-guide',
        description: 'desc',
        content: 'c',
        difficulty: 'beginner',
        readingTime: 5,
        status: 'draft',
        category: { connect: { id: 'cat1' } },
        tags: {
          create: [
            { tag: { connect: { id: 't1' } } },
            { tag: { connect: { id: 't2' } } },
          ],
        },
      });
      expect(GuideMapper.toDetail).toHaveBeenCalledWith(created);
    });

    it('should create guide without tags when tagIds is empty', async () => {
      repo.findBySlug.mockResolvedValue(null);
      repo.create.mockResolvedValue({ id: '1' });

      const dto = {
        title: 'No Tags',
        slug: 'no-tags',
        description: 'd',
        content: 'c',
        difficulty: 'beginner',
        readingTime: 3,
        status: 'draft',
        categoryId: 'cat1',
        tagIds: [],
      };

      await service.create(dto as any);

      const createArg = repo.create.mock.calls[0][0];
      expect(createArg.tags).toBeUndefined();
    });

    it('should throw SlugConflict when slug exists', async () => {
      repo.findBySlug.mockResolvedValue({ id: '1' });

      await expect(service.create({ slug: 'existing' } as any)).rejects.toMatchObject({
        code: 'SLUG_CONFLICT',
        status: 409,
      });
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update guide with new tags (deleteMany + create)', async () => {
      repo.findById.mockResolvedValue({ id: 'g1' });
      repo.update.mockResolvedValue({ id: 'g1', title: 'Updated' });

      const dto = {
        title: 'Updated',
        tagIds: ['t3'],
        categoryId: 'cat2',
      };

      await service.update('g1', dto as any);

      const updateArg = repo.update.mock.calls[0][1];
      expect(updateArg.tags).toEqual({
        deleteMany: {},
        create: [{ tag: { connect: { id: 't3' } } }],
      });
      expect(updateArg.category).toEqual({ connect: { id: 'cat2' } });
    });

    it('should not touch tags when tagIds is undefined', async () => {
      repo.findById.mockResolvedValue({ id: 'g1' });
      repo.update.mockResolvedValue({ id: 'g1' });

      await service.update('g1', { title: 'X' } as any);

      const updateArg = repo.update.mock.calls[0][1];
      expect(updateArg.tags).toBeUndefined();
      expect(updateArg.category).toBeUndefined();
    });

    it('should throw GuideNotFound when not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.update('nope', {} as any)).rejects.toMatchObject({
        code: 'GUIDE_NOT_FOUND',
        status: 404,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete when guide exists', async () => {
      repo.findById.mockResolvedValue({ id: 'g1' });
      repo.delete.mockResolvedValue(undefined);

      await service.delete('g1');
      expect(repo.delete).toHaveBeenCalledWith('g1');
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
