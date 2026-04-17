import { randomUUID } from 'node:crypto';
import type { SearchDocument, Guide, Tool, ContentType } from '../types';

export function buildSearchDocument(
  entity: Guide | Tool,
  contentType: ContentType,
  tags: string[],
  category: string,
): SearchDocument {
  const isGuide = 'title' in entity && 'content' in entity;

  return {
    id: randomUUID(),
    content_type: contentType,
    title: isGuide ? (entity as Guide).title : (entity as Tool).name,
    description: entity.description ?? '',
    content: isGuide ? (entity as Guide).content : '',
    tags,
    category,
    url: `/${contentType}s/${entity.slug}`,
  };
}
