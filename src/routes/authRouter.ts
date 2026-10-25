import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { validate } from '../middlewares/validate.ts';
import { loginSchema, registerSchema } from '../schemas/authSchema.ts';

const authRouter = Router();
const controller = new AuthController();

authRouter.post('/register', validate(registerSchema, 'body'), controller.register);
authRouter.post('/login', validate(loginSchema, 'body'), controller.login);
authRouter.get('/me', authenticate, controller.getMe);

export { authRouter };
