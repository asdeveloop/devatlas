import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseMdx } from '../parser';
import { indexGuide, indexTool, buildSearchDocument, buildRelations } from '../indexer';
import type { GuideFrontmatter, ToolFrontmatter, ParsedContent, ContentType } from '../types';

const fixturesDir = join(__dirname, 'fixtures');

describe('indexGuide', () => {
  it('should create a Guide record from parsed content', () => {
    const raw = readFileSync(join(fixturesDir, 'guides/getting-started-with-react.mdx'), 'utf-8');
    const parsed = parseMdx(raw, '/content/guides/getting-started-with-react.mdx');
    const guide = indexGuide(parsed as ParsedContent<GuideFrontmatter>, 'cat-123');

    expect(guide.slug).toBe('getting-started-with-react');
    expect(guide.title).toBe('Getting Started with React');
    expect(guide.description).toBe('A beginner-friendly guide to building your first React application.');
    expect(guide.difficulty).toBe('beginner');
    expect(guide.reading_time).toBe(12);
    expect(guide.category_id).toBe('cat-123');
    expect(guide.id).toBeTruthy();
    expect(guide.content).toContain('# Getting Started with React');
  });
});

describe('indexTool', () => {
  it('should create a Tool record from parsed content', () => {
    const raw = readFileSync(join(fixturesDir, 'tools/visual-studio-code.mdx'), 'utf-8');
    const parsed = parseMdx(raw, '/content/tools/visual-studio-code.mdx');
    const tool = indexTool(parsed as ParsedContent<ToolFrontmatter>, 'cat-456');

    expect(tool.slug).toBe('visual-studio-code');
    expect(tool.name).toBe('Visual Studio Code');
    expect(tool.website).toBe('https://code.visualstudio.com');
    expect(tool.category_id).toBe('cat-456');
    expect(tool.popularity_score).toBe(0);
  });
});

describe('buildSearchDocument', () => {
  it('should build a search document from a guide', () => {
    const raw = readFileSync(join(fixturesDir, 'guides/getting-started-with-react.mdx'), 'utf-8');
    const parsed = parseMdx(raw, '/content/guides/getting-started-with-react.mdx');
    const guide = indexGuide(parsed as ParsedContent<GuideFrontmatter>, null);
    const doc = buildSearchDocument(guide, 'guide', ['react', 'javascript'], 'frontend');

    expect(doc.content_type).toBe('guide');
    expect(doc.title).toBe('Getting Started with React');
    expect(doc.tags).toEqual(['react', 'javascript']);
    expect(doc.category).toBe('frontend');
    expect(doc.url).toBe('/guides/getting-started-with-react');
  });
});

describe('buildRelations', () => {
  it('should build relations from frontmatter related fields', () => {
    const slugToIdMap = new Map<string, { id: string; type: ContentType }>([
      ['getting-started-with-react', { id: 'guide-1', type: 'guide' }],
      ['visual-studio-code', { id: 'tool-1', type: 'tool' }],
    ]);

    const relations = buildRelations({
      sourceType: 'guide',
      sourceSlug: 'getting-started-with-react',
      frontmatter: {
        title: 'Getting Started with React',
        slug: 'getting-started-with-react',
        summary: 'test',
        category: 'frontend',
        tags: ['react'],
        related_tools: ['visual-studio-code'],
      } as GuideFrontmatter,
      slugToIdMap,
    });

    expect(relations).toHaveLength(1);
    expect(relations[0]).toMatchObject({
      source_type: 'guide',
      source_id: 'guide-1',
      target_type: 'tool',
      target_id: 'tool-1',
      relation_type: 'related',
    });
  });

  it('should skip relations for unknown slugs', () => {
    const slugToIdMap = new Map<string, { id: string; type: ContentType }>([
      ['my-guide', { id: 'g-1', type: 'guide' }],
    ]);

    const relations = buildRelations({
      sourceType: 'guide',
      sourceSlug: 'my-guide',
      frontmatter: {
        title: 'My Guide',
        slug: 'my-guide',
        summary: 'test',
        category: 'cat',
        tags: ['t'],
        related_tools: ['nonexistent-tool'],
      } as GuideFrontmatter,
      slugToIdMap,
    });

    expect(relations).toHaveLength(0);
  });
});
