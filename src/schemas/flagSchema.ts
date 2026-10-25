import { z } from 'zod';

export const flagParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateFlagSchema = z.object({
  status: z.enum(['pending', 'resolved', 'rejected']),
}).strict();

export type FlagParams = z.infer<typeof flagParamsSchema>;
export type UpdateFlagInput = z.infer<typeof updateFlagSchema>;
