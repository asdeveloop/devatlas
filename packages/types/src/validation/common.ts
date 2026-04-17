import { z } from 'zod';

/** Slug pattern — فقط حروف کوچک، اعداد، و خط‌تیره */
export const slugSchema = z
  .string()
  .min(2)
  .max(200)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug can only contain lowercase letters, numbers, and hyphens',
  );

/** UUID validation */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/** آرایه‌ای از UUID ها */
export const uuidArraySchema = z
  .array(uuidSchema)
  .max(50, 'Maximum 50 items allowed');

/** پارامترهای pagination — با default های منطقی */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

/** Sort order */
export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');
