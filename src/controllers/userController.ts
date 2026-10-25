import type { Request, Response } from 'express';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateUserSchema } from '../schemas/userSchema.ts';
import { UserService } from '../services/userService.ts';

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  getUsers = async (_req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ status: 'success', data: await this.userService.getUsers() });
  };

  createUser = async (_req: Request, res: Response): Promise<Response> => {
    const input = getValidated<CreateUserSchema>(res, 'body');
    const user = await this.userService.createUser(input);
    return res.status(201).json({ status: 'success', data: user });
  };
}
