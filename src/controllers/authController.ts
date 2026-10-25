import type { Request, Response } from 'express';
import { AuthService } from '../services/authService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { LoginInput, RegisterInput } from '../schemas/authSchema.ts';

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  register = async (_req: Request, res: Response): Promise<Response> => {
    const user = await this.authService.register(getValidated<RegisterInput>(res, 'body'));
    return res.status(201).json({ status: 'success', data: { user } });
  };

  login = async (_req: Request, res: Response): Promise<Response> => {
    const data = await this.authService.login(getValidated<LoginInput>(res, 'body'));
    return res.status(200).json({ status: 'success', data });
  };

  getMe = (req: Request, res: Response): Response => {
    return res.status(200).json({ status: 'success', data: getUser(req) });
  };
}
