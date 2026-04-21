import { EntityType, RelationType } from '@devatlas/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DomainError } from '../../../common/errors/domain-error';
import type { GuidesService } from '../../guides/guides.service';
import type { ToolsService } from '../../tools/tools.service';
import type { ContentRelationsRepository } from '../content-relations.repository';
import { ContentRelationsService } from '../content-relations.service';

function createRepositoryMock() {
  return {
    createRelation: vi.fn(),
    findRelatedBySource: vi.fn(),
  } as unknown as ContentRelationsRepository;
}

function createGuidesServiceMock() {
  return {
    existsById: vi.fn(),
  } as unknown as GuidesService;
}

function createToolsServiceMock() {
  return {
    existsById: vi.fn(),
  } as unknown as ToolsService;
}

describe('ContentRelationsService', () => {
  let repository: ReturnType<typeof createRepositoryMock>;
  let guidesService: ReturnType<typeof createGuidesServiceMock>;
  let toolsService: ReturnType<typeof createToolsServiceMock>;
  let service: ContentRelationsService;

  beforeEach(() => {
    repository = createRepositoryMock();
    guidesService = createGuidesServiceMock();
    toolsService = createToolsServiceMock();
    service = new ContentRelationsService(repository, guidesService, toolsService);
  });

  it('creates a relation after validating both entities', async () => {
    guidesService.existsById = vi.fn().mockResolvedValue(true);
    toolsService.existsById = vi.fn().mockResolvedValue(true);
    repository.createRelation = vi.fn().mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440001',
      sourceType: EntityType.GUIDE,
      sourceId: '550e8400-e29b-41d4-a716-446655440002',
      targetType: EntityType.TOOL,
      targetId: '550e8400-e29b-41d4-a716-446655440003',
      relationType: RelationType.ALTERNATIVE,
      weight: 0.8,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await expect(service.create({
      sourceType: EntityType.GUIDE,
      sourceId: '550e8400-e29b-41d4-a716-446655440002',
      targetType: EntityType.TOOL,
      targetId: '550e8400-e29b-41d4-a716-446655440003',
      relationType: RelationType.ALTERNATIVE,
      weight: 0.8,
    })).resolves.toMatchObject({
      relationType: RelationType.ALTERNATIVE,
      weight: 0.8,
    });
  });

  it('returns related guides for a valid source guide', async () => {
    guidesService.existsById = vi.fn().mockResolvedValue(true);
    repository.findRelatedBySource = vi.fn().mockResolvedValue([{ id: '1', contentType: 'tool' }]);

    await expect(service.getRelatedGuides('guide-id')).resolves.toEqual([{ id: '1', contentType: 'tool' }]);
    expect(repository.findRelatedBySource).toHaveBeenCalledWith(EntityType.GUIDE, 'guide-id');
  });

  it('throws when the source tool does not exist', async () => {
    toolsService.existsById = vi.fn().mockResolvedValue(false);

    await expect(service.getRelatedTools('missing-tool')).rejects.toBeInstanceOf(DomainError);
    await expect(service.getRelatedTools('missing-tool')).rejects.toMatchObject({
      code: 'TOOL_NOT_FOUND',
      status: 404,
    });
  });
});
