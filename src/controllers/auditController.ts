import type { Request, Response } from 'express';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { AuditQuery, CreateAuditInput } from '../schemas/auditSchema.ts';
import { AuditService } from '../services/auditService.ts';

export class AuditController {
  constructor(private readonly service = new AuditService()) {}

  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { userId, targetId, targetTable } = getValidated<AuditQuery>(res, 'query');
    const data = await this.service.getAuditLogs({ userId, targetId, targetTable });
    return res.status(200).json({ status: 'success', data });
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const { action, targetTable, targetId, metadata } = getValidated<CreateAuditInput>(res, 'body');
    const data = await this.service.createAuditLog({
      userId: getUser(req).id,
      action,
      targetTable: targetTable.toUpperCase(),
      targetId,
      metadata: metadata === undefined || metadata === null
        ? null
        : typeof metadata === 'string'
          ? metadata
          : JSON.stringify(metadata),
    });
    return res.status(201).json({ status: 'success', data });
  };
}