import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { parseMdx, ContentParseError } from '../parser';

const fixturesDir = join(__dirname, 'fixtures');

describe('parseMdx', () => {
  it('should parse a valid guide MDX file', () => {
    const raw = readFileSync(join(fixturesDir, 'guides/getting-started-with-react.mdx'), 'utf-8');
    const result = parseMdx(raw, '/content/guides/getting-started-with-react.mdx');

    expect(result.kind).toBe('guide');
    expect(result.frontmatter).toMatchObject({
      title: 'Getting Started with React',
      slug: 'getting-started-with-react',
      category: 'frontend',
      difficulty: 'beginner',
    });
    expect(result.body).toContain('# Getting Started with React');
  });

  it('should parse a valid tool MDX file', () => {
    const raw = readFileSync(join(fixturesDir, 'tools/visual-studio-code.mdx'), 'utf-8');
    const result = parseMdx(raw, '/content/tools/visual-studio-code.mdx');

    expect(result.kind).toBe('tool');
    expect(result.frontmatter).toMatchObject({
      name: 'Visual Studio Code',
      slug: 'visual-studio-code',
      category: 'editors',
    });
  });

  it('should throw ContentParseError for invalid guide', () => {
    const raw = readFileSync(join(fixturesDir, 'guides/invalid-guide.mdx'), 'utf-8');

    expect(() => parseMdx(raw, '/content/guides/invalid-guide.mdx')).toThrow(ContentParseError);
  });

  it('should throw ContentParseError for invalid tool', () => {
    const raw = readFileSync(join(fixturesDir, 'tools/invalid-tool.mdx'), 'utf-8');

    expect(() => parseMdx(raw, '/content/tools/invalid-tool.mdx')).toThrow(ContentParseError);
  });

  it('should throw when content kind cannot be detected', () => {
    expect(() => parseMdx('---\ntitle: x\n---\nbody', '/unknown/path.mdx')).toThrow(
      ContentParseError,
    );
  });
});
