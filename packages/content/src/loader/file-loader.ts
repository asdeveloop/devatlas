import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

export async function loadMdxFiles(dir: string): Promise<Map<string, string>> {
  const files = await readdir(dir);
  const mdxFiles = files.filter((f) => extname(f) === ".mdx");

  const entries = await Promise.all(
    mdxFiles.map(async (file) => {
      const content = await readFile(join(dir, file), "utf-8");
      return [file, content] as const;
    }),
  );

  return new Map(entries);
}
