import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { loadContent } from '../loader';

const fixturesDir = join(__dirname, 'fixtures');

describe('loadContent', () => {
  it('should load all valid MDX files from content directory', async () => {
    const result = await loadContent(fixturesDir);

    // 2 valid files (1 guide + 1 tool), 2 invalid files → errors
    expect(result.parsed.length).toBe(2);
    expect(result.errors.length).toBe(2);
  });

  it('should correctly identify guide and tool kinds', async () => {
    const result = await loadContent(fixturesDir);
    const kinds = result.parsed.map((p) => p.kind).sort();

    expect(kinds).toEqual(['guide', 'tool']);
  });

  it('should capture parse errors with file paths', async () => {
    const result = await loadContent(fixturesDir);

    for (const err of result.errors) {
      expect(err.filePath).toBeTruthy();
      expect(err.error).toBeInstanceOf(Error);
    }
  });
});
