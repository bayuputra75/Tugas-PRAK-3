import type { Request, Response } from 'express';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateStallInput, IdParam, StallQuery, UpdateStallInput } from '../schemas/stallSchema.ts';
import { StallService } from '../services/stallService.ts';

export class StallController {
  constructor(private readonly stallService = new StallService()) {}

  getStalls = async (_req: Request, res: Response): Promise<Response> => {
    const { page, limit, search, category } = getValidated<StallQuery>(res, 'query');
    const { data, total } = await this.stallService.getAllStalls({ page, limit, search, category });
    return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
  };

  getStallById = async (_req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const stall = await this.stallService.getStallById(id);
    return res.status(200).json({ status: 'success', data: stall });
  };

  getStallMenus = async (_req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const menus = await this.stallService.getStallMenus(id);
    return res.status(200).json({ status: 'success', data: menus });
  };

  createStall = async (_req: Request, res: Response): Promise<Response> => {
    const input = getValidated<CreateStallInput>(res, 'body');
    const stall = await this.stallService.createStall(input, getUser(_req).id);
    return res.status(201).json({ status: 'success', data: stall });
  };

  updateStall = async (_req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const input = getValidated<UpdateStallInput>(res, 'body');
    const stall = await this.stallService.updateStall(id, input, getUser(_req));
    return res.status(200).json({ status: 'success', data: stall });
  };

  deleteStall = async (_req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const stall = await this.stallService.deleteStall(id);
    return res.status(200).json({ status: 'success', data: stall });
  };
}
