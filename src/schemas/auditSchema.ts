import { z } from 'zod';

export const auditQuerySchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  targetId: z.coerce.number().int().positive().optional(),
  targetTable: z.string().trim().max(50).optional(),
}).strict();

export const createAuditSchema = z.object({
  action: z.string().trim().min(1).max(50),
  targetTable: z.string().trim().min(1).max(50),
  targetId: z.number().int().positive(),
  metadata: z.union([z.string(), z.record(z.unknown())]).nullable().optional(),
}).strict();

export type AuditQuery = z.infer<typeof auditQuerySchema>;
export type CreateAuditInput = z.infer<typeof createAuditSchema>;
