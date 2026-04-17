import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { buildContentIndex } from '../pipeline/';

const fixturesDir = join(__dirname, 'fixtures');

describe('buildContentIndex', () => {
  it('should build a complete content index from fixture files', async () => {
    const index = await buildContentIndex(fixturesDir);

    // 1 valid guide + 1 valid tool
    expect(index.guides).toHaveLength(1);
    expect(index.tools).toHaveLength(1);

    // Categories: "frontend" + "editors"
    expect(index.categories).toHaveLength(2);
    expect(index.categories.map((c) => c.slug).sort()).toEqual(['editors', 'frontend']);

    // Tags: react, javascript, beginner, editor, ide, microsoft
    expect(index.tags.length).toBeGreaterThanOrEqual(6);

    // Guide tags: 3 tags for the react guide
    expect(index.guideTags).toHaveLength(3);

    // Tool tags: 3 tags for vscode
    expect(index.toolTags).toHaveLength(3);

    // Search documents: 1 per entity
    expect(index.searchDocuments).toHaveLength(2);

    // Relations: guide -> tool (related_tools) + tool -> guide (related_guides)
    expect(index.relations).toHaveLength(2);
  });

  it('should generate correct URLs in search documents', async () => {
    const index = await buildContentIndex(fixturesDir);
    const urls = index.searchDocuments.map((d) => d.url).sort();

    expect(urls).toEqual([
      '/guides/getting-started-with-react',
      '/tools/visual-studio-code',
    ]);
  });

  it('should link guide and tool via content relations', async () => {
    const index = await buildContentIndex(fixturesDir);

    const guideToTool = index.relations.find(
      (r) => r.source_type === 'guide' && r.target_type === 'tool',
    );
    expect(guideToTool).toBeDefined();
    expect(guideToTool!.relation_type).toBe('related');

    const toolToGuide = index.relations.find(
      (r) => r.source_type === 'tool' && r.target_type === 'guide',
    );
    expect(toolToGuide).toBeDefined();
  });
});
