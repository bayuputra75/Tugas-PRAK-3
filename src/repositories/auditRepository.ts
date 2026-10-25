import { and, desc, eq, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs } from '../db/schema.ts';

export interface CreateAuditInput {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: string | null;
}

export interface FindAuditParams {
  userId?: number;
  targetTable?: string;
  targetId?: number;
}

export class AuditRepository {
  async findAll(params: FindAuditParams) {
    const db = await getDb();
    const conditions: SQL[] = [];
    if (params.userId !== undefined) conditions.push(eq(auditLogs.userId, params.userId));
    if (params.targetTable) conditions.push(eq(auditLogs.targetTable, params.targetTable));
    if (params.targetId !== undefined) conditions.push(eq(auditLogs.targetId, params.targetId));
    return db.select().from(auditLogs)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id));
  }

  async create(input: CreateAuditInput) {
    const db = await getDb();
    const rows = await db.insert(auditLogs).output().values({ ...input, createdAt: new Date() });
    return rows[0];
  }
}