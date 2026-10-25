import { z } from 'zod';

export const createMenuItemSchema = z.object({
  stallId: z.number().int().positive(),
  name: z.string().trim().min(1).max(100),
  price: z.number().int().min(0),
  isAvailable: z.boolean(),
}).strict();

export const updateMenuItemSchema = createMenuItemSchema.partial()
  .strict()
  .refine((input) => Object.keys(input).length > 0, 'minimal satu field harus diisi');

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
