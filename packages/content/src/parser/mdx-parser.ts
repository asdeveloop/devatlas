import matter from "gray-matter";
import type { ZodSchema } from "zod";

export interface ParsedMdx<T> {
  frontmatter: T;
  body: string;
}

export function parseMdx<T>(raw: string, schema: ZodSchema<T>): ParsedMdx<T> {
  const { data, content } = matter(raw);
  const frontmatter = schema.parse(data);
  return { frontmatter, body: content.trim() };
}
