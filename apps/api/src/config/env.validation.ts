import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
});

export type EnvVars = z.infer<typeof envSchema>;
