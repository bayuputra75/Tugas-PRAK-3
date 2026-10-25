import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number({ invalid_type_error: 'id harus berupa angka' })
    .int('id harus bilangan bulat')
    .positive('id harus lebih dari 0'),
});

export const stallQuerySchema = z.object({
  search: z.string().trim().max(100, 'search maksimal 100 karakter').optional(),
  category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
  page: z.coerce.number({ invalid_type_error: 'page harus berupa angka' })
    .int('page harus bilangan bulat')
    .min(1, 'page minimal 1')
    .default(1),
  limit: z.coerce.number({ invalid_type_error: 'limit harus berupa angka' })
    .int('limit harus bilangan bulat')
    .min(1, 'limit minimal 1')
    .max(100, 'limit maksimal 100')
    .default(10),
}).strict();

const optionalText = (max: number) => z.string().trim().max(max).optional();

export const createStallSchema = z.object({
  name: z.string({ required_error: 'name wajib diisi' })
    .trim()
    .min(3, 'name minimal 3 karakter')
    .max(100, 'name maksimal 100 karakter'),
  category: optionalText(50),
  location: optionalText(100),
  description: optionalText(1000),
}).strict({ message: 'body hanya boleh berisi name, category, location, dan description' });

export const updateStallSchema = createStallSchema.partial()
  .strict({ message: 'body hanya boleh berisi name, category, location, dan description' });

export type StallQuery = z.infer<typeof stallQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type CreateStallInput = z.infer<typeof createStallSchema>;
export type UpdateStallInput = z.infer<typeof updateStallSchema>;
