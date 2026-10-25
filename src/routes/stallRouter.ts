import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { StallController } from '../controllers/stallController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { createReviewSchema } from '../schemas/reviewSchema.ts';
import {
  createStallSchema,
  idParamSchema,
  stallQuerySchema,
  updateStallSchema,
} from '../schemas/stallSchema.ts';

const stallRouter = Router();
const stallController = new StallController();
const reviewController = new ReviewController();

stallRouter.get('/', validate(stallQuerySchema, 'query'), stallController.getStalls);
stallRouter.get('/:id', validate(idParamSchema, 'params'), stallController.getStallById);
stallRouter.get('/:id/menus', validate(idParamSchema, 'params'), stallController.getStallMenus);
stallRouter.post(
  '/',
  authenticate,
  authorize('owner', 'admin'),
  validate(createStallSchema, 'body'),
  stallController.createStall,
);
stallRouter.put(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  validate(idParamSchema, 'params'),
  validate(updateStallSchema, 'body'),
  stallController.updateStall,
);
stallRouter.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(idParamSchema, 'params'),
  stallController.deleteStall,
);
stallRouter.post(
  '/:id/reviews',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(createReviewSchema, 'body'),
  reviewController.createForStall,
);

export { stallRouter };
