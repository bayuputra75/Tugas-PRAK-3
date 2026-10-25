import type { Request, Response } from 'express';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateMenuItemInput, UpdateMenuItemInput } from '../schemas/menuItemSchema.ts';
import type { IdParam } from '../schemas/stallSchema.ts';
import { MenuItemService } from '../services/menuItemService.ts';

export class MenuItemController {
  constructor(private readonly service = new MenuItemService()) {}

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ status: 'success', data: await this.service.getMenuItems() });
  };

  getById = async (_req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<IdParam>(res, 'params');
    return res.status(200).json({ status: 'success', data: await this.service.getMenuItem(id) });
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const input = getValidated<CreateMenuItemInput>(res, 'body');
    return res.status(201).json({
      status: 'success',
      data: await this.service.createMenuItem(input, getUser(req)),
    });
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const input = getValidated<UpdateMenuItemInput>(res, 'body');
    return res.status(200).json({
      status: 'success',
      data: await this.service.updateMenuItem(id, input, getUser(req)),
    });
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<IdParam>(res, 'params');
    return res.status(200).json({
      status: 'success',
      data: await this.service.deleteMenuItem(id, getUser(req)),
    });
  };
}
