import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { createMenuItemSchema, updateMenuItemSchema } from '../schemas/menuItemSchema.ts';
import { idParamSchema } from '../schemas/stallSchema.ts';

const menuItemRouter = Router();
const controller = new MenuItemController();

menuItemRouter.get('/', controller.getAll);
menuItemRouter.post(
  '/',
  authenticate,
  authorize('owner', 'admin'),
  validate(createMenuItemSchema, 'body'),
  controller.create,
);
menuItemRouter.get('/:id', validate(idParamSchema, 'params'), controller.getById);
menuItemRouter.put(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  validate(idParamSchema, 'params'),
  validate(updateMenuItemSchema, 'body'),
  controller.update,
);
menuItemRouter.delete(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  validate(idParamSchema, 'params'),
  controller.delete,
);

export { menuItemRouter };