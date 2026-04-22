import { z } from 'zod';

const webEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:3001'),
});

const parsedEnv = webEnvSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env['NEXT_PUBLIC_API_BASE_URL'],
});

export const webEnv = {
  appName: 'DevAtlas',
  apiBaseUrl: parsedEnv.NEXT_PUBLIC_API_BASE_URL,
} as const;
