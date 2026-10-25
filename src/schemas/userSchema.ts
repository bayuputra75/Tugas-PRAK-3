import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email: z.string().trim().toLowerCase().email().max(150),
  password: z.string().min(8).max(72),
  role: z.enum(['admin', 'owner', 'customer']),
}).strict();

export type CreateUserSchema = z.infer<typeof createUserSchema>;
