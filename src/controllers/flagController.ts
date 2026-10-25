import type { Request, Response } from 'express';
import { getValidated } from '../middlewares/validate.ts';
import type { FlagParams, UpdateFlagInput } from '../schemas/flagSchema.ts';
import { FlagService } from '../services/flagService.ts';

export class FlagController {
  constructor(private readonly service = new FlagService()) {}

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ status: 'success', data: await this.service.getFlags() });
  };

  updateStatus = async (_req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<FlagParams>(res, 'params');
    const { status } = getValidated<UpdateFlagInput>(res, 'body');
    return res.status(200).json({
      status: 'success',
      data: await this.service.updateFlagStatus(id, status),
    });
  };
}
