import { z } from 'zod';

export const reviewQuerySchema = z.object({
  stallId: z.coerce.number().int().positive().optional(),
}).strict();

export const reviewParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createReviewSchema = z.object({
  rating: z.number({ required_error: 'rating wajib diisi', invalid_type_error: 'rating harus berupa angka' })
    .int('rating harus bilangan bulat')
    .min(1, 'rating minimal 1')
    .max(5, 'rating maksimal 5'),
  comment: z.string().trim().max(1000, 'comment maksimal 1000 karakter').optional(),
}).strict({ message: 'body hanya boleh berisi rating dan comment' });

export const createLegacyReviewSchema = z.object({
  stallId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
}).strict({ message: 'body hanya boleh berisi stallId, rating, dan comment' });

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateLegacyReviewInput = z.infer<typeof createLegacyReviewSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
export type ReviewParams = z.infer<typeof reviewParamsSchema>;
