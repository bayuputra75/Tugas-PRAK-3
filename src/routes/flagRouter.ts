import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { flagParamsSchema, updateFlagSchema } from '../schemas/flagSchema.ts';

const flagRouter = Router();
const controller = new FlagController();

flagRouter.get('/', authenticate, authorize('admin'), (req, res) => controller.getAll(req, res));
flagRouter.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(flagParamsSchema, 'params'),
  validate(updateFlagSchema, 'body'),
  controller.updateStatus,
);

export { flagRouter };