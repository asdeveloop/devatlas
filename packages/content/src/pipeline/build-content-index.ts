import { randomUUID } from 'node:crypto';

import { indexGuide, indexTool, buildSearchDocument, buildRelations } from '../indexer';
import { loadContent } from '../loader';
import type {
  Guide, Tool, Category, Tag, GuideTag, ToolTag,
  ContentRelation, SearchDocument, GuideFrontmatter,
  ToolFrontmatter, ParsedContent, ContentType,
} from '../types';

export interface ContentIndex {
  guides: Guide[];
  tools: Tool[];
  categories: Category[];
  tags: Tag[];
  guideTags: GuideTag[];
  toolTags: ToolTag[];
  relations: ContentRelation[];
  searchDocuments: SearchDocument[];
}

export async function buildContentIndex(contentDir: string): Promise<ContentIndex> {
  const { parsed, errors } = await loadContent(contentDir);

  if (errors.length > 0) {
    console.warn(`[content-pipeline] ${errors.length} file(s) failed to parse:`);
    errors.forEach((e) => console.warn(`  - ${e.filePath}: ${e.error.message}`));
  }

  // Collect unique categories and tags
  const categoryMap = new Map<string, Category>();
  const tagMap = new Map<string, Tag>();

  for (const item of parsed) {
    const fm = item.frontmatter as GuideFrontmatter & ToolFrontmatter;

    if (fm.category && !categoryMap.has(fm.category)) {
      categoryMap.set(fm.category, {
        id: randomUUID(),
        slug: fm.category,
        name: fm.category,
        description: '',
      });
    }

    for (const tag of fm.tags ?? []) {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, { id: randomUUID(), slug: tag, name: tag });
      }
    }
  }

  const guides: Guide[] = [];
  const tools: Tool[] = [];
  const guideTags: GuideTag[] = [];
  const toolTags: ToolTag[] = [];
  const searchDocuments: SearchDocument[] = [];
  const slugToIdMap = new Map<string, { id: string; type: ContentType }>();

  for (const item of parsed) {
    const fm = item.frontmatter as GuideFrontmatter & ToolFrontmatter;
    const categoryId = categoryMap.get(fm.category)?.id ?? null;

    if (item.kind === 'guide') {
      const guide = indexGuide(item as ParsedContent<GuideFrontmatter>, categoryId);
      guides.push(guide);
      slugToIdMap.set(guide.slug, { id: guide.id, type: 'guide' });

      for (const tag of fm.tags ?? []) {
        const tagId = tagMap.get(tag)?.id;
        if (tagId) guideTags.push({ guide_id: guide.id, tag_id: tagId });
      }

      searchDocuments.push(
        buildSearchDocument(guide, 'guide', fm.tags ?? [], fm.category),
      );
    } else {
      const tool = indexTool(item as ParsedContent<ToolFrontmatter>, categoryId);
      tools.push(tool);
      slugToIdMap.set(tool.slug, { id: tool.id, type: 'tool' });

      for (const tag of fm.tags ?? []) {
        const tagId = tagMap.get(tag)?.id;
        if (tagId) toolTags.push({ tool_id: tool.id, tag_id: tagId });
      }

      searchDocuments.push(
        buildSearchDocument(tool, 'tool', fm.tags ?? [], fm.category),
      );
    }
  }

  // Build relations after all slugs are mapped
  const relations: ContentRelation[] = [];
  for (const item of parsed) {
    relations.push(
      ...buildRelations({
        sourceType: item.kind as ContentType,
        sourceSlug: (item.frontmatter as GuideFrontmatter & ToolFrontmatter).slug,
        frontmatter: item.frontmatter,
        slugToIdMap,
      }),
    );
  }

  return {
    guides,
    tools,
    categories: [...categoryMap.values()],
    tags: [...tagMap.values()],
    guideTags,
    toolTags,
    relations,
    searchDocuments,
  };
}
